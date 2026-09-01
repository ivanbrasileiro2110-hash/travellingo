import { useState } from "react";
import { Languages, Loader2, Volume2 } from "lucide-react";
import { useTraducao } from "@/context/TraducaoContext";
import { falarTexto, traduzirTexto } from "@/lib/traducao";

export function AbaTexto() {
  const { origem, destino } = useTraducao();
  const [texto, setTexto] = useState("");
  const [resultado, setResultado] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function traduzir() {
    setCarregando(true);
    setResultado(await traduzirTexto(texto, origem.codigo, destino.codigo));
    setCarregando(false);
  }

  return (
    <div className="space-y-4">
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Digite o texto para traduzir..."
        rows={6}
        className="w-full resize-none rounded-2xl bg-card p-4 text-[17px] text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
      />

      <button
        type="button"
        onClick={traduzir}
        disabled={!texto.trim() || carregando}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-[17px] font-semibold text-primary-foreground transition-spring transition-all active:scale-[0.97] disabled:opacity-40"
      >
        {carregando ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Languages className="size-4" />
        )}
        Traduzir
      </button>

      {resultado && (
        <div className="flex items-start gap-3 rounded-2xl bg-card p-4">
          <p className="flex-1 text-[17px] text-foreground">{resultado}</p>
          <button
            type="button"
            aria-label="Ouvir tradução"
            onClick={() => falarTexto(resultado, destino.codigo)}
            className="rounded-full bg-background p-2 text-primary shadow-soft"
          >
            <Volume2 className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
