import { createLazyFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";

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

// Eventos de segmentação disparados no envio do formulário, além do Lead:
// servem para a campanha do Meta otimizar por perfil de lead. Todos exigem
// até 100 convidados; os três últimos somam a fase do planejamento.
// No Meta são eventos personalizados (trackCustom) e no GTM, eventos
// personalizados de mesmo nome em snake_case.
const PIXEL_ATE_100 = { meta: "Lead100Convidados", gtm: "lead_100_convidados" };
const PIXEIS_POR_FASE: Record<string, { meta: string; gtm: string }> = {
  inicial: { meta: "Lead100ConvidadosFaseInicial", gtm: "lead_100_convidados_fase_inicial" },
  visitas: { meta: "Lead100ConvidadosFaseVisitas", gtm: "lead_100_convidados_fase_visitas" },
  ultimas_visitas: {
    meta: "Lead100ConvidadosFaseUltimasVisitas",
    gtm: "lead_100_convidados_fase_ultimas_visitas",
  },
};
const LIMITE_CONVIDADOS = 100;

function dispararPixel(
  pixel: { meta: string; gtm: string },
  dados: { convidados: number; fase: string }
) {
  if (typeof window === "undefined") return;
  if (typeof (window as any).fbq === "function") {
    (window as any).fbq("trackCustom", pixel.meta, dados);
  }
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({ event: pixel.gtm, ...dados });
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

// Página de campanha enxuta: só o formulário, sem menu, seções ou links que
// levem a pessoa para fora antes de deixar os dados.
function LandingContato() {
  return (
    <main className="flex min-h-screen flex-col bg-secondary/30 text-foreground">
      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-14">
        <div className="w-full max-w-xl">
          <p className="text-center text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
            Sítio Canto da Mata
          </p>
          <Contato />
        </div>
      </div>
      <footer className="border-t border-border/60 bg-background">
        <div className="mx-auto max-w-xl px-6 py-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Sítio Canto da Mata
        </div>
      </footer>
    </main>
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
  const [erroDataExata, setErroDataExata] = useState(false);
  const [fase, setFase] = useState("");
  const [enviado, setEnviado] = useState(false);
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
    // A data exata vive num campo oculto, que o navegador não valida sozinho:
    // quando esse é o modo escolhido, a checagem do preenchimento é nossa.
    if (dataModo === "exata" && !dataExata) {
      setErroDataExata(true);
      dataExataBtnRef.current?.focus();
      return;
    }
    // content_name diferencia este Lead dos formulários da home (/) e da
    // planilha (/lp, /lp2) nas Conversões Personalizadas do Meta.
    if (typeof window !== "undefined" && typeof (window as any).fbq === "function") {
      (window as any).fbq("track", "Lead", { content_name: "formulario_proposta_lp_contato" });
    }
    if (typeof window !== "undefined") {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({ event: "lead_form_lp_contato_submit", form_name: "proposta_lp_contato" });
    }
    // Eventos de segmentação por porte da festa e fase do planejamento.
    const totalConvidados = Number.parseInt(convidados, 10);
    if (totalConvidados > 0 && totalConvidados <= LIMITE_CONVIDADOS) {
      const dados = { convidados: totalConvidados, fase };
      dispararPixel(PIXEL_ATE_100, dados);
      const pixelDaFase = PIXEIS_POR_FASE[fase];
      if (pixelDaFase) dispararPixel(pixelDaFase, dados);
    }
    formRef.current?.submit();
    setEnviado(true);
  }

  return (
    <section id="contato" className="mt-4">
      <iframe name="proposta-sink" title="proposta-sink" style={{ display: "none" }} />

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft">
        <div className="p-6 sm:p-8">
          <h1 className="font-serif text-2xl text-primary sm:text-3xl">
            Conheça o Sítio Canto da Mata
          </h1>
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
                <Field label="Convidados *">
                  <input
                    required
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
