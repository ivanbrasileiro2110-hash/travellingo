import { useRef, useState } from "react";
import { Camera, Loader2, Volume2 } from "lucide-react";
import { useTraducao } from "@/context/TraducaoContext";
import { extrairTextoImagem, falarTexto, traduzirTexto } from "@/lib/traducao";

export function AbaCamera() {
  const { origem, destino } = useTraducao();
  const inputRef = useRef<HTMLInputElement>(null);
  const [previa, setPrevia] = useState<string | null>(null);
  const [extraido, setExtraido] = useState("");
  const [resultado, setResultado] = useState("");
  const [processando, setProcessando] = useState(false);

  async function aoEscolher(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    setPrevia(URL.createObjectURL(arquivo));
    setProcessando(true);
    const texto = await extrairTextoImagem(arquivo, origem.codigo);
    setExtraido(texto);
    setResultado(await traduzirTexto(texto, origem.codigo, destino.codigo));
    setProcessando(false);
  }

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={aoEscolher}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-[17px] font-semibold text-primary-foreground transition-spring transition-all active:scale-[0.97]"
      >
        <Camera className="size-5" />
        Tirar foto
      </button>

      {previa && (
        <img
          src={previa}
          alt="Prévia da foto tirada"
          loading="lazy"
          className="w-full rounded-2xl object-cover shadow-soft"
        />
      )}

      <div className="rounded-2xl bg-card p-4">
        <span className="text-[13px] font-medium text-muted-foreground">
          Texto extraído
        </span>
        <p className="mt-1 text-[17px] text-foreground">
          {processando ? (
            <Loader2 className="size-4 animate-spin text-primary" />
          ) : (
            extraido || "—"
          )}
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-2xl bg-card p-4">
        <div className="flex-1">
          <span className="text-[13px] font-medium text-muted-foreground">
            Tradução
          </span>
          <p className="mt-1 text-[17px] text-foreground">{resultado || "—"}</p>
        </div>
        <button
          type="button"
          aria-label="Ouvir tradução"
          onClick={() => falarTexto(resultado, destino.codigo)}
          className="rounded-full bg-background p-2 text-primary shadow-soft"
        >
          <Volume2 className="size-4" />
        </button>
      </div>
    </div>
  );
}
