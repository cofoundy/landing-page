import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

async function optimizeImage() {
  const inputPath = 'public/unicornio-programando.webp';
  const outputDir = 'public';

  // Optimize for mobile (640px width)
  await sharp(inputPath)
    .resize(640, null, { withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(path.join(outputDir, 'unicornio-programando-mobile.webp'));

  // Optimize for tablet (1024px width)
  await sharp(inputPath)
    .resize(1024, null, { withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(path.join(outputDir, 'unicornio-programando-tablet.webp'));

  console.log('Images optimized successfully!');
}

optimizeImage().catch(console.error); 