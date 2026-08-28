export type Idioma = {
  codigo: string;
  nome: string;
  bandeira: string;
  tamanho: string;
};

export const IDIOMAS: Idioma[] = [
  { codigo: "pt", nome: "Português", bandeira: "🇧🇷", tamanho: "~80MB" },
  { codigo: "en", nome: "Inglês", bandeira: "🇺🇸", tamanho: "~75MB" },
  { codigo: "ar", nome: "Árabe", bandeira: "🇸🇦", tamanho: "~95MB" },
  { codigo: "ko", nome: "Coreano", bandeira: "🇰🇷", tamanho: "~110MB" },
  { codigo: "ja", nome: "Japonês", bandeira: "🇯🇵", tamanho: "~120MB" },
];

export const AUTO: Idioma = {
  codigo: "auto",
  nome: "Detecção automática",
  bandeira: "✨",
  tamanho: "—",
};

export function buscarIdioma(codigo: string): Idioma {
  if (codigo === AUTO.codigo) return AUTO;
  return IDIOMAS.find((i) => i.codigo === codigo) ?? IDIOMAS[0]!;
}

/* ------------------------------------------------------------------ */
/* Lógica mockada — substituir pela integração com modelos locais de IA */
/* ------------------------------------------------------------------ */

export async function traduzirTexto(
  texto: string,
  origem: string,
  destino: string,
): Promise<string> {
  await new Promise((r) => setTimeout(r, 600));
  if (!texto.trim()) return "";
  return `[${origem} → ${destino}] ${texto}`;
}

export async function reconhecerVoz(): Promise<string> {
  await new Promise((r) => setTimeout(r, 800));
  return "Texto reconhecido (placeholder)";
}

export async function extrairTextoImagem(
  _arquivo: File,
  _idioma?: string,
): Promise<string> {
  await new Promise((r) => setTimeout(r, 800));
  return "Texto extraído da imagem (placeholder)";
}

export function falarTexto(_texto: string, _idioma: string): void {
  // TODO: integrar com síntese de voz local
}

export async function baixarIdioma(
  _codigo: string,
  aoProgredir: (p: number) => void,
): Promise<void> {
  for (let p = 0; p <= 100; p += 10) {
    aoProgredir(p);
    await new Promise((r) => setTimeout(r, 120));
  }
}
