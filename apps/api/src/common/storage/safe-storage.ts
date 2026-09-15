import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { extname, join, resolve } from 'path';
import { mkdir, writeFile } from 'fs/promises';

const SAFE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

export function safeEvidenceFilename(originalName: string) {
  const extension = extname(originalName).toLowerCase();
  if (!SAFE_EXTENSIONS.has(extension)) {
    throw new BadRequestException('Evidence file must be a jpg, png, or webp image');
  }
  return `${Date.now()}-${randomUUID()}${extension}`;
}

export async function writePrivateFile(storageRoot: string, folder: string, filename: string, content: Buffer | string) {
  const root = resolve(storageRoot);
  const directory = resolve(root, folder);
  const target = resolve(directory, filename);

  if (!directory.startsWith(root) || !target.startsWith(root)) {
    throw new BadRequestException('Invalid storage path');
  }

  await mkdir(directory, { recursive: true });
  await writeFile(target, content);

  return join(storageRoot, folder, filename).replace(/\\/g, '/');
}
