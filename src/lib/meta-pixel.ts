// Correspondência avançada manual do Pixel da Meta.
//
// O Pixel é inicializado sem dados no carregamento da página, porque em uma
// landing page a pessoa ainda não digitou nada. Quando ela envia o
// formulário, reinicializamos o Pixel com os dados de contato: essa é a
// forma documentada de ligar a correspondência avançada quando os dados só
// existem depois do carregamento. A partir daí os eventos daquela sessão
// saem com a correspondência aplicada.
//
// O hash SHA-256 é feito pelo próprio Pixel no navegador — nada sai em texto
// puro daqui. O que precisa ser feito do nosso lado é a normalização: se o
// valor não chegar no mesmo formato que a Meta usa do outro lado, o hash não
// bate e a correspondência não acontece.
export const META_PIXEL_ID = "1259848206165936";

// Faixa de acentos combinantes (U+0300–U+036F), que sobram depois do
// normalize("NFD") e precisam sair: "José" vira "jose".
const ACENTOS_COMBINANTES = /[̀-ͯ]/g;

function normalizarEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizarTelefone(telefone: string) {
  const digitos = telefone.replace(/\D/g, "");
  if (!digitos) return "";
  // A Meta espera o código do país junto. O formulário aceita no máximo 11
  // dígitos (DDD + número), então qualquer valor até esse tamanho ainda não
  // tem o 55 — checar pelo tamanho, e não pelo prefixo, evita tratar o DDD
  // 55 (Santa Maria/RS) como se já fosse o código do país.
  return digitos.length <= 11 ? `55${digitos}` : digitos;
}

function normalizarNome(parte: string) {
  return parte.trim().toLowerCase().normalize("NFD").replace(ACENTOS_COMBINANTES, "");
}

export function aplicarCorrespondenciaAvancada(dados: {
  nome: string;
  email: string;
  telefone: string;
}) {
  if (typeof window === "undefined") return;
  const fbq = (window as any).fbq;
  if (typeof fbq !== "function") return;

  const partes = dados.nome.trim().split(/\s+/).filter(Boolean);
  const correspondencia: Record<string, string> = {};

  const em = normalizarEmail(dados.email);
  const ph = normalizarTelefone(dados.telefone);
  const fn = partes.length > 0 ? normalizarNome(partes[0]) : "";
  const ln = partes.length > 1 ? normalizarNome(partes[partes.length - 1]) : "";

  if (em) correspondencia.em = em;
  if (ph) correspondencia.ph = ph;
  if (fn) correspondencia.fn = fn;
  if (ln) correspondencia.ln = ln;

  if (Object.keys(correspondencia).length === 0) return;
  fbq("init", META_PIXEL_ID, correspondencia);
}
