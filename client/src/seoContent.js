export const homeSeo = {
  title: 'Free Online Image & PDF Tools | MyPDF',
  description: 'Convert, compress, and resize images or merge, split, rotate, watermark, and organize PDFs online with free MyPDF tools.',
};

export const toolSeo = {
  'jpg-to-webp': {
    title: 'JPG to WebP Converter — Free Online, Adjustable Quality | MyPDF',
    description: 'Convert JPG photos to WebP online. Adjust quality, preview your image, and download the converted file. Free, no account required.',
    intro: 'WebP is a modern image format that can make photographic images smaller while keeping them clear. Convert a JPEG photo to WebP, choose the quality level that suits your use, then download the result.',
    benefits: ['Choose a quality setting from 1% to 100%.', 'Preview your selected photo before conversion.', 'The original JPG is not changed; the new WebP downloads separately.'],
    faq: [['Will converting JPG to WebP always make the file smaller?', 'Not always. The result depends on the image and quality setting. Compare the file sizes after conversion before replacing an original.'], ['Does MyPDF keep my photo?', 'The API processes the upload in memory and returns the result without saving the image to disk or a database.'], ['Can I convert several JPGs at once?', 'This first version handles one image per conversion. Batch conversion is not available yet.']],
  },
  'png-to-webp': {
    title: 'PNG to WebP Converter — Keep Transparency Online | MyPDF',
    description: 'Convert PNG graphics to WebP online and keep transparent backgrounds. Choose quality and download a new image for free.',
    intro: 'Convert a PNG graphic to WebP while retaining its transparent background. This is useful for web graphics, icons, and cutouts where transparency matters. Check the result before using it in production.',
    benefits: ['Transparent PNG backgrounds are supported.', 'Set the output quality before converting.', 'Your original PNG stays on your device unchanged.'],
    faq: [['Will the WebP file keep transparency?', 'Yes. PNG input is encoded as WebP with its alpha channel, so transparent areas remain transparent.'], ['Is WebP supported in modern browsers?', 'WebP is supported by current major browsers, though you should check the needs of your audience and software before replacing important originals.'], ['Why might the converted file be larger?', 'Some images are already efficiently compressed. A format change does not guarantee a smaller result; compare the output size.']],
  },
  'webp-to-jpg': {
    title: 'WebP to JPG Converter — Free Online Image Conversion | MyPDF',
    description: 'Convert a WebP image to JPG online for broader compatibility. Set image quality and download the JPEG in seconds.',
    intro: 'JPG is widely supported by photo editors, websites, and older software. Convert a WebP image to JPEG when a service or device does not accept WebP. JPEG does not support transparency, so transparent pixels are filled with a white background.',
    benefits: ['Adjust JPEG quality from 1% to 100%.', 'A white background is used where WebP pixels are transparent.', 'The downloaded JPG is a separate file; the WebP original is not altered.'],
    faq: [['What happens to transparent areas?', 'JPG has no transparency channel. Transparent areas in the WebP are flattened onto white in the converted JPG.'], ['Will JPG look identical to WebP?', 'JPEG is a lossy format. Fine details or colors can change slightly depending on the quality you choose.'], ['Can I use this for multiple files?', 'The current converter accepts one image at a time.']],
  },
  'jpg-to-png': {
    title: 'JPG to PNG Converter — Free Online, High Quality | MyPDF',
    description: 'Convert JPG photographs to PNG online. Create a separate PNG file in a few clicks with this free image converter.',
    intro: 'PNG is a lossless image format often used for screenshots, diagrams, and graphics that need crisp edges. Converting a JPG to PNG does not restore details already removed by JPEG compression, but it creates a PNG copy that can be edited or shared in PNG-only workflows.',
    benefits: ['Create a PNG copy without editing your JPG original.', 'Useful when an upload form or editor requires PNG.', 'The converted result is available to download immediately.'],
    faq: [['Does JPG to PNG improve the image quality?', 'No. Conversion changes the file format but cannot recover information lost when the JPG was created.'], ['Will the PNG have a transparent background?', 'No. Converting a JPG to PNG does not create transparency; the JPG background remains part of the image.'], ['Why is my PNG larger?', 'PNG is lossless and often larger for photographic images. Use the compressor or keep the JPG if a smaller photo file is your priority.']],
  },
  'compress-image': {
    title: 'Compress Images Online — Free JPG, PNG & WebP Compressor | MyPDF',
    description: 'Compress a JPG, PNG or WebP image online. Adjust quality, compare the resulting file size, and download your optimized image for free.',
    intro: 'Reduce image file size for websites, forms, and sharing. MyPDF re-encodes your JPG, PNG, or WebP using your selected quality setting. Compression results vary by image, so compare the output visually and by file size.',
    benefits: ['Supports JPG, PNG, and WebP uploads.', 'Use the quality slider to balance detail and file size.', 'Compare the original and compressed file sizes before downloading.'],
    faq: [['Will compression reduce every image by the same amount?', 'No. Image content, dimensions, format, and quality setting all affect the result.'], ['Does compression change my image dimensions?', 'No. The compressor keeps the image dimensions. Use the resize tool if you need a smaller width or height.'], ['Is compression reversible?', 'Lossy quality settings can discard image data. Keep your original if you may need it later.']],
  },
  'resize-image': {
    title: 'Resize Images Online — Free Photo Resizer | MyPDF',
    description: 'Resize JPG, PNG or WebP images online. Enter a target width or height, keep proportions, and download the resized image for free.',
    intro: 'Set a new width, height, or both to fit an image into a website, document, or social post. The resizer keeps the original aspect ratio, fits the image within the dimensions you enter, and will not enlarge a smaller original.',
    benefits: ['Enter a width, a height, or both in pixels.', 'Image proportions are preserved automatically.', 'Smaller images are not enlarged, which helps avoid unnecessary blur.'],
    faq: [['Do I need to enter both dimensions?', 'No. Enter either width or height and the other dimension is calculated proportionally.'], ['Will the tool stretch my image?', 'No. It preserves the aspect ratio and fits the image within the dimensions provided.'], ['Can I make a small image larger?', 'The current tool does not enlarge images beyond their original dimensions.']],
  },
};
