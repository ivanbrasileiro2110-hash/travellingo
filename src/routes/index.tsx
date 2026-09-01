import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Camera, Mic, Settings, Type, Wifi, WifiOff } from "lucide-react";
import { TraducaoProvider, useTraducao } from "@/context/TraducaoContext";
import { SeletorIdioma } from "@/components/SeletorIdioma";
import { AbaTexto } from "@/components/AbaTexto";
import { AbaVoz } from "@/components/AbaVoz";
import { AbaCamera } from "@/components/AbaCamera";
import { ModalConfiguracoes } from "@/components/ModalConfiguracoes";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Travelingo — Tradutor de viagem offline" },
      {
        name: "description",
        content:
          "Traduza texto, voz e fotos em português, inglês, árabe, coreano e japonês, mesmo offline.",
      },
      { property: "og:title", content: "Travelingo — Tradutor de viagem offline" },
      {
        property: "og:description",
        content: "Tradução por texto, voz e câmera para viajantes, com idiomas offline.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RotaIndex,
});

function RotaIndex() {
  return (
    <TraducaoProvider>
      <Pagina />
    </TraducaoProvider>
  );
}

const ABAS = [
  { id: "texto", rotulo: "Texto", icone: Type },
  { id: "voz", rotulo: "Voz", icone: Mic },
  { id: "camera", rotulo: "Câmera", icone: Camera },
] as const;

function Pagina() {
  const { online } = useTraducao();
  const [aba, setAba] = useState<(typeof ABAS)[number]["id"]>("texto");
  const [config, setConfig] = useState(false);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-5 px-4 pb-10">
        <header className="material-glass sticky top-0 z-30 -mx-4 flex items-center gap-2 border-b border-border px-4 pb-3 pt-5">
          <h1 className="text-[34px] font-bold leading-tight tracking-[-0.02em] text-foreground">
            Travel<span className="text-primary">ingo</span>
          </h1>
          <span
            className={`ml-auto inline-flex items-center gap-1 rounded-[10px] px-2.5 py-1 text-[13px] font-medium ${
              online
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {online ? <Wifi className="size-3" /> : <WifiOff className="size-3" />}
            {online ? "Online" : "Offline"}
          </span>
          <button
            type="button"
            aria-label="Configurações de idiomas"
            onClick={() => setConfig(true)}
            className="rounded-full p-2 text-primary transition-colors hover:bg-accent"
          >
            <Settings className="size-5" />
          </button>
        </header>

        <SeletorIdioma aoAbrirConfig={() => setConfig(true)} />

        <nav className="grid grid-cols-3 gap-1 rounded-[10px] bg-secondary p-[3px]">
          {ABAS.map(({ id, rotulo, icone: Icone }) => (
            <button
              key={id}
              type="button"
              onClick={() => setAba(id)}
              className={`flex items-center justify-center gap-1.5 rounded-[8px] py-1.5 text-[13px] font-medium transition-spring transition-all ${
                aba === id
                  ? "scale-100 bg-background text-foreground shadow-segment"
                  : "scale-[0.97] text-muted-foreground"
              }`}
            >
              <Icone className="size-4" />
              {rotulo}
            </button>
          ))}
        </nav>

        <section className="flex-1">
          {aba === "texto" && <AbaTexto />}
          {aba === "voz" && <AbaVoz />}
          {aba === "camera" && <AbaCamera />}
        </section>
      </div>

      <ModalConfiguracoes aberto={config} aoFechar={() => setConfig(false)} />
    </main>
  );
}
