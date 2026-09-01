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
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-4 px-4 pb-10 pt-5">
        <header className="flex items-center gap-2">
          <h1 className="text-lg font-bold tracking-tight text-foreground">
            Travel<span className="text-primary">ingo</span>
          </h1>
          <span
            className={`ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
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
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent/50"
          >
            <Settings className="size-5" />
          </button>
        </header>

        <SeletorIdioma aoAbrirConfig={() => setConfig(true)} />

        <nav className="grid grid-cols-3 gap-1 rounded-2xl bg-secondary p-1">
          {ABAS.map(({ id, rotulo, icone: Icone }) => (
            <button
              key={id}
              type="button"
              onClick={() => setAba(id)}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-medium transition-colors ${
                aba === id
                  ? "bg-card text-primary shadow-soft"
                  : "text-muted-foreground"
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
