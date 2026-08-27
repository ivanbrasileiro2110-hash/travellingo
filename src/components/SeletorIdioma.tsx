import { useState } from "react";
import { ArrowLeftRight, Check, ChevronDown, Download, Sparkles } from "lucide-react";
import { useTraducao } from "@/context/TraducaoContext";
import { AUTO, IDIOMAS, type Idioma } from "@/lib/traducao";

function Dropdown({
  rotulo,
  selecionado,
  opcoes,
  aoSelecionar,
}: {
  rotulo: string;
  selecionado: Idioma;
  opcoes: Idioma[];
  aoSelecionar: (codigo: string) => void;
}) {
  const [aberto, setAberto] = useState(false);

  return (
    <div className="relative flex-1">
      <button
        type="button"
        onClick={() => setAberto((a) => !a)}
        className="w-full rounded-2xl border border-border bg-card px-3 py-3 text-left shadow-soft transition-colors hover:bg-accent/40"
      >
        <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {rotulo}
        </span>
        <span className="mt-1 flex items-center gap-2">
          {selecionado.codigo === AUTO.codigo ? (
            <Sparkles className="size-4 text-primary" />
          ) : (
            <span className="text-lg leading-none">{selecionado.bandeira}</span>
          )}
          <span className="truncate text-sm font-semibold text-foreground">
            {selecionado.nome}
          </span>
          <ChevronDown className="ml-auto size-4 shrink-0 text-muted-foreground" />
        </span>
      </button>

      {aberto && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setAberto(false)} />
          <ul className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-popover shadow-elevated">
            {opcoes.map((op) => (
              <li key={op.codigo}>
                <button
                  type="button"
                  onClick={() => {
                    aoSelecionar(op.codigo);
                    setAberto(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-popover-foreground transition-colors hover:bg-accent/50"
                >
                  {op.codigo === AUTO.codigo ? (
                    <Sparkles className="size-4 text-primary" />
                  ) : (
                    <span className="text-base leading-none">{op.bandeira}</span>
                  )}
                  <span className="truncate">{op.nome}</span>
                  {op.codigo === selecionado.codigo && (
                    <Check className="ml-auto size-4 text-primary" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export function SeletorIdioma({ aoAbrirConfig }: { aoAbrirConfig: () => void }) {
  const { origem, destino, definirOrigem, definirDestino, inverter, baixados } =
    useTraducao();

  const faltando = [origem, destino].filter(
    (i) => i.codigo !== AUTO.codigo && !baixados.includes(i.codigo),
  );

  return (
    <div className="space-y-2">
      <div className="flex items-stretch gap-2">
        <Dropdown
          rotulo="De"
          selecionado={origem}
          opcoes={[AUTO, ...IDIOMAS]}
          aoSelecionar={definirOrigem}
        />
        <button
          type="button"
          onClick={inverter}
          aria-label="Inverter idiomas"
          className="mt-2 size-11 shrink-0 self-center rounded-full bg-gradient-brand text-primary-foreground shadow-elevated transition-transform active:scale-95"
        >
          <ArrowLeftRight className="mx-auto size-5" />
        </button>
        <Dropdown
          rotulo="Para"
          selecionado={destino}
          opcoes={IDIOMAS}
          aoSelecionar={definirDestino}
        />
      </div>

      {faltando.length > 0 && (
        <button
          type="button"
          onClick={aoAbrirConfig}
          className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
        >
          <Download className="size-3.5" />
          Baixar idioma ({faltando.map((f) => f.nome).join(", ")})
        </button>
      )}
    </div>
  );
}
