import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export type AvatarUploadResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

/**
 * Valida e salva uma imagem de avatar em public/uploads/avatars/<subdir>,
 * retornando a URL pública (ex: "/uploads/avatars/pacientes/abc123.jpg").
 */
export async function saveAvatarUpload(
  file: File,
  subdir: "equipe" | "pacientes"
): Promise<AvatarUploadResult> {
  if (!ALLOWED_TYPES.has(file.type)) {
    return { ok: false, error: "Formato de imagem inválido. Use JPG, PNG, WEBP ou GIF." };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { ok: false, error: "Imagem muito grande. O tamanho máximo é 5MB." };
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || guessExtension(file.type);
  const filename = `${randomUUID()}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars", subdir);
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), bytes);

  return { ok: true, url: `/api/uploads/avatars/${subdir}/${filename}` };
}

/**
 * Remove um arquivo de avatar antigo do disco, se existir. Falhas são
 * silenciosas (ex: arquivo já não existe) para não travar a atualização.
 */
export async function deleteAvatarFile(url: string | null | undefined) {
  if (!url || !url.startsWith("/api/uploads/avatars/")) return;
  const relative = url.replace("/api/uploads/avatars/", "");
  try {
    await unlink(path.join(process.cwd(), "public", "uploads", "avatars", relative));
  } catch {
    // arquivo já não existe ou não pôde ser removido — ignora
  }
}

function guessExtension(mimeType: string): string {
  switch (mimeType) {
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    default:
      return ".jpg";
  }
}
