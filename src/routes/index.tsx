import { createFileRoute, Link } from "@tanstack/react-router";
import heroAsset from "@/assets/hero-venue.jpg.asset.json";
import { GOOGLE_MAPS_ICON, WAZE_ICON } from "@/assets/map-icons";

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

const SITIO_ENDERECO = "Dos Tigres, 100 - Pereiras, São Lourenço da Serra - SP, 06890-000";
const SITIO_LAT = -23.8464778;
const SITIO_LNG = -46.9028855;
const GOOGLE_MAPS_EMBED_URL = `https://www.google.com/maps?q=${SITIO_LAT},${SITIO_LNG}&hl=pt-BR&z=15&output=embed`;
const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/Hi3gP8wreiHrvFAP8";
const WAZE_URL = "https://www.waze.com/en/live-map/directions/sitio-canto-da-mata-sao-lourenco-da-serra?place=w.205194778.2051947775.41039786";

const DIFERENCIAIS = [
  { titulo: "O altar sobre o lago", desc: "O cenário para um \"sim\" inesquecível, com o abraço da natureza." },
  { titulo: "Área gourmet e piscina", desc: "Espaço amplo e integrado para recepções leves." },
  { titulo: "Exclusividade total", desc: "Apenas um evento por dia, privacidade absoluta." },
  { titulo: "Varandas e decks", desc: "Cantinhos de contemplação e fotos espontâneas." },
  { titulo: "Estacionamento privativo", desc: "Espaço amplo e seguro." },
  { titulo: "Mobiliário e equipe de apoio", desc: "Bancos, mesas, cadeiras e equipe no dia." },
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
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-6 py-4">
        <a href="#top" className="justify-self-start font-serif text-lg tracking-wide text-primary">
          Sítio Canto da Mata
        </a>
        <nav className="col-start-2 hidden gap-7 text-sm text-foreground/80 md:flex">
          <a href="#sobre" className="hover:text-primary">Sobre</a>
          <a href="#estrutura" className="hover:text-primary">Estrutura</a>
          <a href="#galeria" className="hover:text-primary">Galeria</a>
          <a href="#localizacao" className="hover:text-primary">Localização</a>
        </nav>
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
        O Sítio Canto da Mata
      </h2>
      <p className="mt-6 text-base leading-relaxed text-foreground/80">
        Este pedaço de paraíso, uma antiga fazenda da década de 1980, e o
        cultivamos com o carinho de quem cuida do próprio quintal. No Sítio
        Canto da Mata, o tempo desacelera e cada detalhe sussurra memórias.
        Aqui, o cheiro da terra se mistura ao do café fresco, e a brisa da
        Mata Atlântica embala sonhos. Para nós, celebrar o amor é um ato
        simples, sincero e profundamente significativo. É permitir que a
        natureza seja a grande anfitriã, preparando o cenário perfeito para o
        seu sonho.
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
            Estrutura
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
        A 60 minutos de São Paulo, em São Lourenço da Serra.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border/60">
        <iframe
          title="Localização do Sítio Canto da Mata"
          src={GOOGLE_MAPS_EMBED_URL}
          className="h-72 w-full sm:h-80"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <p className="mt-5 text-sm text-foreground/75">
        {SITIO_ENDERECO}
      </p>

      <div className="mt-6 flex items-center justify-center gap-4">
        <a
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir no Google Maps"
          title="Abrir no Google Maps"
          className="flex h-14 w-14 items-center justify-center rounded-full border border-border/60 bg-card shadow-soft/40 transition hover:scale-105 hover:border-primary"
        >
          <img src={GOOGLE_MAPS_ICON} alt="Google Maps" className="h-8 w-8" />
        </a>
        <a
          href={WAZE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir no Waze"
          title="Abrir no Waze"
          className="flex h-14 w-14 items-center justify-center rounded-full border border-border/60 bg-card shadow-soft/40 transition hover:scale-105 hover:border-primary"
        >
          <img src={WAZE_ICON} alt="Waze" className="h-8 w-8" />
        </a>
      </div>
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
