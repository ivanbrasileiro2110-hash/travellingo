import { CheckCircle2, Download, X } from "lucide-react";
import { useTraducao } from "@/context/TraducaoContext";
import { IDIOMAS } from "@/lib/traducao";

export function ModalConfiguracoes({
  aberto,
  aoFechar,
}: {
  aberto: boolean;
  aoFechar: () => void;
}) {
  const { baixados, progresso, baixar } = useTraducao();
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-0 sm:items-center sm:p-4">
      <div className="w-full max-w-md rounded-t-3xl border border-border bg-card p-5 shadow-elevated sm:rounded-3xl">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Idiomas offline</h2>
          <button
            type="button"
            onClick={aoFechar}
            aria-label="Fechar"
            className="rounded-full p-1.5 text-muted-foreground hover:bg-accent/50"
          >
            <X className="size-5" />
          </button>
        </div>

        <ul className="mt-4 space-y-2">
          {IDIOMAS.map((idioma) => {
            const baixado = baixados.includes(idioma.codigo);
            const prog = progresso[idioma.codigo];
            return (
              <li
                key={idioma.codigo}
                className="rounded-2xl border border-border bg-background p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl leading-none">{idioma.bandeira}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{idioma.nome}</p>
                    <p className="text-xs text-muted-foreground">{idioma.tamanho}</p>
                  </div>
                  {baixado ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                      <CheckCircle2 className="size-4" />
                      Baixado
                    </span>
                  ) : prog === undefined ? (
                    <button
                      type="button"
                      onClick={() => baixar(idioma.codigo)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-gradient-brand px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-soft"
                    >
                      <Download className="size-3.5" />
                      Baixar
                    </button>
                  ) : (
                    <span className="text-xs text-muted-foreground">{prog}%</span>
                  )}
                </div>

                {prog !== undefined && (
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-gradient-brand transition-all"
                      style={{ width: `${prog}%` }}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
