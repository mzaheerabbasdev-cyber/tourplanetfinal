import path from 'path';
import { writeFile, mkdir } from 'fs/promises';
import sharp from 'sharp';

// Permanent uploads folder. Set UPLOADS_DIR in Hostinger so files survive redeploys.
export const getUploadDir = () =>
  process.env.UPLOADS_DIR || path.join(process.cwd(), 'public', 'uploads');

// Compress an image and save it. Returns the public URL path.
export const saveImageFile = async (file: File, prefix = ''): Promise<string> => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/\s+/g, '-');
  const filename = `${prefix}${Date.now()}-${baseName}.jpg`;

  const uploadDir = getUploadDir();
  await mkdir(uploadDir, { recursive: true });

  const compressedBuffer = await sharp(buffer)
    .resize(800, null, { withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer();

  await writeFile(path.join(uploadDir, filename), compressedBuffer);
  return `/api/uploads/${filename}`;
};

export const uploadImage = async (file: File): Promise<string> => {
  return saveImageFile(file, 'pkg-');
};
