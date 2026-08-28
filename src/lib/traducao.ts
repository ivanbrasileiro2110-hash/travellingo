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
/* Tradução de texto — modelos Helsinki-NLP OPUS-MT rodando localmente */
/* via Transformers.js (open source, sem custo, sem servidor).        */
/*                                                                     */
/* Cada par de idiomas usa um modelo dedicado. Como nem todo par tem   */
/* modelo direto, pares que não envolvem inglês fazem "pivô": traduz   */
/* origem → inglês → destino em dois passos.                          */
/* ------------------------------------------------------------------ */

const MODELOS: Record<string, string[]> = {
  "ar-en": ["Xenova/opus-mt-ar-en"],
  "en-ar": ["Xenova/opus-mt-en-ar"],
  "ja-en": ["Xenova/opus-mt-ja-en"],
  "en-ja": ["Xenova/opus-mt-en-ja"],
  "ko-en": ["Xenova/opus-mt-ko-en"],
  "en-ko": ["Xenova/opus-mt-en-ko"],
  "pt-en": ["Xenova/opus-mt-pt-en", "Xenova/opus-mt-tc-big-pt-en"],
  "en-pt": ["Xenova/opus-mt-en-pt", "Xenova/opus-mt-tc-big-en-pt"],
};

const pipelinesCache = new Map<string, Promise<any>>();

type OuvinteProgresso = (par: string, progresso: number) => void;
const ouvintesProgresso = new Set<OuvinteProgresso>();

export function aoProgredirModelo(fn: OuvinteProgresso): () => void {
  ouvintesProgresso.add(fn);
  return () => ouvintesProgresso.delete(fn);
}

async function carregarPipeline(par: string) {
  if (pipelinesCache.has(par)) return pipelinesCache.get(par)!;

  const candidatos = MODELOS[par];
  if (!candidatos) {
    throw new Error(`Nenhum modelo configurado para o par de idiomas "${par}".`);
  }

  const promessa = (async () => {
    const { pipeline, env } = await import("@huggingface/transformers");
    env.allowLocalModels = false;

    let ultimoErro: unknown;
    for (const modeloId of candidatos) {
      try {
        const arquivosProgresso: Record<string, number> = {};
        return await pipeline("translation", modeloId, {
          progress_callback: (info: any) => {
            if (info?.status === "progress" && info.file) {
              arquivosProgresso[info.file] = info.progress ?? 0;
              const valores = Object.values(arquivosProgresso);
              const media =
                valores.reduce((a, b) => a + b, 0) / (valores.length || 1);
              ouvintesProgresso.forEach((fn) => fn(par, Math.round(media)));
            }
          },
        });
      } catch (erro) {
        ultimoErro = erro;
      }
    }
    throw ultimoErro instanceof Error
      ? ultimoErro
      : new Error(`Falha ao carregar modelo para "${par}".`);
  })();

  pipelinesCache.set(par, promessa);
  return promessa;
}

async function traduzirPar(texto: string, par: string): Promise<string> {
  const tradutor = await carregarPipeline(par);
  const saida: any = await tradutor(texto);
  const item = Array.isArray(saida) ? saida[0] : saida;
  return item?.translation_text ?? texto;
}

const FRANC_PARA_CODIGO: Record<string, string> = {
  por: "pt",
  eng: "en",
  arb: "ar",
  kor: "ko",
  jpn: "ja",
};

async function detectarIdioma(texto: string): Promise<string> {
  try {
    const { franc } = await import("franc-min");
    const resultado = franc(texto, { minLength: 3 });
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

  if (src === "en" || destino === "en") {
    return traduzirPar(texto, `${src}-${destino}`);
  }

  const intermediario = await traduzirPar(texto, `${src}-en`);
  return traduzirPar(intermediario, `en-${destino}`);
}

/* ------------------------------------------------------------------ */
/* Reconhecimento de voz — placeholder mantido por enquanto (próxima  */
/* etapa: precisa gravar áudio de verdade, então mexe também no       */
/* componente AbaVoz).                                                */
/* ------------------------------------------------------------------ */
export async function reconhecerVoz(): Promise<string> {
  await new Promise((r) => setTimeout(r, 800));
  return "Texto reconhecido (placeholder)";
}

/* ------------------------------------------------------------------ */
/* Tradução por foto (OCR) — Tesseract.js, open source, roda local.   */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/* Texto para fala — Web Speech API nativa do navegador/SO.           */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/* Download antecipado dos modelos de um idioma (pra usar offline).   */
/* ------------------------------------------------------------------ */

export async function baixarIdioma(
  codigo: string,
  aoProgredir: (p: number) => void,
): Promise<void> {
  if (codigo === "en") {
    aoProgredir(100);
    return;
  }

  const pares = [`${codigo}-en`, `en-${codigo}`];
  const progressoPares: Record<string, number> = {};

  const remover = aoProgredirModelo((par, p) => {
    if (!pares.includes(par)) return;
    progressoPares[par] = p;
    const media =
      pares.reduce((soma, ppar) => soma + (progressoPares[ppar] ?? 0), 0) /
      pares.length;
    aoProgredir(Math.round(media));
  });

  try {
    await Promise.all(pares.map((par) => carregarPipeline(par)));
    aoProgredir(100);
  } finally {
    remover();
  }
}
