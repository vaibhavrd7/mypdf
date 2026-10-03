import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import sharp from 'sharp';
import { fileTypeFromBuffer } from 'file-type';
import { PDFDocument, StandardFonts, degrees, rgb } from 'pdf-lib';

const app = express();
const positiveInteger = (value, fallback) => {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
};
const port = positiveInteger(process.env.PORT, 5000);
const maxMb = positiveInteger(process.env.MAX_FILE_SIZE_MB, 15);
const maxTotalUploadMb = Math.max(maxMb, positiveInteger(process.env.MAX_TOTAL_UPLOAD_MB, 40));
const maxConcurrentUploads = positiveInteger(process.env.MAX_CONCURRENT_UPLOADS, 2);
const configuredProxyHops = process.env.TRUST_PROXY_HOPS === undefined
  ? (process.env.NODE_ENV === 'production' ? 1 : 0)
  : Number(process.env.TRUST_PROXY_HOPS);
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',').map((s) => s.trim());
const formats = {
  'jpg-to-webp': { input: ['image/jpeg'], output: 'webp', mime: 'image/webp', ext: 'webp' },
  'png-to-webp': { input: ['image/png'], output: 'webp', mime: 'image/webp', ext: 'webp' },
  'webp-to-jpg': { input: ['image/webp'], output: 'jpeg', mime: 'image/jpeg', ext: 'jpg' },
  'jpg-to-png': { input: ['image/jpeg'], output: 'png', mime: 'image/png', ext: 'png' },
  'compress-image': { input: ['image/jpeg', 'image/png', 'image/webp'] },
  'resize-image': { input: ['image/jpeg', 'image/png', 'image/webp'] },
};

app.disable('x-powered-by');
if (Number.isSafeInteger(configuredProxyHops) && configuredProxyHops >= 0) app.set('trust proxy', configuredProxyHops);
app.use(helmet());
app.use(cors({ origin(origin, callback) {
  if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
  return callback(new Error('This website is not allowed to use the API.'));
} }));
app.use(express.json({ limit: '10kb' }));
app.use('/api', rateLimit({ windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000), limit: Number(process.env.RATE_LIMIT_MAX || 40), standardHeaders: 'draft-7', legacyHeaders: false }));
let activeUploadRequests = 0;
function limitConcurrentUploads(_req, res, next) {
  if (activeUploadRequests >= maxConcurrentUploads) {
    return res.status(503).set('Retry-After', '15').json({ error: 'The file service is busy. Try again shortly.' });
  }
  activeUploadRequests += 1;
  let released = false;
  const release = () => {
    if (released) return;
    released = true;
    activeUploadRequests = Math.max(0, activeUploadRequests - 1);
  };
  res.once('finish', release);
  res.once('close', release);
  next();
}
function limitedMemoryStorage(maxBytes) {
  return {
    _handleFile(req, file, callback) {
      const chunks = [];
      let fileSize = 0;
      let settled = false;
      file.stream.on('data', (chunk) => {
        if (settled) return;
        fileSize += chunk.length;
        if ((req.uploadedFileBytes || 0) + fileSize > maxBytes) {
          settled = true;
          chunks.length = 0;
          const error = new Error(`Files must total ${maxTotalUploadMb} MB or less.`);
          error.code = 'LIMIT_TOTAL_UPLOAD_SIZE';
          callback(error);
          return;
        }
        chunks.push(chunk);
      });
      file.stream.on('error', (error) => {
        if (settled) return;
        settled = true;
        callback(error);
      });
      file.stream.on('end', () => {
        if (settled) return;
        settled = true;
        req.uploadedFileBytes = (req.uploadedFileBytes || 0) + fileSize;
        callback(null, { buffer: Buffer.concat(chunks, fileSize), size: fileSize });
      });
    },
    _removeFile(_req, file, callback) {
      delete file.buffer;
      callback(null);
    },
  };
}
const uploadStorage = limitedMemoryStorage(maxTotalUploadMb * 1024 * 1024);
const imageUpload = multer({ storage: uploadStorage, limits: { fileSize: maxMb * 1024 * 1024, files: 1, fields: 8, fieldSize: 16 * 1024, parts: 9 } });
const pdfUpload = multer({ storage: uploadStorage, limits: { fileSize: maxMb * 1024 * 1024, files: 10, fields: 8, fieldSize: 16 * 1024, parts: 18 } });

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'mypdf-api' }));
app.post('/api/convert', limitConcurrentUploads, imageUpload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Choose an image to continue.' });
    const tool = formats[req.body.tool];
    if (!tool) return res.status(400).json({ error: 'That image tool is not available.' });
    const detected = await fileTypeFromBuffer(req.file.buffer);
    if (!detected || !tool.input.includes(detected.mime)) return res.status(415).json({ error: 'The file contents do not match an image format supported by this tool.' });
    const quality = Math.min(100, Math.max(1, Number.parseInt(req.body.quality || '80', 10) || 80));
    const metadata = await sharp(req.file.buffer, { limitInputPixels: 40_000_000 }).metadata();
    if (!metadata.width || !metadata.height) return res.status(400).json({ error: 'This image could not be read.' });
    let pipeline = sharp(req.file.buffer, { limitInputPixels: 40_000_000, failOn: 'error' }).rotate();
    let output;
    if (req.body.tool === 'resize-image') {
      const width = Number.parseInt(req.body.width, 10);
      const height = Number.parseInt(req.body.height, 10);
      if ((!width && !height) || width > 12000 || height > 12000 || width < 0 || height < 0) return res.status(400).json({ error: 'Enter a width or height from 1 to 12,000 pixels.' });
      pipeline = pipeline.resize({ width: width || undefined, height: height || undefined, fit: 'inside', withoutEnlargement: true });
    }
    if (req.body.tool === 'compress-image') {
      const fmt = detected.mime === 'image/jpeg' ? 'jpeg' : detected.mime === 'image/png' ? 'png' : 'webp';
      pipeline = pipeline.toFormat(fmt, fmt === 'png' ? { compressionLevel: 9, effort: 8, palette: true, quality } : { quality, effort: 5 });
    } else {
      const outputFormat = tool.output;
      pipeline = pipeline.toFormat(outputFormat, outputFormat === 'webp' ? { quality, effort: 5 } : outputFormat === 'jpeg' ? { quality, mozjpeg: true } : { compressionLevel: 9, effort: 8 });
    }
    ({ data: output } = await pipeline.toBuffer({ resolveWithObject: true }));
    const ext = tool.ext || detected.ext;
    const mime = tool.mime || detected.mime;
    const base = (req.file.originalname || 'image').replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]+/g, '-').slice(0, 70) || 'image';
    res.set({ 'Content-Type': mime, 'Content-Disposition': `attachment; filename="${base}.${ext}"`, 'Content-Length': output.length, 'Cache-Control': 'no-store' });
    return res.send(output);
  } catch (error) { return next(error); }
});

function clientInputError(message) { return Object.assign(new Error(message), { statusCode: 400 }); }

function parsePageList(value, pageCount) {
  if (typeof value !== 'string' || !value.trim()) throw clientInputError('Enter page numbers, such as 1,3-5.');
  const pages = [];
  for (const part of value.split(',').map((item) => item.trim())) {
    const match = part.match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!match) throw clientInputError('Use page numbers or ranges separated by commas, for example 1,3-5.');
    const start = Number(match[1]);
    const end = Number(match[2] || match[1]);
    if (start < 1 || end < start || end > pageCount) throw Object.assign(new Error(`Page numbers must be between 1 and ${pageCount}.`), { statusCode: 400 });
    for (let page = start; page <= end; page += 1) pages.push(page - 1);
  }
  if (new Set(pages).size !== pages.length) throw clientInputError('Each page may only be listed once.');
  return pages;
}

app.post('/api/pdf/:operation', limitConcurrentUploads, pdfUpload.array('files', 10), async (req, res) => {
  const operation = req.params.operation;
  const files = req.files || [];
  const pdfOperations = new Set(['merge', 'split', 'organize', 'compress', 'rotate', 'watermark', 'page-numbers', 'crop', 'sign']);
  if (!pdfOperations.has(operation) && operation !== 'image-to-pdf') return res.status(404).json({ error: 'That PDF tool is not available.' });
  if (!files.length) return res.status(400).json({ error: 'Choose a file to continue.' });
  if (operation === 'merge' && files.length < 2) return res.status(400).json({ error: 'Choose at least two PDF files to merge.' });
  if (operation !== 'merge' && operation !== 'image-to-pdf' && files.length !== 1) return res.status(400).json({ error: 'Choose one PDF file for this tool.' });
  try {
    let output;
    if (operation === 'image-to-pdf') {
      const pdf = await PDFDocument.create();
      for (const file of files) {
        const detected = await fileTypeFromBuffer(file.buffer);
        const metadata = await sharp(file.buffer, { limitInputPixels: 40_000_000 }).metadata();
        if (!detected || !['image/jpeg', 'image/png'].includes(detected.mime) || !metadata.width || !metadata.height) throw clientInputError('Choose JPG or PNG images only.');
        if (metadata.width > 14400 || metadata.height > 14400) throw clientInputError('Image dimensions must be 14,400 pixels or smaller.');
        const image = detected.mime === 'image/jpeg' ? await pdf.embedJpg(file.buffer) : await pdf.embedPng(file.buffer);
        const page = pdf.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }
      output = await pdf.save({ useObjectStreams: true });
    } else {
      for (const file of files) if (file.buffer.subarray(0, 5).toString('ascii') !== '%PDF-') throw clientInputError('One or more selected files are not valid PDFs.');
      if (operation === 'merge') {
        const merged = await PDFDocument.create();
        for (const file of files) {
          const source = await PDFDocument.load(file.buffer);
          if (source.getPageCount() > 250 || merged.getPageCount() + source.getPageCount() > 250) throw clientInputError('A PDF may contain no more than 250 pages for this operation.');
          const pages = await merged.copyPages(source, source.getPageIndices());
          pages.forEach((page) => merged.addPage(page));
        }
        output = await merged.save({ useObjectStreams: true });
      } else {
        const pdf = await PDFDocument.load(files[0].buffer);
        const count = pdf.getPageCount();
        if (!count || count > 250) throw clientInputError('This tool supports PDFs with up to 250 pages.');
        if (operation === 'split') {
          const selected = parsePageList(req.body.pages, count);
          const extracted = await PDFDocument.create();
          const pages = await extracted.copyPages(pdf, selected);
          pages.forEach((page) => extracted.addPage(page));
          output = await extracted.save({ useObjectStreams: true });
        } else if (operation === 'organize') {
          const selected = parsePageList(req.body.pages, count);
          if (selected.length !== count || new Set(selected).size !== count) throw clientInputError(`Enter every page from 1 to ${count} exactly once.`);
          const arranged = await PDFDocument.create();
          const pages = await arranged.copyPages(pdf, selected);
          pages.forEach((page) => arranged.addPage(page));
          output = await arranged.save({ useObjectStreams: true });
        } else if (operation === 'compress') {
          output = await pdf.save({ useObjectStreams: true });
        } else if (operation === 'rotate') {
          const amount = Number.parseInt(req.body.rotation, 10);
          if (![90, 180, 270].includes(amount)) throw clientInputError('Choose a rotation of 90, 180, or 270 degrees.');
          for (const page of pdf.getPages()) page.setRotation(degrees((page.getRotation().angle + amount) % 360));
          output = await pdf.save({ useObjectStreams: true });
        } else if (operation === 'watermark') {
          const text = String(req.body.watermark || '').trim().slice(0, 80);
          if (!text) throw clientInputError('Enter watermark text.');
          const font = await pdf.embedFont(StandardFonts.Helvetica);
          for (const page of pdf.getPages()) {
            const { width, height } = page.getSize();
            const size = Math.max(20, Math.min(58, width / Math.max(text.length * 0.7, 8)));
            const textWidth = font.widthOfTextAtSize(text, size);
            page.drawText(text, { x: Math.max(12, (width - textWidth) / 2), y: height / 2, size, font, color: rgb(0.45, 0.45, 0.48), opacity: 0.22, rotate: degrees(-30) });
          }
          output = await pdf.save({ useObjectStreams: true });
        } else if (operation === 'page-numbers') {
          const font = await pdf.embedFont(StandardFonts.Helvetica);
          pdf.getPages().forEach((page, index) => {
            const { width } = page.getSize();
            const text = String(index + 1);
            const size = 10;
            page.drawText(text, { x: (width - font.widthOfTextAtSize(text, size)) / 2, y: 18, size, font, color: rgb(0.25, 0.25, 0.28) });
          });
          output = await pdf.save({ useObjectStreams: true });
        } else if (operation === 'crop') {
          const left = Number(req.body.left);
          const bottom = Number(req.body.bottom);
          const width = Number(req.body.width);
          const height = Number(req.body.height);
          if (![left, bottom, width, height].every(Number.isFinite) || left < 0 || bottom < 0 || width <= 0 || height <= 0 || left + width > 100 || bottom + height > 100) throw clientInputError('Enter a valid crop area. Left + width and bottom + height must each be 100% or less.');
          for (const page of pdf.getPages()) {
            const box = page.getMediaBox();
            page.setCropBox(box.x + box.width * left / 100, box.y + box.height * bottom / 100, box.width * width / 100, box.height * height / 100);
          }
          output = await pdf.save({ useObjectStreams: true });
        } else if (operation === 'sign') {
          const signature = String(req.body.signature || '').trim().slice(0, 80);
          if (!signature) throw clientInputError('Enter the name you want to show as a signature.');
          const font = await pdf.embedFont(StandardFonts.TimesRomanItalic);
          const page = pdf.getPages().at(-1);
          const { width, height } = page.getSize();
          const size = Math.max(16, Math.min(28, width / 24));
          const textWidth = font.widthOfTextAtSize(signature, size);
          page.drawText(signature, { x: Math.max(24, width - textWidth - 48), y: Math.max(24, height * 0.08), size, font, color: rgb(0.14, 0.2, 0.35) });
          output = await pdf.save({ useObjectStreams: true });
        }
      }
    }
    const suffix = operation === 'image-to-pdf' ? 'images' : operation;
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="MyPDF-${suffix}.pdf"`, 'Content-Length': output.length, 'Cache-Control': 'no-store' });
    return res.send(Buffer.from(output));
  } catch (error) {
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: `Files must be ${maxMb} MB or smaller.` });
    if (error.code === 'LIMIT_TOTAL_UPLOAD_SIZE') return res.status(413).json({ error: `Files must total ${maxTotalUploadMb} MB or less.` });
    if (error.message?.includes('encrypted')) return res.status(400).json({ error: 'Password-protected PDFs are not supported.' });
    if (error instanceof multer.MulterError) return res.status(400).json({ error: 'The uploaded form could not be processed.' });
    if (error.statusCode && error.statusCode < 500) return res.status(error.statusCode).json({ error: error.message });
    console.error('PDF processing error:', error.message);
    return res.status(422).json({ error: 'We could not process that PDF. Try another file.' });
  }
});

app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: `Files must be ${maxMb} MB or smaller.` });
  if (error.code === 'LIMIT_TOTAL_UPLOAD_SIZE') return res.status(413).json({ error: `Files must total ${maxTotalUploadMb} MB or less.` });
  if (error instanceof multer.MulterError) return res.status(400).json({ error: 'The uploaded form could not be processed.' });
  if (error.message?.includes('not allowed to use the API')) return res.status(403).json({ error: 'This website is not allowed to use the API.' });
  console.error('Image processing error:', error.message);
  return res.status(422).json({ error: 'We could not process that image. Try another file.' });
});

app.listen(port, '0.0.0.0', () => console.log(`MyPDF API listening on port ${port}`));
