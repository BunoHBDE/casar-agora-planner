// Origem de tráfego do lead (UTMs + identificadores de clique de anúncio).
//
// A captura acontece na entrada da pessoa no site e fica guardada na
// localStorage por 30 dias: quem clica no anúncio muitas vezes não preenche
// o formulário na mesma visita — volta dias depois, digitando o endereço ou
// pela busca, e nessa volta a URL já não traz mais nada da campanha.
//
// Regra de sobrescrita: uma URL que traz chaves de origem sempre vence (é um
// clique novo, de uma campanha possivelmente diferente). Uma navegação sem
// chaves nenhuma nunca apaga o que já foi capturado, até o registro vencer.
export const CHAVES = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
] as const;

// Contexto da entrada, gravado junto das chaves para dar leitura à planilha
// quando a origem vem vazia (tráfego direto, orgânico ou indicação).
export const CAMPOS_CONTEXTO = ["pagina_entrada", "referrer"] as const;

export const CAMPOS_ORIGEM = [...CHAVES, ...CAMPOS_CONTEXTO] as const;

export type CampoOrigem = (typeof CAMPOS_ORIGEM)[number];
export type OrigemTrafego = Record<CampoOrigem, string>;

const CHAVE_STORAGE = "origem_trafego";

// Janela de atribuição: 30 dias contados a partir do clique que trouxe as
// chaves, sem renovar a cada visita — senão uma campanha antiga acompanharia
// para sempre quem volta ao site com frequência.
const VALIDADE_DIAS = 30;
const VALIDADE_MS = VALIDADE_DIAS * 24 * 60 * 60 * 1000;

// Carimbo de quando o registro foi gravado. Fica só na storage: não é um dos
// CAMPOS_ORIGEM, então não vira campo oculto nem coluna na planilha.
const CAMPO_CARIMBO = "capturado_em";

function origemVazia(): OrigemTrafego {
  return CAMPOS_ORIGEM.reduce((acc, campo) => {
    acc[campo] = "";
    return acc;
  }, {} as OrigemTrafego);
}

// O acesso à localStorage pode lançar (modo privado, cookies de terceiros
// bloqueados, iframe sem permissão). Nesse caso o formulário continua
// funcionando: os campos de origem apenas saem vazios.
//
// Um registro vencido conta como inexistente: é descartado na leitura e a
// próxima visita grava um no lugar.
function lerRegistro(): OrigemTrafego | null {
  try {
    const bruto = window.localStorage.getItem(CHAVE_STORAGE);
    if (!bruto) return null;
    const dados: unknown = JSON.parse(bruto);
    if (!dados || typeof dados !== "object") return null;
    const salvo = dados as Record<string, unknown>;

    // Sem carimbo válido não dá para saber a idade do registro — descartar é
    // mais seguro do que carregar uma campanha de origem desconhecida.
    const capturadoEm = salvo[CAMPO_CARIMBO];
    if (typeof capturadoEm !== "number" || !Number.isFinite(capturadoEm)) return null;
    if (Date.now() - capturadoEm > VALIDADE_MS) return null;

    const registro = origemVazia();
    for (const campo of CAMPOS_ORIGEM) {
      const valor = salvo[campo];
      registro[campo] = typeof valor === "string" ? valor : "";
    }
    return registro;
  } catch {
    return null;
  }
}

function gravarRegistro(registro: OrigemTrafego) {
  try {
    const comCarimbo = { ...registro, [CAMPO_CARIMBO]: Date.now() };
    window.localStorage.setItem(CHAVE_STORAGE, JSON.stringify(comCarimbo));
  } catch {
    // Sem storage disponível não há o que fazer além de seguir em frente.
  }
}

function registroDaUrl(params: URLSearchParams): OrigemTrafego {
  const registro = origemVazia();
  for (const chave of CHAVES) {
    registro[chave] = (params.get(chave) ?? "").trim();
  }
  registro.pagina_entrada = window.location.pathname;
  registro.referrer = document.referrer;
  return registro;
}

// Idempotente: chamar várias vezes no mesmo carregamento (o componente dos
// campos e o root chamam) não muda o resultado.
export function capturarOrigem(): void {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  // Uma chave presente mas vazia (?utm_source=) não carrega informação —
  // tratá-la como ausente evita apagar um registro bom com valores em branco.
  const temChave = CHAVES.some((chave) => (params.get(chave) ?? "").trim() !== "");

  // Sem chaves na URL e com registro dentro da validade: preserva o que foi
  // capturado no clique, que é justamente o ponto de guardar isso.
  if (!temChave && lerRegistro()) return;

  gravarRegistro(registroDaUrl(params));
}

export function lerOrigem(): OrigemTrafego {
  if (typeof window === "undefined") return origemVazia();
  return lerRegistro() ?? origemVazia();
}
