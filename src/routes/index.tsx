import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Menu, X, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";
import { GOOGLE_MAPS_ICON, WAZE_ICON } from "@/assets/map-icons";

const HERO_IMAGE_URL = "/images/hero-venue.webp";
const HERO_IMAGE_AVIF_URL = "/images/hero-venue.avif";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sítio Canto da Mata — Espaço para Casamentos no Campo" },
      {
        name: "description",
        content:
          "Sítio Canto da Mata: espaço para casamentos no campo, cercado pela natureza.. Agende sua visita.",
      },
      { property: "og:title", content: "Sítio Canto da Mata — Espaço para Casamentos no Campo" },
      {
        property: "og:description",
        content:
          "Sítio Canto da Mata: espaço para casamentos no campo, cercado pela natureza.. Agende sua visita.",
      },
      { property: "og:url", content: "https://sitiocantodamata.com.br/" },
      { property: "og:image", content: HERO_IMAGE_URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: HERO_IMAGE_URL },
    ],
    links: [
      { rel: "canonical", href: "https://sitiocantodamata.com.br/" },
      { rel: "preload", as: "image", href: HERO_IMAGE_AVIF_URL, type: "image/avif", fetchPriority: "high" },
    ],
  }),
  component: Home,
});

const WHATSAPP_URL = "https://wa.me/5511933197671?text=Ol%C3%A1%2C%20quero%20agendar%20uma%20visita%20ao%20S%C3%ADtio%20Canto%20da%20Mata";
const INSTAGRAM_URL = "https://www.instagram.com/sitiocantodamata100";

// Evento customizado para o GTM: gatilho "Evento personalizado" com o
// nome "whatsapp_click". Usado em todo botão/link que leva ao WhatsApp.
function trackWhatsappClick() {
  if (typeof window !== "undefined") {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ event: "whatsapp_click" });
  }
}

const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const ANOS = Array.from({ length: 6 }, (_, i) => String(2026 + i));

const SITIO_ENDERECO = "Estrada Dos Tigres, 100 - Pereiras, São Lourenço da Serra - SP, 06890-000";
const SITIO_LAT = -23.8464778;
const SITIO_LNG = -46.9028855;
const GOOGLE_MAPS_EMBED_URL = `https://www.google.com/maps?q=${SITIO_LAT},${SITIO_LNG}&hl=pt-BR&z=15&output=embed`;
const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/Hi3gP8wreiHrvFAP8";
const WAZE_URL = "https://www.waze.com/en/live-map/directions/sitio-canto-da-mata-sao-lourenco-da-serra?place=w.205194778.2051947775.41039786";

const DIFERENCIAIS = [
  { titulo: "O altar sobre o lago", desc: "O cenário para um \"sim\" inesquecível, com o abraço da natureza." },
  { titulo: "Buffet completo", desc: "Serviço contínuo com alimentação garantida do início ao fim da festa." },
  { titulo: "Decoração", desc: "Arranjos com flores naturais e preservadas, personalizados com o nosso acervo." },
  { titulo: "Exclusividade total", desc: "Apenas um evento por dia, privacidade absoluta." },
  { titulo: "Estacionamento privativo", desc: "Espaço amplo e seguro." },
  { titulo: "Mobiliário e equipe de apoio", desc: "Bancos, mesas, cadeiras e equipe no dia." },
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
// Mantido para compatibilidade com og:image/twitter:image (que exigem um único caminho)
const GALERIA = GALERIA_WEBP;

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

const NAV_LINKS = [
  { href: "#sobre", label: "Sobre" },
  { href: "#estrutura", label: "Estrutura" },
  { href: "#galeria", label: "Galeria" },
  { href: "#localizacao", label: "Localização" },
  { href: "#contato", label: "Contato" },
];

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="font-serif text-lg tracking-wide text-primary">
          Sítio Canto da Mata
        </a>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 gap-7 text-sm text-foreground/80 md:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-primary">
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          className="flex h-9 w-9 items-center justify-center text-primary md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-border/60 bg-background px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4 text-sm text-foreground/80">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative isolate">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <picture>
          <source srcSet={HERO_IMAGE_AVIF_URL} type="image/avif" />
          <source srcSet={HERO_IMAGE_URL} type="image/webp" />
          <img
            src={HERO_IMAGE_URL}
            alt="Sítio Canto da Mata"
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
        </picture>
        <div className="absolute inset-0 bg-primary/50" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />
      </div>
      <div
        className="mx-auto max-w-3xl px-6 pt-32 pb-40 text-center text-primary-foreground sm:pt-40 sm:pb-48"
        style={{ textShadow: "0 2px 16px rgba(0,0,0,0.45)" }}
      >
        <span className="text-[11px] uppercase tracking-[0.28em] text-primary-foreground/85">
          CASAMENTO NO CAMPO
        </span>
        <h1 className="mt-5 font-serif text-4xl leading-tight sm:text-6xl">
          Um refúgio no campo para o seu grande dia
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm text-primary-foreground/90 sm:text-base">
          Um lugar preparado para transformar o seu casamento em memória para a vida toda.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#contato"
            className="w-full rounded-full bg-primary-foreground px-6 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-primary transition hover:bg-primary-foreground/90 sm:w-auto"
          >
            Agende uma visita
          </a>
          <a
            href="#planilha"
            className="w-full rounded-full border border-primary-foreground/70 px-6 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-primary-foreground transition hover:bg-primary-foreground/10 sm:w-auto"
          >
            Dicas e Materiais
          </a>
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
        Aqui, o cheiro da terra se mistura ao do café fresco, e a brisa do
        vento embala sonhos. Para nós, celebrar o amor é um ato
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
  const [aberta, setAberta] = useState<number | null>(null);

  const fechar = () => setAberta(null);
  const anterior = () => setAberta((i) => (i === null ? null : (i - 1 + GALERIA.length) % GALERIA.length));
  const proxima = () => setAberta((i) => (i === null ? null : (i + 1) % GALERIA.length));

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
    <section id="galeria" className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
      <div className="text-center">
        <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Galeria</span>
        <h2 className="mt-4 font-serif text-3xl text-primary sm:text-4xl">
          Um passeio pelo sítio.
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          {"\n"}
        </p>
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

function Planilha() {
  return (
    <section id="planilha" className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-16 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="max-w-lg">
          <span className="text-[11px] uppercase tracking-[0.24em] text-primary-foreground/70">
            Planilha gratuita
          </span>
          <h2 className="mt-3 font-serif text-2xl sm:text-3xl">
            Baixe a planilha completa de organização do seu casamento.
          </h2>
          <p className="mt-2 text-sm text-primary-foreground/85">
            Organize tudo que você precisa em um só lugar.
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

const WEBHOOK_URL_PROPOSTA = "https://script.google.com/macros/s/AKfycbxSNqMil3-Cp2zTJDgNWW7QMa7WDHhzleqp_iUgwzcqzm7R1oYCjlP5whqhCTkwuMu0_g/exec";

function CTAFinal() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");
  const [convidados, setConvidados] = useState("");
  const [dataExata, setDataExata] = useState<Date | undefined>(undefined);
  const [dataModo, setDataModo] = useState<"aproximado" | "exata">("aproximado");
  const [fase, setFase] = useState("");
  const [enviado, setEnviado] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const maskTelefone = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const dataExataStr = dataExata
    ? dataExata.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
    : "";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!WEBHOOK_URL_PROPOSTA) {
      console.warn("[CTAFinal] WEBHOOK_URL_PROPOSTA ainda não configurado — envio não realizado.");
      setEnviado(true);
      return;
    }
    if (typeof window !== "undefined" && typeof (window as any).fbq === "function") {
      (window as any).fbq("track", "Lead");
    }
    // Evento customizado para o Google Tag Manager disparar a tag de
    // conversão do Google Ads (o gatilho no GTM deve ser "Evento
    // personalizado" com o nome "lead_form_home_submit").
    if (typeof window !== "undefined") {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({ event: "lead_form_home_submit", form_name: "proposta_home" });
    }
    formRef.current?.submit();
    setEnviado(true);
  }

  return (
    <section id="contato" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
      <iframe name="proposta-sink" title="proposta-sink" style={{ display: "none" }} />
      <div className="grid overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft sm:grid-cols-[1.4fr_1fr]">
        {/* Formulário */}
        <div className="p-6 sm:p-10">
          <h2 className="font-serif text-2xl text-primary sm:text-3xl">
            Receba uma proposta personalizada
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Preencha seus dados e comece a planejar o seu casamento com o{"\n"}
            Sítio Canto da Mata
          </p>

          {enviado ? (
            <p className="mt-8 rounded-md bg-primary/10 p-4 text-sm text-primary">
              Recebemos seus dados! Em breve entraremos em contato.
            </p>
          ) : (
            <form
              ref={formRef}
              action={WEBHOOK_URL_PROPOSTA}
              method="post"
              target="proposta-sink"
              onSubmit={handleSubmit}
              autoComplete="off"
              className="mt-6 grid gap-4"
            >
              <input type="hidden" name="data_exata" value={dataExataStr} />

              <Field label="Nome *">
                <input
                  required
                  name="nome"
                  autoComplete="name"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className={inputCls}
                  placeholder="Informe seu nome completo"
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="E-mail *">
                  <input
                    required
                    type="email"
                    inputMode="email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputCls}
                    placeholder="Informe seu melhor e-mail"
                  />
                </Field>
                <Field label="Telefone *">
                  <input
                    required
                    type="tel"
                    inputMode="tel"
                    name="celular"
                    autoComplete="tel"
                    value={telefone}
                    onChange={(e) => setTelefone(maskTelefone(e.target.value))}
                    className={inputCls}
                    placeholder="Informe seu telefone"
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Data desejada">
                  <div className="mb-2 inline-flex rounded-full border border-input p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setDataModo("aproximado")}
                      className={`rounded-full px-3 py-1.5 font-medium transition ${
                        dataModo === "aproximado"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Mês e ano
                    </button>
                    <button
                      type="button"
                      onClick={() => setDataModo("exata")}
                      className={`rounded-full px-3 py-1.5 font-medium transition ${
                        dataModo === "exata"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Já sei a data exata
                    </button>
                  </div>

                  {dataModo === "aproximado" ? (
                    <div className="grid grid-cols-2 gap-2">
                      <select name="mes" value={mes} onChange={(e) => setMes(e.target.value)} className={inputCls}>
                        <option value="">Mês</option>
                        {MESES.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                      <select name="ano" value={ano} onChange={(e) => setAno(e.target.value)} className={inputCls}>
                        <option value="">Ano</option>
                        {ANOS.map((a) => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className={`${inputCls} flex items-center text-left ${!dataExata ? "text-muted-foreground" : ""}`}
                        >
                          {dataExata
                            ? dataExata.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })
                            : "Selecione uma data"}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dataExata}
                          onSelect={setDataExata}
                          captionLayout="dropdown"
                          startMonth={new Date(2026, 0)}
                          endMonth={new Date(2031, 11)}
                          locale={ptBR}
                          classNames={{ nav: "hidden" }}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                </Field>
                <Field label="Convidados">
                  <input
                    id="numero-convidados"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="off"
                    aria-autocomplete="none"
                    data-lpignore="true"
                    data-form-type="other"
                    name="convidados"
                    value={convidados}
                    onChange={(e) => setConvidados(e.target.value.replace(/\D/g, ""))}
                    className={inputCls}
                    placeholder="80"
                  />
                </Field>
              </div>

              <Field label="Em qual fase do planejamento você está?">
                <select name="fase" value={fase} onChange={(e) => setFase(e.target.value)} className={inputCls}>
                  <option value="">Selecione uma opção</option>
                  <option value="inicial">Estou na fase inicial, apenas pesquisando valores</option>
                  <option value="visitas">Já comecei as visitas, mas continuo pesquisando os locais</option>
                  <option value="ultimas_visitas">Estou fazendo as últimas visitas e pronta para fechar</option>
                </select>
              </Field>

              <button
                type="submit"
                className="mt-2 w-full rounded-full bg-primary px-6 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-primary-foreground transition hover:bg-primary/90"
              >
                Quero minha proposta
              </button>
            </form>
          )}
        </div>

        {/* Banner WhatsApp */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackWhatsappClick}
          className="flex flex-col items-center justify-center gap-3 bg-primary p-8 text-center text-primary-foreground transition hover:bg-primary/90"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-foreground/15">
            <MessageCircle className="h-7 w-7" strokeWidth={1.75} />
          </span>
          <p className="font-serif text-lg leading-snug">Prefere falar direto no WhatsApp?</p>
          <p className="text-sm text-primary-foreground/85">Clique aqui e fale agora com nosso time.</p>
        </a>
      </div>
    </section>
  );
}

const inputCls =
  "h-11 w-full rounded-md border border-input bg-background px-3 text-base text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20 sm:text-sm";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
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
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={trackWhatsappClick} className="hover:text-primary">
            WhatsApp
          </a>
          <Link to="/lp" className="hover:text-primary">Planilha grátis</Link>
        </div>
      </div>
    </footer>
  );
}
