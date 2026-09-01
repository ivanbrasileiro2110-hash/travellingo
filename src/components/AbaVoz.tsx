import { useState } from "react";
import { Mic, Volume2 } from "lucide-react";
import { useTraducao } from "@/context/TraducaoContext";
import { falarTexto, reconhecerVoz, traduzirTexto } from "@/lib/traducao";

export function AbaVoz() {
  const { origem, destino } = useTraducao();
  const [gravando, setGravando] = useState(false);
  const [reconhecido, setReconhecido] = useState("");
  const [resultado, setResultado] = useState("");

  async function alternar() {
    if (gravando) {
      setGravando(false);
      return;
    }
    setGravando(true);
    setResultado("");
    const texto = await reconhecerVoz();
    setReconhecido(texto);
    setResultado(await traduzirTexto(texto, origem.codigo, destino.codigo));
    setGravando(false);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <button
        type="button"
        onClick={alternar}
        aria-label={gravando ? "Parar gravação" : "Iniciar gravação"}
        className={`relative flex size-40 items-center justify-center rounded-full shadow-soft transition-spring transition-transform active:scale-95 ${
          gravando
            ? "animate-pulse bg-destructive text-destructive-foreground"
            : "bg-primary text-primary-foreground"
        }`}
      >
        {gravando && (
          <span className="absolute inset-0 animate-ping rounded-full bg-destructive/30" />
        )}
        <Mic className="size-14" />
      </button>

      <p className="text-[17px] text-muted-foreground">
        {gravando ? "Ouvindo..." : "Toque para falar"}
      </p>

      <div className="w-full space-y-3">
        <div className="min-h-16 rounded-2xl bg-card p-4">
          <span className="text-[13px] font-medium text-muted-foreground">
            Reconhecido
          </span>
          <p className="mt-1 text-[17px] text-foreground">{reconhecido || "—"}</p>
        </div>

        <div className="flex min-h-16 items-start gap-3 rounded-2xl bg-card p-4">
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
    </div>
  );
}
