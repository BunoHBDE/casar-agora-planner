import { createLazyFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Check, MessageCircle, Play } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";
import { aplicarCorrespondenciaAvancada } from "@/lib/meta-pixel";

export const Route = createLazyFileRoute("/lp-contato")({
  component: LandingContato,
});

// Mesmo webhook do formulário de proposta da home: os leads caem na mesma
// planilha, diferenciados pelo campo "origem".
const WEBHOOK_URL_PROPOSTA =
  "https://script.google.com/macros/s/AKfycbxSNqMil3-Cp2zTJDgNWW7QMa7WDHhzleqp_iUgwzcqzm7R1oYCjlP5whqhCTkwuMu0_g/exec";

const WHATSAPP_NUMERO = "5511933197671";

const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const ANOS = Array.from({ length: 6 }, (_, i) => String(2026 + i));

const LIMITE_CONVIDADOS = 100;

// Cada recorte é um disparo próprio do evento padrão Lead, com o seu
// content_name — mesmo padrão de /lp e /lp2, em que cada formulário tem o
// seu. O primeiro cobre todos os envios; os outros quatro saem junto,
// quando o lead se encaixa no recorte.
const CONTENT_NAME_TODOS = "formulario_proposta_lp_contato";
const CONTENT_NAME_ATE_100 = "formulario_proposta_lp_contato_ate_100";
const CONTENT_NAME_POR_FASE: Record<string, string> = {
  inicial: "formulario_proposta_lp_contato_ate_100_inicial",
  visitas: "formulario_proposta_lp_contato_ate_100_visitas",
  ultimas_visitas: "formulario_proposta_lp_contato_ate_100_ultimas_visitas",
};

function dispararLead(contentName: string) {
  if (typeof window === "undefined") return;
  if (typeof (window as any).fbq !== "function") return;
  (window as any).fbq("track", "Lead", { content_name: contentName });
}

// No GTM o modelo é outro: lá cada segmento continua sendo um evento
// próprio no dataLayer, que é como os gatilhos do container funcionam.
const GTM_EVENTO_ATE_100 = "lead_100_convidados";
const GTM_EVENTO_POR_FASE: Record<string, string> = {
  inicial: "lead_100_convidados_fase_inicial",
  visitas: "lead_100_convidados_fase_visitas",
  ultimas_visitas: "lead_100_convidados_fase_ultimas_visitas",
};

function empurrarParaGTM(evento: string, dados: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({ event: evento, ...dados });
}

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

const NUMEROS = [
  { valor: "50 mil m²", texto: "de mata preservada como moldura do seu “sim”" },
  { valor: "60 min", texto: "de São Paulo, num refúgio de paz" },
  { valor: "1 evento", texto: "por dia: o sítio é inteiramente seu" },
];

const CENARIOS = [
  {
    titulo: "O altar sobre o lago",
    desc: "O coração do nosso quintal, para um “sim” sob o céu aberto e a moldura da mata.",
    webp: "/images/lp-contato/altar-lago-700.webp",
    avif: "/images/lp-contato/altar-lago-700.avif",
  },
  {
    titulo: "Área gourmet e piscina",
    desc: "A sala de estar da celebração: ampla, integrada e cheia de vida.",
    webp: "/images/galeria/galeria-4.webp",
    avif: "/images/galeria/galeria-4.avif",
  },
  {
    titulo: "Mesas sob a pérgola",
    desc: "O almoço de domingo que vira festa, à sombra e com a mata em volta.",
    webp: "/images/lp-contato/mesa-posta-700.webp",
    avif: "/images/lp-contato/mesa-posta-700.avif",
  },
];

const PACOTE = [
  "Espaço por 6 horas, com 1h de cortesia para a chegada dos convidados",
  "Decoração com flores preservadas, do altar às mesas",
  "Buffet completo, com serviço de garçons e self-service",
  "Mobiliário: bancos de cerimônia, mesas rústicas e pontos de buffet",
  "Equipe de apoio durante todo o evento",
  "Estacionamento privativo",
];

const PASSOS = [
  {
    numero: "1",
    titulo: "Você preenche o formulário",
    desc: "Leva menos de um minuto. Os dados servem para montarmos uma proposta com o seu número de convidados.",
  },
  {
    numero: "2",
    titulo: "Uma consultora entra em contato em até 24h",
    desc: "Quem fala com você é uma das nossas consultoras, pelo WhatsApp ou telefone que você informar.",
  },
  {
    numero: "3",
    titulo: "Você recebe a apresentação e a proposta com valores",
    desc: "Conhece o espaço em detalhe e recebe os valores do Pacote Essência para a sua data.",
  },
];

function LandingContato() {
  // O envio é compartilhado pelos dois formulários: quem preenche o do topo
  // vê a confirmação também no do fim, e ninguém manda o mesmo lead duas
  // vezes por ter rolado a página depois de enviar.
  const [enviado, setEnviado] = useState(false);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Um único destino para os dois formulários: nomes de iframe repetidos
          na mesma página não são resolvidos de forma confiável. */}
      <iframe name="proposta-sink" title="proposta-sink" style={{ display: "none" }} />

      <section className="mx-auto max-w-xl px-4 pt-10 pb-2 sm:px-6 sm:pt-14">
        <p className="text-center text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          Sítio Canto da Mata
        </p>
        <h1 className="mt-3 text-center font-serif text-lg leading-snug text-primary sm:text-xl">
          Um lugar preparado para transformar o seu casamento em memória para a vida toda.
        </h1>
        <p className="mt-1.5 text-center text-sm text-foreground/80">
          Dê o primeiro passo para conhecer nosso espaço
        </p>
        <Contato idPrefixo="topo" enviado={enviado} aoEnviar={() => setEnviado(true)} />
      </section>

      <Refugio />
      <Cenarios />
      <PacoteEssencia />
      <Video />
      <ComoFunciona />

      <div id="contato" className="mx-auto max-w-xl px-4 pb-4 sm:px-6">
        <Contato
          idPrefixo="fim"
          titulo="Dê o primeiro passo para conhecer nosso espaço"
          enviado={enviado}
          aoEnviar={() => setEnviado(true)}
        />
      </div>
      <Rodape />
    </main>
  );
}

function Refugio() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-14 text-center sm:py-20">
      <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
        Nossa história
      </span>
      <h2 className="mt-3 font-serif text-2xl text-primary sm:text-3xl">
        Um refúgio com alma e memórias
      </h2>
      <p className="mt-5 text-base leading-relaxed text-foreground/80">
        Uma antiga fazenda dos anos 1980, que cultivamos com o carinho de quem cuida do
        próprio quintal. Aqui o tempo desacelera: o cheiro da terra se mistura ao do café
        fresco e a brisa da Mata Atlântica embala sonhos. Celebrar o amor de um jeito
        simples e sincero, com a natureza como anfitriã.
      </p>
      <dl className="mt-10 grid gap-6 sm:grid-cols-3">
        {NUMEROS.map((n) => (
          <div key={n.valor}>
            <dt className="font-serif text-2xl text-primary">{n.valor}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-foreground/70">{n.texto}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Cenarios() {
  return (
    <section className="border-y border-border/60 bg-secondary/40 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
            O espaço
          </span>
          <h2 className="mt-3 font-serif text-2xl text-primary sm:text-3xl">
            Onde a magia acontece
          </h2>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {CENARIOS.map((c) => (
            <article key={c.titulo} className="overflow-hidden rounded-2xl border border-border/60 bg-card">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <picture>
                  <source srcSet={c.avif} type="image/avif" />
                  <source srcSet={c.webp} type="image/webp" />
                  <img
                    src={c.webp}
                    alt={c.titulo}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </picture>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-lg text-primary">{c.titulo}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground/75">{c.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PacoteEssencia() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
      <div className="text-center">
        <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          Pacote Essência
        </span>
        <h2 className="mt-3 font-serif text-2xl text-primary sm:text-3xl">
          A celebração completa, com o coração no quintal
        </h2>
        <p className="mt-3 text-sm text-foreground/75">
          Um pacote que já resolve o essencial do seu dia — e continua sendo seu para
          personalizar.
        </p>
      </div>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {PACOTE.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 rounded-xl border border-border/60 bg-card p-4 text-sm leading-relaxed text-foreground/80"
          >
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2.5} />
            {item}
          </li>
        ))}
      </ul>

      {/* Duas fotos de decoração e mesa de bolo: mostram na prática o que a
          lista de itens promete. */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {[
          { nome: "bolo-flores", alt: "Mesa de bolo com arranjos de flores laranja e pink" },
          { nome: "bolo-branco", alt: "Mesa de bolo com cortina de samambaias e flores brancas" },
        ].map((foto) => (
          <div key={foto.nome} className="aspect-[4/3] overflow-hidden rounded-xl bg-muted">
            <picture>
              <source srcSet={`/images/lp-contato/${foto.nome}-700.avif`} type="image/avif" />
              <source srcSet={`/images/lp-contato/${foto.nome}-700.webp`} type="image/webp" />
              <img
                src={`/images/lp-contato/${foto.nome}-700.webp`}
                alt={foto.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </picture>
          </div>
        ))}
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border/60 bg-secondary/40 p-4">
          <h3 className="font-serif text-base text-primary">Dois menus, servidos com afeto</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground/75">
            Brasileirinho, com strogonoff e acompanhamentos de casa, ou Família, com massas
            e molhos suculentos. Louças, talheres e equipe inclusos.
          </p>
        </div>
        <div className="rounded-xl border border-border/60 bg-secondary/40 p-4">
          <h3 className="font-serif text-base text-primary">Celebrações diurnas</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground/75">
            Com início entre 9h e 15h, para aproveitar a luz natural — a melhor moldura
            para as fotos e para um almoço festivo ao ar livre.
          </p>
        </div>
      </div>
    </section>
  );
}

function Video() {
  const [tocando, setTocando] = useState(false);

  return (
    <section className="border-y border-border/60 bg-secondary/40 py-14 sm:py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          Um passeio pelo sítio
        </span>
        <h2 className="mt-3 font-serif text-2xl text-primary sm:text-3xl">
          Veja o lugar antes de conhecer
        </h2>

        {/* O vídeo é vertical, então fica numa coluna estreita. Só é baixado
            quando a pessoa clica: até lá, o que carrega é a foto de capa. */}
        <div className="mx-auto mt-8 w-full max-w-[380px] overflow-hidden rounded-2xl border border-border/60 bg-muted">
          <div className="relative aspect-[9/16]">
            {tocando ? (
              <video
                src="/videos/sitio-canto-da-mata.mp4"
                className="h-full w-full object-cover"
                controls
                autoPlay
                playsInline
              />
            ) : (
              <button
                type="button"
                onClick={() => setTocando(true)}
                aria-label="Reproduzir o vídeo do Sítio Canto da Mata"
                className="group h-full w-full"
              >
                <picture>
                  <source srcSet="/images/galeria/galeria-1.avif" type="image/avif" />
                  <source srcSet="/images/galeria/galeria-1.webp" type="image/webp" />
                  <img
                    src="/images/galeria/galeria-1.webp"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </picture>
                <span className="absolute inset-0 flex items-center justify-center bg-primary/25 transition group-hover:bg-primary/35">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-foreground/90 text-primary shadow-soft">
                    <Play className="ml-1 h-7 w-7" fill="currentColor" strokeWidth={0} />
                  </span>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ComoFunciona() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
      <div className="text-center">
        <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          Como funciona
        </span>
        <h2 className="mt-3 font-serif text-2xl text-primary sm:text-3xl">
          O que acontece depois que você envia
        </h2>
      </div>
      <ol className="mt-8 grid gap-4">
        {PASSOS.map((p) => (
          <li key={p.numero} className="flex gap-4 rounded-2xl border border-border/60 bg-card p-5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-serif text-base text-primary-foreground">
              {p.numero}
            </span>
            <div>
              <h3 className="font-serif text-lg text-primary">{p.titulo}</h3>
              <p className="mt-1 text-sm leading-relaxed text-foreground/75">{p.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Rodape() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-3xl px-6 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Sítio Canto da Mata · São Lourenço da Serra, SP
      </div>
    </footer>
  );
}

function Contato({
  idPrefixo,
  titulo,
  enviado,
  aoEnviar,
}: {
  idPrefixo: string;
  titulo?: string;
  enviado: boolean;
  aoEnviar: () => void;
}) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");
  const [convidados, setConvidados] = useState("");
  const [dataExata, setDataExata] = useState<Date | undefined>(undefined);
  const [dataModo, setDataModo] = useState<"aproximado" | "exata">("aproximado");
  const [erroDataExata, setErroDataExata] = useState(false);
  const [fase, setFase] = useState("");
  const [enviando, setEnviando] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const dataExataBtnRef = useRef<HTMLButtonElement>(null);

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
    // Trava contra envio repetido: sem ela, dois cliques em sequência muito
    // rápida contariam a mesma pessoa duas vezes nos eventos do Meta.
    if (enviando) return;
    // A data exata vive num campo oculto, que o navegador não valida sozinho:
    // quando esse é o modo escolhido, a checagem do preenchimento é nossa.
    if (dataModo === "exata" && !dataExata) {
      setErroDataExata(true);
      dataExataBtnRef.current?.focus();
      return;
    }
    setEnviando(true);
    // Correspondência avançada: precisa vir antes dos eventos, para que eles
    // já saiam com os dados de contato associados.
    aplicarCorrespondenciaAvancada({ nome, email, telefone });
    const totalConvidados = Number.parseInt(convidados, 10) || 0;
    const ate100 = totalConvidados > 0 && totalConvidados <= LIMITE_CONVIDADOS;

    // Lead de todos os envios.
    dispararLead(CONTENT_NAME_TODOS);
    // Leads dos recortes: até 100 convidados, e até 100 somado à fase.
    if (ate100) {
      dispararLead(CONTENT_NAME_ATE_100);
      const contentNameDaFase = CONTENT_NAME_POR_FASE[fase];
      if (contentNameDaFase) dispararLead(contentNameDaFase);
    }

    empurrarParaGTM("lead_form_lp_contato_submit", {
      form_name: "proposta_lp_contato",
      convidados: totalConvidados,
      fase,
    });
    if (ate100) {
      empurrarParaGTM(GTM_EVENTO_ATE_100, { convidados: totalConvidados, fase });
      const eventoDaFase = GTM_EVENTO_POR_FASE[fase];
      if (eventoDaFase) empurrarParaGTM(eventoDaFase, { convidados: totalConvidados, fase });
    }
    formRef.current?.submit();
    aoEnviar();
  }

  return (
    <section className="mt-6">
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft">
        <div className="p-6 sm:p-8">
          {titulo && (
            <h2 className="font-serif text-2xl text-primary sm:text-3xl">{titulo}</h2>
          )}

          {enviado ? (
            <p className={`rounded-md bg-primary/10 p-4 text-sm text-primary ${titulo ? "mt-6" : ""}`}>
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
              className={`grid gap-4 ${titulo ? "mt-6" : ""}`}
            >
              <input type="hidden" name="data_exata" value={dataExataStr} />
              <input type="hidden" name="origem" value="lp-contato" />
              {/* Mantém a coluna da planilha preenchida: registra que o aviso
                  de LGPD estava na tela no momento do envio. */}
              <input type="hidden" name="consentimento_lgpd" value="sim" />

              {/* A ordem começa pelas perguntas sobre a festa e termina nos
                  dados pessoais. */}
              <Field label="Convidados *">
                <input
                  required
                  id={`${idPrefixo}-convidados`}
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

              <div className="grid gap-4">
                <Field label="Data desejada *">
                  <div className="mb-2 inline-flex rounded-full border border-input p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setDataModo("aproximado");
                        setErroDataExata(false);
                      }}
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
                      <select required name="mes" value={mes} onChange={(e) => setMes(e.target.value)} className={inputCls}>
                        <option value="">Mês</option>
                        {MESES.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                      <select required name="ano" value={ano} onChange={(e) => setAno(e.target.value)} className={inputCls}>
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
                          ref={dataExataBtnRef}
                          type="button"
                          aria-invalid={erroDataExata}
                          className={`${inputCls} flex items-center text-left ${!dataExata ? "text-muted-foreground" : ""} ${
                            erroDataExata ? "border-destructive ring-2 ring-destructive/20" : ""
                          }`}
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
                          onSelect={(d) => {
                            setDataExata(d);
                            if (d) setErroDataExata(false);
                          }}
                          captionLayout="dropdown"
                          startMonth={new Date(2026, 0)}
                          endMonth={new Date(2031, 11)}
                          locale={ptBR}
                          classNames={{ nav: "hidden" }}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                  {erroDataExata && (
                    <p role="alert" className="mt-1.5 text-xs text-destructive">
                      Selecione a data desejada.
                    </p>
                  )}
                </Field>
              </div>

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

              <Field label="Em qual fase do planejamento você está?">
                <select name="fase" value={fase} onChange={(e) => setFase(e.target.value)} className={inputCls}>
                  <option value="">Selecione uma opção</option>
                  <option value="inicial">Estou na fase inicial, apenas pesquisando valores</option>
                  <option value="visitas">Já comecei as visitas, mas continuo pesquisando os locais</option>
                  <option value="ultimas_visitas">Estou fazendo as últimas visitas e pronta para fechar</option>
                </select>
              </Field>

              {/* O botão segue clicável mesmo com campos em branco: assim o
                  clique aciona a validação do navegador, que aponta o
                  primeiro campo pendente em vez de deixar a pessoa sem
                  resposta. O disabled cobre só o intervalo do envio, contra
                  clique duplo. */}
              <button
                type="submit"
                disabled={enviando}
                className="mt-2 w-full rounded-full bg-primary px-6 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/40 disabled:hover:bg-primary/40"
              >
                {enviando ? "Enviando…" : "DAR O PRIMEIRO PASSO"}
              </button>
              <p className="text-center text-xs text-muted-foreground">
                Seus dados são confidenciais. Sem spam.
              </p>
              {/* Aviso de LGPD no lugar de caixa de consentimento: quem envia
                  está pedindo um orçamento, e o contato é a resposta a esse
                  pedido. O aviso informa a finalidade sem colocar mais um
                  passo no caminho de quem preenche. */}
              <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
                Ao enviar, você autoriza o contato do Sítio Canto da Mata e o uso dos seus
                dados para essa finalidade, conforme a <strong>LGPD</strong>.
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
