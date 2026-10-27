// Eventos de Lead dos formulários de proposta (home e páginas de cidade), no
// mesmo modelo da /lp-contato: um Lead para todos os envios e um Lead para
// cada recorte (até 100 convidados, até 100 somado à fase, lead quente).
//
// Cada página tem os seus próprios nomes, para que as Conversões
// Personalizadas do Meta e os gatilhos do GTM separem a origem do lead.
// Ex.: pagina "home" → Meta "formulario_proposta_home_lead_quente" e
// GTM "lead_quente_home".

const LIMITE_CONVIDADOS = 100;
const FASES = new Set(["inicial", "visitas", "ultimas_visitas"]);
// Lead quente: até 100 convidados e já na fase de visitas ou de últimas visitas.
const FASES_LEAD_QUENTE = new Set(["visitas", "ultimas_visitas"]);

function dispararLead(contentName: string) {
  if (typeof window === "undefined") return;
  if (typeof (window as any).fbq !== "function") return;
  (window as any).fbq("track", "Lead", { content_name: contentName });
}

function empurrarParaGTM(evento: string, dados: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({ event: evento, ...dados });
}

export function dispararLeadsDaProposta(dados: {
  pagina: string;
  convidados: string;
  fase: string;
}) {
  const { pagina, fase } = dados;
  const totalConvidados = Number.parseInt(dados.convidados, 10) || 0;
  const ate100 = totalConvidados > 0 && totalConvidados <= LIMITE_CONVIDADOS;
  const leadQuente = ate100 && FASES_LEAD_QUENTE.has(fase);

  const contentName = `formulario_proposta_${pagina}`;
  dispararLead(contentName);
  if (ate100) {
    dispararLead(`${contentName}_ate_100`);
    if (FASES.has(fase)) dispararLead(`${contentName}_ate_100_${fase}`);
  }
  if (leadQuente) dispararLead(`${contentName}_lead_quente`);

  const extras = { convidados: totalConvidados, fase };
  empurrarParaGTM(`lead_form_${pagina}_submit`, { form_name: `proposta_${pagina}`, ...extras });
  if (ate100) {
    empurrarParaGTM(`lead_100_convidados_${pagina}`, extras);
    if (FASES.has(fase)) empurrarParaGTM(`lead_100_convidados_fase_${fase}_${pagina}`, extras);
  }
  if (leadQuente) empurrarParaGTM(`lead_quente_${pagina}`, extras);
}
