// Origem de tráfego do lead (UTMs + identificadores de clique de anúncio).
//
// A captura acontece na entrada da pessoa no site e fica guardada na
// sessionStorage: quem chega por um anúncio pode navegar por várias páginas
// antes de preencher o formulário, e sem esse registro a informação de
// campanha se perderia no caminho.
//
// Regra de sobrescrita: uma URL que traz chaves de origem sempre vence (é um
// clique novo, de uma campanha possivelmente diferente). Uma navegação sem
// chaves nenhuma nunca apaga o que já foi capturado.
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

function origemVazia(): OrigemTrafego {
  return CAMPOS_ORIGEM.reduce((acc, campo) => {
    acc[campo] = "";
    return acc;
  }, {} as OrigemTrafego);
}

// O acesso à sessionStorage pode lançar (modo privado, cookies de terceiros
// bloqueados, iframe sem permissão). Nesse caso o formulário continua
// funcionando: os campos de origem apenas saem vazios.
function lerRegistro(): OrigemTrafego | null {
  try {
    const bruto = window.sessionStorage.getItem(CHAVE_STORAGE);
    if (!bruto) return null;
    const dados: unknown = JSON.parse(bruto);
    if (!dados || typeof dados !== "object") return null;
    const registro = origemVazia();
    for (const campo of CAMPOS_ORIGEM) {
      const valor = (dados as Record<string, unknown>)[campo];
      registro[campo] = typeof valor === "string" ? valor : "";
    }
    return registro;
  } catch {
    return null;
  }
}

function gravarRegistro(registro: OrigemTrafego) {
  try {
    window.sessionStorage.setItem(CHAVE_STORAGE, JSON.stringify(registro));
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

  // Sem chaves na URL e com registro já salvo: preserva o que foi capturado
  // na entrada, que é justamente o ponto de guardar na sessão.
  if (!temChave && lerRegistro()) return;

  gravarRegistro(registroDaUrl(params));
}

export function lerOrigem(): OrigemTrafego {
  if (typeof window === "undefined") return origemVazia();
  return lerRegistro() ?? origemVazia();
}
