import { createFileRoute, Link } from "@tanstack/react-router";
import heroAsset from "@/assets/hero-venue.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sítio Canto da Mata — Espaço para Casamentos no Campo" },
      {
        name: "description",
        content:
          "Sítio Canto da Mata: espaço para casamentos ao ar livre, cercado pela natureza. Estrutura completa, capela e hospedagem. Agende sua visita.",
      },
      { property: "og:title", content: "Sítio Canto da Mata — Espaço para Casamentos no Campo" },
      {
        property: "og:description",
        content:
          "Casamentos ao ar livre, com estrutura completa em meio à natureza. Agende sua visita ao Sítio Canto da Mata.",
      },
      { property: "og:url", content: "https://sitiocantodamata.com.br/" },
      { property: "og:image", content: heroAsset.url },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: heroAsset.url },
    ],
    links: [{ rel: "canonical", href: "https://sitiocantodamata.com.br/" }],
  }),
  component: Home,
});

// TODO: substituir por WhatsApp real
const WHATSAPP_URL = "https://wa.me/5500000000000?text=Ol%C3%A1%2C%20quero%20agendar%20uma%20visita%20ao%20S%C3%ADtio%20Canto%20da%20Mata";
const INSTAGRAM_URL = "#";

const DIFERENCIAIS = [
  { titulo: "Cerimônia ao ar livre", desc: "Altar em meio à natureza, com vista para a mata." },
  { titulo: "Salão coberto", desc: "Estrutura para receber convidados em qualquer estação." },
  { titulo: "Hospedagem no local", desc: "Suítes para os noivos e familiares próximos." },
  { titulo: "Área verde ampla", desc: "Jardins e espaços para fotos inesquecíveis." },
  { titulo: "Estacionamento", desc: "Espaço amplo e sinalizado para os convidados." },
  { titulo: "Suporte à produção", desc: "Infraestrutura para fornecedores e cerimonial." },
];

// Placeholder — trocar por fotos reais depois
const GALERIA = Array.from({ length: 6 }, () => heroAsset.url);

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <Sobre />
      <Estrutura />
      <Galeria />
      <Planilha />
      <Localizacao />
      <CTAFinal />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="font-serif text-lg tracking-wide text-primary">
          Sítio Canto da Mata
        </a>
        <nav className="hidden gap-7 text-sm text-foreground/80 md:flex">
          <a href="#sobre" className="hover:text-primary">Sobre</a>
          <a href="#estrutura" className="hover:text-primary">Estrutura</a>
          <a href="#galeria" className="hover:text-primary">Galeria</a>
          <a href="#localizacao" className="hover:text-primary">Localização</a>
        </nav>
        <Link
          to="/lp"
          className="hidden rounded-full bg-primary px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-primary-foreground hover:bg-primary/90 sm:inline-flex"
        >
          Planilha grátis
        </Link>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative isolate">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src={heroAsset.url}
          alt="Sítio Canto da Mata"
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-primary/50" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />
      </div>
      <div
        className="mx-auto max-w-3xl px-6 pt-32 pb-40 text-center text-primary-foreground sm:pt-40 sm:pb-48"
        style={{ textShadow: "0 2px 16px rgba(0,0,0,0.45)" }}
      >
        <span className="text-[11px] uppercase tracking-[0.28em] text-primary-foreground/85">
          Espaço para casamentos
        </span>
        <h1 className="mt-5 font-serif text-4xl leading-tight sm:text-6xl">
          Um refúgio no campo para o seu grande dia.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm text-primary-foreground/90 sm:text-base">
          Cerimônias ao ar livre, estrutura completa e hospedagem em meio à natureza.
          Um lugar preparado para transformar o seu casamento em memória para a vida toda.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-full bg-primary-foreground px-6 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-primary transition hover:bg-primary-foreground/90 sm:w-auto"
          >
            Agende uma visita
          </a>
          <Link
            to="/lp"
            className="w-full rounded-full border border-primary-foreground/70 px-6 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-primary-foreground transition hover:bg-primary-foreground/10 sm:w-auto"
          >
            Baixe a planilha grátis
          </Link>
        </div>
      </div>
    </section>
  );
}

function Sobre() {
  return (
    <section id="sobre" className="mx-auto max-w-3xl px-6 py-20 text-center sm:py-28">
      <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Sobre o espaço</span>
      <h2 className="mt-4 font-serif text-3xl text-primary sm:text-4xl">
        Natureza, acolhimento e liberdade para celebrar.
      </h2>
      <p className="mt-6 text-base leading-relaxed text-foreground/80">
        O Sítio Canto da Mata é um espaço pensado para casais que sonham com um
        casamento no campo, longe do barulho da cidade e cercado por verde. Aqui,
        cada detalhe da estrutura foi preparado para que você, sua família e seus
        convidados vivam um dia leve, bonito e memorável.
      </p>
    </section>
  );
}

function Estrutura() {
  return (
    <section id="estrutura" className="border-y border-border/60 bg-secondary/40 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Estrutura</span>
          <h2 className="mt-4 font-serif text-3xl text-primary sm:text-4xl">
            Tudo o que o seu casamento precisa em um só lugar.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DIFERENCIAIS.map((d) => (
            <article
              key={d.titulo}
              className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft/40"
            >
              <h3 className="font-serif text-xl text-primary">{d.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/75">{d.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Galeria() {
  return (
    <section id="galeria" className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
      <div className="text-center">
        <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Galeria</span>
        <h2 className="mt-4 font-serif text-3xl text-primary sm:text-4xl">
          Um passeio pelo sítio.
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Em breve, mais fotos do espaço, cerimônias e detalhes.
        </p>
      </div>
      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {GALERIA.map((src, i) => (
          <div key={i} className="aspect-[4/3] overflow-hidden rounded-xl bg-muted">
            <img
              src={src}
              alt={`Sítio Canto da Mata — foto ${i + 1}`}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function Planilha() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-16 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="max-w-lg">
          <span className="text-[11px] uppercase tracking-[0.24em] text-primary-foreground/70">
            Planilha gratuita
          </span>
          <h2 className="mt-3 font-serif text-2xl sm:text-3xl">
            Baixe a planilha completa de organização do seu casamento.
          </h2>
          <p className="mt-2 text-sm text-primary-foreground/85">
            Checklists, cronograma, orçamento e tudo que você precisa em um só lugar.
          </p>
        </div>
        <Link
          to="/lp"
          className="rounded-full bg-primary-foreground px-6 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-primary transition hover:bg-primary-foreground/90"
        >
          Quero a planilha
        </Link>
      </div>
    </section>
  );
}

function Localizacao() {
  return (
    <section id="localizacao" className="mx-auto max-w-3xl px-6 py-20 text-center sm:py-28">
      <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Localização</span>
      <h2 className="mt-4 font-serif text-3xl text-primary sm:text-4xl">
        Fácil de chegar, longe da correria.
      </h2>
      <p className="mt-4 text-base text-foreground/80">
        {/* TODO: preencher endereço real */}
        Endereço em breve. Entre em contato pelo WhatsApp para receber a rota completa.
      </p>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex rounded-full border border-primary px-6 py-3 text-sm font-medium uppercase tracking-[0.14em] text-primary transition hover:bg-primary hover:text-primary-foreground"
      >
        Falar no WhatsApp
      </a>
    </section>
  );
}

function CTAFinal() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img src={heroAsset.url} alt="" className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-primary/70" />
      </div>
      <div
        className="mx-auto max-w-2xl px-6 py-24 text-center text-primary-foreground"
        style={{ textShadow: "0 2px 14px rgba(0,0,0,0.45)" }}
      >
        <h2 className="font-serif text-3xl sm:text-4xl">Vamos conhecer o seu sonho?</h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-primary-foreground/90">
          Agende uma visita e sinta a atmosfera do Sítio Canto da Mata.
        </p>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex rounded-full bg-primary-foreground px-8 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-primary transition hover:bg-primary-foreground/90"
        >
          Agendar visita
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} Sítio Canto da Mata</p>
        <div className="flex gap-5">
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            Instagram
          </a>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            WhatsApp
          </a>
          <Link to="/lp" className="hover:text-primary">Planilha grátis</Link>
        </div>
      </div>
    </footer>
  );
}
