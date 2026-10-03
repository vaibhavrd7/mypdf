export const tools = [
  { id: 'jpg-to-webp', path: '/jpg-to-webp', title: 'JPG to WebP', from: 'JPG', to: 'WEBP', description: 'Make smaller, modern images for the web.', icon: '↗', category: 'Convert', accepts: ['image/jpeg'], format: 'WebP' },
  { id: 'png-to-webp', path: '/png-to-webp', title: 'PNG to WebP', from: 'PNG', to: 'WEBP', description: 'Keep transparency with a lighter WebP file.', icon: '◈', category: 'Convert', accepts: ['image/png'], format: 'WebP' },
  { id: 'webp-to-jpg', path: '/webp-to-jpg', title: 'WebP to JPG', from: 'WEBP', to: 'JPG', description: 'Turn WebP images into widely supported JPGs.', icon: '↙', category: 'Convert', accepts: ['image/webp'], format: 'JPG' },
  { id: 'jpg-to-png', path: '/jpg-to-png', title: 'JPG to PNG', from: 'JPG', to: 'PNG', description: 'Convert JPG images to the PNG format.', icon: '◩', category: 'Convert', accepts: ['image/jpeg'], format: 'PNG' },
  { id: 'compress-image', path: '/compress-image', title: 'Compress image', from: 'IMG', to: 'SMALLER', description: 'Reduce image file size with a quality slider.', icon: '⌁', category: 'Optimize', accepts: ['image/jpeg','image/png','image/webp'], format: 'Original format' },
  { id: 'resize-image', path: '/resize-image', title: 'Resize image', from: 'IMG', to: 'SCALE', description: 'Set new dimensions while keeping proportions.', icon: '⤢', category: 'Resize', accepts: ['image/jpeg','image/png','image/webp'], format: 'Original format' },
];
export const acceptedTypes = ['image/jpeg','image/png','image/webp'];
export const acceptString = acceptedTypes.join(',');
