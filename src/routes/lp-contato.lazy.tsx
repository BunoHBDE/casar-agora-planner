import { createLazyFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";
import { GOOGLE_MAPS_ICON, WAZE_ICON } from "@/assets/map-icons";

export const Route = createLazyFileRoute("/lp-contato")({
  component: LandingContato,
});

// Mesmo webhook do formulário de proposta da home: os leads caem na mesma
// planilha, diferenciados pelo campo "origem".
const WEBHOOK_URL_PROPOSTA =
  "https://script.google.com/macros/s/AKfycbxSNqMil3-Cp2zTJDgNWW7QMa7WDHhzleqp_iUgwzcqzm7R1oYCjlP5whqhCTkwuMu0_g/exec";

const WHATSAPP_NUMERO = "5511933197671";
const INSTAGRAM_URL = "https://www.instagram.com/sitiocantodamata100";

const HERO_IMAGE_URL = "/images/hero-venue-1400.webp";
const HERO_SRCSET_AVIF = "/images/hero-venue-700.avif 700w, /images/hero-venue-1400.avif 1400w";
const HERO_SRCSET_WEBP = "/images/hero-venue-700.webp 700w, /images/hero-venue-1400.webp 1400w";

const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const ANOS = Array.from({ length: 6 }, (_, i) => String(2026 + i));

const SITIO_ENDERECO = "Estrada Dos Tigres, 100 - Pereiras, São Lourenço da Serra - SP, 06890-000";
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

// Evento customizado para o GTM: gatilho "Evento personalizado" com o
// nome "whatsapp_click". No Meta Pixel dispara o evento padrão "Contact".
function trackWhatsappClick() {
  if (typeof window !== "undefined") {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ event: "whatsapp_click" });
    if (typeof (window as any).fbq === "function") {
      (window as any).fbq("track", "Contact", { content_name: "botao_whatsapp_lp_contato" });
    }
  }
}

function LandingContato() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero />
      <Estrutura />
      <Galeria />
      <Localizacao />
      <Contato />
      <Footer />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative isolate">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <picture>
          <source srcSet={HERO_SRCSET_AVIF} sizes="100vw" type="image/avif" />
          <source srcSet={HERO_SRCSET_WEBP} sizes="100vw" type="image/webp" />
          <img
            src={HERO_IMAGE_URL}
            alt="Sítio Canto da Mata"
            width={1400}
            height={1050}
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </picture>
        <div className="absolute inset-0 bg-primary/50" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />
      </div>
      <div
        className="mx-auto max-w-2xl px-6 pt-20 pb-28 text-center text-primary-foreground sm:pt-28 sm:pb-36"
        style={{ textShadow: "0 2px 16px rgba(0,0,0,0.45)" }}
      >
        <span className="text-[11px] uppercase tracking-[0.24em] text-primary-foreground/85">
          SÍTIO CANTO DA MATA
        </span>
        <h1 className="mt-4 font-serif text-3xl leading-tight sm:text-5xl">
          Um refúgio no campo para o seu grande dia
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-primary-foreground/90 sm:text-base">
          Espaço para casamentos a 60 minutos de São Paulo, com buffet, decoração e
          exclusividade de um único evento por dia.
        </p>
        <div className="mt-8">
          <a
            href="#contato"
            className="inline-block rounded-full bg-primary-foreground px-8 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-primary transition hover:bg-primary-foreground/90"
          >
            Quero minha proposta
          </a>
          <p className="mt-3 text-xs text-primary-foreground/80">
            Sem compromisso · leva menos de 1 minuto
          </p>
        </div>
      </div>
    </section>
  );
}

function Estrutura() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="text-center">
        <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          O que está incluso
        </span>
        <h2 className="mt-3 font-serif text-2xl text-primary sm:text-3xl">
          Uma estrutura completa para o seu casamento
        </h2>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
    </section>
  );
}

function Galeria() {
  return (
    <section className="border-y border-border/60 bg-secondary/40 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Galeria</span>
          <h2 className="mt-3 font-serif text-2xl text-primary sm:text-3xl">
            Um passeio pelo sítio
          </h2>
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {GALERIA_WEBP.map((src, i) => (
            <div key={src} className="aspect-[4/3] overflow-hidden rounded-xl bg-muted">
              <picture>
                <source srcSet={GALERIA_AVIF[i]} type="image/avif" />
                <source srcSet={src} type="image/webp" />
                <img
                  src={src}
                  alt={`Sítio Canto da Mata — foto ${i + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </picture>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Localizacao() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 text-center sm:py-20">
      <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Localização</span>
      <h2 className="mt-3 font-serif text-2xl text-primary sm:text-3xl">
        Fácil de chegar, longe da correria.
      </h2>
      <p className="mt-4 text-base text-foreground/80">
        A 60 minutos de São Paulo, em São Lourenço da Serra.
      </p>
      <p className="mt-3 text-sm text-foreground/75">{SITIO_ENDERECO}</p>

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

function Contato() {
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

  // O WhatsApp já abre com o nome de quem preencheu, para o time reconhecer
  // o lead que acabou de chegar na planilha.
  const primeiroNome = nome.trim().split(/\s+/)[0] ?? "";
  const whatsappTexto = primeiroNome
    ? `Olá, sou ${primeiroNome}. Acabei de preencher o formulário e quero agendar uma visita ao Sítio Canto da Mata`
    : "Olá, quero agendar uma visita ao Sítio Canto da Mata";
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(whatsappTexto)}`;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // content_name diferencia este Lead dos formulários da home (/) e da
    // planilha (/lp, /lp2) nas Conversões Personalizadas do Meta.
    if (typeof window !== "undefined" && typeof (window as any).fbq === "function") {
      (window as any).fbq("track", "Lead", { content_name: "formulario_proposta_lp_contato" });
    }
    if (typeof window !== "undefined") {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({ event: "lead_form_lp_contato_submit", form_name: "proposta_lp_contato" });
    }
    formRef.current?.submit();
    setEnviado(true);
  }

  return (
    <section id="contato" className="mx-auto max-w-xl px-4 py-16 sm:px-6 sm:py-20">
      <iframe name="proposta-sink" title="proposta-sink" style={{ display: "none" }} />

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft">
        <div className="p-6 sm:p-8">
          <h2 className="font-serif text-2xl text-primary sm:text-3xl">
            Receba uma proposta personalizada
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Preencha seus dados e comece a planejar o seu casamento com o Sítio Canto da Mata.
          </p>

          {enviado ? (
            <p className="mt-6 rounded-md bg-primary/10 p-4 text-sm text-primary">
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
              <input type="hidden" name="origem" value="lp-contato" />

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
              <p className="text-center text-xs text-muted-foreground">
                Seus dados são confidenciais. Sem spam.
              </p>
            </form>
          )}
        </div>

        {/* Banner do WhatsApp: nesta LP ele só aparece depois que a pessoa
            envia os dados, para que o contato direto não substitua o lead. */}
        {enviado && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackWhatsappClick}
            className="flex flex-col items-center justify-center gap-3 bg-primary p-8 text-center text-primary-foreground transition hover:bg-primary/90"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-foreground/15">
              <MessageCircle className="h-7 w-7" strokeWidth={1.75} />
            </span>
            <p className="font-serif text-lg leading-snug">Quer adiantar a conversa?</p>
            <p className="text-sm text-primary-foreground/85">
              Clique aqui e fale agora com o nosso time no WhatsApp.
            </p>
          </a>
        )}
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
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-3 px-6 py-8 text-xs text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} Sítio Canto da Mata</p>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
          Instagram
        </a>
      </div>
    </footer>
  );
}
