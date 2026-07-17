import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

// Conteúdo enviado pelos usuários (fotos) precisa ser lido do disco a cada
// request — nunca cacheado pelo Next como se fosse uma rota estática.
export const dynamic = "force-dynamic";

const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

type Params = { params: Promise<{ path: string[] }> };

export async function GET(_request: Request, { params }: Params) {
  const { path: segments } = await params;

  // Só aceita exatamente <subdir>/<arquivo>, sem "..", pra não vazar
  // arquivos de fora de public/uploads/avatars.
  if (
    segments.length !== 2 ||
    !["equipe", "pacientes"].includes(segments[0]) ||
    segments.some((s) => s.includes("..") || s.includes("/"))
  ) {
    return NextResponse.json({ error: "Não encontrado." }, { status: 404 });
  }

  const ext = path.extname(segments[1]).toLowerCase();
  const mime = MIME_BY_EXT[ext];
  if (!mime) {
    return NextResponse.json({ error: "Não encontrado." }, { status: 404 });
  }

  const filePath = path.join(process.cwd(), "public", "uploads", "avatars", ...segments);

  try {
    const bytes = await readFile(filePath);
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": mime,
        // Nomes de arquivo são UUIDs únicos por upload — seguro cachear
        // "para sempre" no navegador; uma troca de foto gera um nome novo.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Não encontrado." }, { status: 404 });
  }
}
