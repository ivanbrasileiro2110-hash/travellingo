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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/25 p-0 backdrop-blur-[2px] sm:items-center sm:p-4">
      <div className="material-glass w-full max-w-md animate-[sheet-up_420ms_var(--ease-spring)] rounded-t-[20px] border-t border-border px-5 pb-6 pt-2.5 shadow-elevated sm:rounded-[20px] sm:border">
        <div className="mx-auto mb-4 h-1.5 w-9 rounded-full bg-foreground/20" />
        <div className="flex items-center justify-between">
          <h2 className="text-[22px] font-bold tracking-[-0.01em] text-foreground">Idiomas offline</h2>
          <button
            type="button"
            onClick={aoFechar}
            aria-label="Fechar"
            className="rounded-full bg-card p-1.5 text-muted-foreground transition-spring transition-transform active:scale-90"
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
                className="rounded-2xl bg-card p-3.5"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl leading-none">{idioma.bandeira}</span>
                  <div className="flex-1">
                    <p className="text-[17px] font-medium text-foreground">{idioma.nome}</p>
                    <p className="text-[13px] text-muted-foreground">{idioma.tamanho}</p>
                  </div>
                  {baixado ? (
                    <span className="inline-flex items-center gap-1 text-[13px] font-medium text-primary">
                      <CheckCircle2 className="size-4" />
                      Baixado
                    </span>
                  ) : prog === undefined ? (
                    <button
                      type="button"
                      onClick={() => baixar(idioma.codigo)}
                      className="inline-flex items-center gap-1.5 rounded-[10px] bg-primary px-3.5 py-1.5 text-[13px] font-semibold text-primary-foreground shadow-soft"
                    >
                      <Download className="size-3.5" />
                      Baixar
                    </button>
                  ) : (
                    <span className="text-[13px] text-muted-foreground">{prog}%</span>
                  )}
                </div>

                {prog !== undefined && (
                  <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
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
