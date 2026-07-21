import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Sparkles,
  Waves,
  Sun,
  Users,
  UtensilsCrossed,
  CheckCircle2,
  ChevronDown,
  MessageCircle,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { GOOGLE_MAPS_ICON, WAZE_ICON } from "@/assets/map-icons";
import { FAQ_ITEMS, TEMPO_CARRO_ITAPECERICA, VIA_ACESSO_ITAPECERICA } from "./casamento-em-itapecerica-da-serra";

export const Route = createLazyFileRoute("/casamento-em-itapecerica-da-serra")({
  component: CasamentoItapecericaDaSerra,
});

const WHATSAPP_URL =
  "https://wa.me/5511933197671?text=Ol%C3%A1%2C%20quero%20agendar%20uma%20visita%20ao%20S%C3%ADtio%20Canto%20da%20Mata";

// Mesmo evento customizado do restante do site ("whatsapp_click"), com um
// content_name próprio para diferenciar o clique vindo desta página local nas
// Conversões Personalizadas do Meta.
function trackWhatsappClick() {
  if (typeof window !== "undefined") {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ event: "whatsapp_click", page: "casamento-itapecerica-da-serra" });
    if (typeof (window as any).fbq === "function") {
      (window as any).fbq("track", "Contact", { content_name: "botao_whatsapp_itapecerica" });
    }
  }
}

function trackAgendarVisitaClick() {
  if (typeof window !== "undefined") {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ event: "agendar_visita_click", page: "casamento-itapecerica-da-serra" });
  }
}

const SITIO_ENDERECO = "Estrada Dos Tigres, 100 - Pereiras, São Lourenço da Serra - SP, 06890-000";
const SITIO_LAT = -23.8464778;
const SITIO_LNG = -46.9028855;
const GOOGLE_MAPS_EMBED_URL = `https://www.google.com/maps?q=${SITIO_LAT},${SITIO_LNG}&hl=pt-BR&z=13&output=embed`;
const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/Hi3gP8wreiHrvFAP8";
const WAZE_URL = "https://www.waze.com/en/live-map/directions/sitio-canto-da-mata-sao-lourenco-da-serra?place=w.205194778.2051947775.41039786";

const DIFERENCIAIS = [
  {
    Icon: Sparkles,
    titulo: "Exclusividade total",
    desc: "Apenas um evento por dia. O sítio inteiro é de vocês, do primeiro ao último convidado.",
  },
  {
    Icon: Waves,
    titulo: "Cerimônia sobre o lago",
    desc: "O altar à beira d'água, com o abraço da natureza como cenário.",
  },
  {
    Icon: Sun,
    titulo: "Casamento à luz do dia",
    desc: "A celebração ao ar livre, sem pressa, no ritmo tranquilo do campo.",
  },
  {
    Icon: Users,
    titulo: "Até 100 convidados",
    desc: "Intimista na medida certa: perto o suficiente para abraçar todo mundo.",
  },
  {
    Icon: UtensilsCrossed,
    titulo: "Buffet completo",
    desc: "Serviço contínuo, com alimentação garantida do início ao fim da festa.",
  },
  {
    Icon: CheckCircle2,
    titulo: "Tudo pronto no dia",
    desc: "Mobiliário, estacionamento privativo e equipe de apoio já incluídos.",
  },
];

const GALERIA_WEBP = [
  "/images/galeria/galeria-1.webp",
  "/images/galeria/galeria-2.webp",
  "/images/galeria/galeria-3.webp",
  "/images/galeria/galeria-4.webp",
  "/images/galeria/galeria-5.webp",
  "/images/galeria/galeria-6.webp",
];
const GALERIA_AVIF = [
  "/images/galeria/galeria-1.avif",
  "/images/galeria/galeria-2.avif",
  "/images/galeria/galeria-3.avif",
  "/images/galeria/galeria-4.avif",
  "/images/galeria/galeria-5.avif",
  "/images/galeria/galeria-6.avif",
];

function CasamentoItapecericaDaSerra() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopoMinimo />
      <Breadcrumb />
      <Hero />
      <OndeFicamos />
      <PorQueCasarAqui />
      <Galeria />
      <Faq />
      <CTAFinal />
      <Footer />
    </div>
  );
}

function TopoMinimo() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-serif text-lg tracking-wide text-primary">
          Sítio Canto da Mata
        </Link>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackWhatsappClick}
          className="rounded-full border border-primary/30 px-4 py-2 text-xs font-medium uppercase tracking-[0.1em] text-primary transition hover:bg-primary/10"
        >
          WhatsApp
        </a>
      </div>
    </header>
  );
}

function Breadcrumb() {
  return (
    <nav aria-label="breadcrumb" className="mx-auto max-w-6xl px-6 pt-4 text-xs text-muted-foreground">
      <Link to="/" className="hover:text-primary">
        Home
      </Link>
      <span className="mx-1.5">›</span>
      <span>Casamento no Campo</span>
      <span className="mx-1.5">›</span>
      <span aria-current="page" className="text-foreground/70">
        Itapecerica da Serra
      </span>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative isolate mt-6">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <picture>
          <source
            srcSet="/images/hero-venue-700.avif 700w, /images/hero-venue-1400.avif 1400w"
            sizes="100vw"
            type="image/avif"
          />
          <source
            srcSet="/images/hero-venue-700.webp 700w, /images/hero-venue-1400.webp 1400w"
            sizes="100vw"
            type="image/webp"
          />
          <img
            src="/images/hero-venue-1400.webp"
            alt="Sítio Canto da Mata"
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
        </picture>
        <div className="absolute inset-0 bg-primary/50" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />
      </div>
      <div
        className="mx-auto max-w-3xl px-6 pt-20 pb-32 text-center text-primary-foreground sm:pt-28 sm:pb-40"
        style={{ textShadow: "0 2px 16px rgba(0,0,0,0.45)" }}
      >
        <span className="text-[11px] uppercase tracking-[0.28em] text-primary-foreground/85">
          Casamento em Itapecerica da Serra e região
        </span>
        <h1 className="mt-5 font-serif text-4xl leading-tight sm:text-6xl">
          O seu casamento na serra, a {TEMPO_CARRO_ITAPECERICA} de Itapecerica
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm text-primary-foreground/90 sm:text-base">
          Um refúgio no campo onde o dia é só de vocês — cerimônia ao ar livre, sob as árvores, a uma viagem
          tranquila do centro de Itapecerica da Serra.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="/#contato"
            onClick={trackAgendarVisitaClick}
            className="w-full rounded-full bg-primary-foreground px-6 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-primary transition hover:bg-primary-foreground/90 sm:w-auto"
          >
            Agende uma visita
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackWhatsappClick}
            className="w-full rounded-full border border-primary-foreground/70 px-6 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-primary-foreground transition hover:bg-primary-foreground/10 sm:w-auto"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

function OndeFicamos() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20 text-center sm:py-28">
      <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
        Fácil de chegar, longe da correria
      </span>
      <h2 className="mt-4 font-serif text-3xl text-primary sm:text-4xl">Perto de Itapecerica, mas dentro do campo</h2>
      <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-foreground/80">
        Se você procura um lugar para casar na região de Itapecerica da Serra, mas quer um espaço só seu — sem
        dividir o dia com outra festa, sem o barulho da cidade —, o Sítio Canto da Mata está logo ali. Ficamos em
        São Lourenço da Serra, a cerca de {TEMPO_CARRO_ITAPECERICA} de Itapecerica — o trajeto passa pelo centro da
        cidade e segue pela {VIA_ACESSO_ITAPECERICA}.
      </p>
      <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-foreground/80">
        É perto o bastante para os seus convidados chegarem sem viagem longa, e distante o bastante para que, ao
        passar o portão, o tempo desacelere. O cheiro da terra se mistura ao do café fresco, a brisa embala a
        cerimônia, e a natureza assume o papel de anfitriã.
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

      <p className="mt-5 text-sm text-foreground/75">{SITIO_ENDERECO}</p>

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

function PorQueCasarAqui() {
  return (
    <section className="border-y border-border/60 bg-secondary/40 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
            O que torna o dia inesquecível
          </span>
          <h2 className="mt-4 font-serif text-3xl text-primary sm:text-4xl">
            Um casamento como você sempre imaginou
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DIFERENCIAIS.map(({ Icon, titulo, desc }) => (
            <article key={titulo} className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft/40">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/60 text-primary">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <h3 className="mt-3 font-serif text-xl text-primary">{titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/75">{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Galeria() {
  const [aberta, setAberta] = useState<number | null>(null);

  const fechar = () => setAberta(null);
  const anterior = () => setAberta((i) => (i === null ? null : (i - 1 + GALERIA_WEBP.length) % GALERIA_WEBP.length));
  const proxima = () => setAberta((i) => (i === null ? null : (i + 1) % GALERIA_WEBP.length));

  useEffect(() => {
    if (aberta === null) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setAberta(null);
      if (e.key === "ArrowLeft") anterior();
      if (e.key === "ArrowRight") proxima();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [aberta]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
      <div className="text-center">
        <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Um passeio pelo sítio</span>
        <h2 className="mt-4 font-serif text-3xl text-primary sm:text-4xl">O cenário do seu grande dia</h2>
      </div>
      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {GALERIA_WEBP.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setAberta(i)}
            aria-label={`Ampliar foto ${i + 1}`}
            className="aspect-[4/3] cursor-zoom-in overflow-hidden rounded-xl bg-muted"
          >
            <picture>
              <source srcSet={GALERIA_AVIF[i]} type="image/avif" />
              <source srcSet={src} type="image/webp" />
              <img
                src={src}
                alt={`Sítio Canto da Mata — foto ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 hover:scale-105"
              />
            </picture>
          </button>
        ))}
      </div>

      {aberta !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={fechar}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={fechar}
            aria-label="Fechar"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              anterior();
            }}
            aria-label="Foto anterior"
            className="absolute left-2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-4"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>

          <picture>
            <source srcSet={GALERIA_AVIF[aberta]} type="image/avif" />
            <source srcSet={GALERIA_WEBP[aberta]} type="image/webp" />
            <img
              src={GALERIA_WEBP[aberta]}
              alt={`Sítio Canto da Mata — foto ${aberta + 1}`}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
            />
          </picture>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              proxima();
            }}
            aria-label="Próxima foto"
            className="absolute right-2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-4"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </div>
      )}
    </section>
  );
}

function Faq() {
  return (
    <section className="border-t border-border/60 bg-secondary/30 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
            Perguntas frequentes
          </span>
        </div>
        <div className="mt-8 space-y-3">
          {FAQ_ITEMS.map(({ q, a }) => (
            <details
              key={q}
              className="group rounded-xl border border-border/60 bg-card px-5 py-4 open:shadow-soft/40"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-base text-primary">
                {q}
                <ChevronDown className="h-4 w-4 shrink-0 text-primary/60 transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-foreground/75">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTAFinal() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-2xl px-6 py-20 text-center sm:py-28">
        <span className="text-[11px] uppercase tracking-[0.24em] text-primary-foreground/70">Vamos começar</span>
        <h2 className="mt-4 font-serif text-3xl sm:text-4xl">Venha sentir o clima do sítio</h2>
        <p className="mx-auto mt-4 max-w-lg text-sm text-primary-foreground/90 sm:text-base">
          Agende uma visita e conheça de perto o lugar onde o seu casamento vira memória para a vida toda. A{" "}
          {TEMPO_CARRO_ITAPECERICA} de Itapecerica da Serra, no ritmo tranquilo do campo.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="/#contato"
            onClick={trackAgendarVisitaClick}
            className="w-full rounded-full bg-primary-foreground px-6 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-primary transition hover:bg-primary-foreground/90 sm:w-auto"
          >
            Agende uma visita
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackWhatsappClick}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary-foreground/70 px-6 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-primary-foreground transition hover:bg-primary-foreground/10 sm:w-auto"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
            Prefere falar direto no WhatsApp? Clique aqui.
          </a>
        </div>
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
          <Link to="/" className="hover:text-primary">
            Início
          </Link>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={trackWhatsappClick} className="hover:text-primary">
            WhatsApp
          </a>
          <Link to="/lp" className="hover:text-primary">
            Planilha grátis
          </Link>
        </div>
      </div>
    </footer>
  );
}
