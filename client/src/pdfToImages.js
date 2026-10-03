import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import JSZip from 'jszip';

GlobalWorkerOptions.workerSrc = workerUrl;

export async function renderPdfToJpgZip(file) {
  const document = await getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  if (document.numPages > 25) {
    await document.destroy();
    throw new Error('PDF to JPG supports up to 25 pages at a time in your browser.');
  }
  const zip = new JSZip();
  try {
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const baseViewport = page.getViewport({ scale: 1 });
      const scale = Math.min(1.6, 2200 / Math.max(baseViewport.width, baseViewport.height));
      const viewport = page.getViewport({ scale });
      const canvas = window.document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const context = canvas.getContext('2d', { alpha: false });
      if (!context) throw new Error('Your browser could not create an image canvas.');
      await page.render({ canvasContext: context, viewport }).promise;
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92));
      if (!blob) throw new Error(`Could not create JPG for PDF page ${pageNumber}.`);
      zip.file(`page-${String(pageNumber).padStart(3, '0')}.jpg`, blob);
      canvas.width = 0;
      canvas.height = 0;
      page.cleanup();
    }
    return await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 3 } });
  } finally {
    await document.destroy();
  }
}
