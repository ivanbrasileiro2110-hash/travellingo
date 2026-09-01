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

const MODELO_ID = "Xenova/nllb-200-distilled-600M";

const NLLB_LOCALE: Record<string, string> = {
  pt: "por_Latn",
  en: "eng_Latn",
  ar: "arb_Arab",
  ko: "kor_Hang",
  ja: "jpn_Jpan",
};

let pipelinePromise: Promise<any> | null = null;

type OuvinteProgresso = (progresso: number) => void;
const ouvintesProgresso = new Set<OuvinteProgresso>();

export function aoProgredirModelo(fn: OuvinteProgresso): () => void {
  ouvintesProgresso.add(fn);
  return () => ouvintesProgresso.delete(fn);
}

async function carregarPipeline() {
  if (pipelinePromise) return pipelinePromise;

  pipelinePromise = (async () => {
    const { pipeline } = await import("@huggingface/transformers");
    const arquivosProgresso: Record<string, number> = {};

    return await pipeline("translation", MODELO_ID, {
      dtype: { encoder_model: "q8", decoder_model_merged: "q8" },
      device: "wasm",
      progress_callback: (info: any) => {
        if (info?.status === "progress" && info.file) {
          arquivosProgresso[info.file] = info.progress ?? 0;
          const valores = Object.values(arquivosProgresso);
          const media =
            valores.reduce((a, b) => a + b, 0) / (valores.length || 1);
          ouvintesProgresso.forEach((fn) => fn(Math.round(media)));
        }
      },
    } as any);
  })();

  return pipelinePromise;
}

const FRANC_PARA_CODIGO: Record<string, string> = {
  por: "pt",
  eng: "en",
  arb: "ar",
  kor: "ko",
  jpn: "ja",
};

function detectarPorScript(texto: string): string | null {
  if (/[\u0600-\u06FF\u0750-\u077F]/.test(texto)) return "ar";
  if (/[\uAC00-\uD7AF\u1100-\u11FF]/.test(texto)) return "ko";
  if (/[\u3040-\u30FF\u4E00-\u9FFF]/.test(texto)) return "ja";
  return null;
}

async function detectarIdioma(texto: string): Promise<string> {
  const porScript = detectarPorScript(texto);
  if (porScript) return porScript;

  try {
    const { franc } = await import("franc-min");
    const resultado = franc(texto, {
      minLength: 1,
      only: ["por", "eng", "arb", "kor", "jpn"],
    });
    return FRANC_PARA_CODIGO[resultado] ?? "en";
  } catch {
    return "en";
  }
}

export async function traduzirTexto(
  texto: string,
  origem: string,
  destino: string,
): Promise<string> {
  if (!texto.trim()) return "";

  const src = origem === AUTO.codigo ? await detectarIdioma(texto) : origem;
  if (src === destino) return texto;

  const tradutor = await carregarPipeline();
  const saida: any = await tradutor(texto, {
    src_lang: NLLB_LOCALE[src] ?? "eng_Latn",
    tgt_lang: NLLB_LOCALE[destino] ?? "eng_Latn",
  });
  const item = Array.isArray(saida) ? saida[0] : saida;
  return item?.translation_text ?? texto;
}

export async function reconhecerVoz(): Promise<string> {
  await new Promise((r) => setTimeout(r, 800));
  return "Texto reconhecido (placeholder)";
}

const TESSERACT_IDIOMA: Record<string, string> = {
  pt: "por",
  en: "eng",
  ar: "ara",
  ko: "kor",
  ja: "jpn",
};

export async function extrairTextoImagem(
  arquivo: File,
  origemCodigo: string = AUTO.codigo,
): Promise<string> {
  const { createWorker } = await import("tesseract.js");

  const idiomas =
    origemCodigo === AUTO.codigo
      ? Object.values(TESSERACT_IDIOMA).join("+")
      : (TESSERACT_IDIOMA[origemCodigo] ?? "eng");

  const worker = await createWorker(idiomas);
  try {
    const {
      data: { text },
    } = await worker.recognize(arquivo);
    return text.trim();
  } finally {
    await worker.terminate();
  }
}

const TTS_LOCALE: Record<string, string> = {
  pt: "pt-BR",
  en: "en-US",
  ar: "ar-SA",
  ko: "ko-KR",
  ja: "ja-JP",
};

export function falarTexto(texto: string, idioma: string): void {
  if (!texto.trim()) return;
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = TTS_LOCALE[idioma] ?? "en-US";
  window.speechSynthesis.speak(utterance);
}

export async function baixarIdioma(
  _codigo: string,
  aoProgredir: (p: number) => void,
): Promise<void> {
  const remover = aoProgredirModelo(aoProgredir);
  try {
    await carregarPipeline();
    aoProgredir(100);
  } finally {
    remover();
  }
}
