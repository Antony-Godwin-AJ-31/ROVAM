const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generateManifest() {
  const baseDir = path.join(__dirname, '..', 'public', 'photos');
  const categories = [
    { key: 'bride-and-groom', label: 'Bride & Groom', dir: 'bride-and-groom' },
    { key: 'bride', label: 'Bride', dir: 'bride' },
    { key: 'groom', label: 'Groom', dir: 'groom' },
  ];

  const result = [];

  for (const cat of categories) {
    const catPath = path.join(baseDir, cat.dir);
    if (!fs.existsSync(catPath)) {
      console.warn('Directory not found:', catPath);
      continue;
    }
    const files = fs.readdirSync(catPath).filter(f => /\.(jpe?g|png|webp|avif)$/i.test(f));
    files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = path.join(catPath, file);
      try {
        const metadata = await sharp(filePath).metadata();
        const width = metadata.width || 1200;
        const height = metadata.height || 1600;
        const orientation = width >= height ? 'landscape' : 'portrait';
        const encodedFile = encodeURIComponent(file);
        result.push({
          id: `${cat.key}-${i + 1}`,
          category: cat.key,
          categoryLabel: cat.label,
          filename: file,
          src: `/photos/${cat.dir}/${encodedFile}`,
          width,
          height,
          aspectRatio: Math.round((width / height) * 100) / 100,
          orientation,
          alt: `${cat.label} photograph ${i + 1}`,
        });
      } catch (err) {
        console.error('Error reading metadata for', filePath, err.message);
      }
    }
  }

  const fileContent = `export interface GalleryItem {
  id: string;
  category: 'bride' | 'groom' | 'bride-and-groom';
  categoryLabel: string;
  filename: string;
  src: string;
  width: number;
  height: number;
  aspectRatio: number;
  orientation: 'portrait' | 'landscape';
  alt: string;
}

export const GALLERY_ITEMS: GalleryItem[] = ${JSON.stringify(result, null, 2)};
`;

  const outPath = path.join(__dirname, '..', 'src', 'data', 'galleryManifest.ts');
  fs.writeFileSync(outPath, fileContent, 'utf8');
  console.log('Manifest written successfully to', outPath, '! Total photographs:', result.length);
}

generateManifest();
