import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AUTO, baixarIdioma, buscarIdioma, type Idioma } from "@/lib/traducao";

type TraducaoContextValor = {
  origem: Idioma;
  destino: Idioma;
  definirOrigem: (codigo: string) => void;
  definirDestino: (codigo: string) => void;
  inverter: () => void;
  online: boolean;
  baixados: string[];
  progresso: Record<string, number>;
  baixar: (codigo: string) => void;
};

const Ctx = createContext<TraducaoContextValor | null>(null);

export function TraducaoProvider({ children }: { children: ReactNode }) {
  const [origemCod, setOrigemCod] = useState(AUTO.codigo);
  const [destinoCod, setDestinoCod] = useState("en");
  const [online, setOnline] = useState(true);
  const [baixados, setBaixados] = useState<string[]>(["pt", "en"]);
  const [progresso, setProgresso] = useState<Record<string, number>>({});

  useEffect(() => {
    const atualizar = () => setOnline(navigator.onLine);
    atualizar();
    window.addEventListener("online", atualizar);
    window.addEventListener("offline", atualizar);
    return () => {
      window.removeEventListener("online", atualizar);
      window.removeEventListener("offline", atualizar);
    };
  }, []);

  const inverter = useCallback(() => {
    setOrigemCod(destinoCod);
    setDestinoCod(origemCod === AUTO.codigo ? "pt" : origemCod);
  }, [origemCod, destinoCod]);

  const baixar = useCallback(async (codigo: string) => {
    setProgresso((p) => ({ ...p, [codigo]: 0 }));
    await baixarIdioma(codigo, (v) => setProgresso((p) => ({ ...p, [codigo]: v })));
    setBaixados((b) => (b.includes(codigo) ? b : [...b, codigo]));
    setProgresso((p) => {
      const { [codigo]: _, ...resto } = p;
      return resto;
    });
  }, []);

  const valor = useMemo<TraducaoContextValor>(
    () => ({
      origem: buscarIdioma(origemCod),
      destino: buscarIdioma(destinoCod),
      definirOrigem: setOrigemCod,
      definirDestino: setDestinoCod,
      inverter,
      online,
      baixados,
      progresso,
      baixar,
    }),
    [origemCod, destinoCod, inverter, online, baixados, progresso, baixar],
  );

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useTraducao() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTraducao deve ser usado dentro de TraducaoProvider");
  return ctx;
}
