import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const allowedTypes = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function saveImage(file) {
  if (!file || file.size === 0) return "";

  if (!allowedTypes[file.type]) {
    const error = new Error(
      "Дозволени се само JPG, PNG и WebP слики."
    );
    error.status = 400;
    throw error;
  }

  // public/uploads
  const uploadFolder = path.join(
    process.cwd(), // glavniot folder 
    "public",
    "uploads"
  );

  await mkdir(uploadFolder, { recursive: true });

  const fileName =
    Date.now() +
    "-" +
    randomUUID() +
    "." +
    allowedTypes[file.type];

  // Ги читаме бинарните податоци од сликата
  const bytes = await file.arrayBuffer();

  // Ја запишуваме сликата во public/uploads
  await writeFile(
    path.join(uploadFolder, fileName),
    Buffer.from(bytes)
  );

  return fileName;
}