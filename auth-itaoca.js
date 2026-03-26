const ITAOCA_AUTH_KEY = 'itaocaAuthSessionV1';
const ITAOCA_PAYLOAD_KEY = 'itaocaQuantPayloadV2';

const ITAOCA_USERS = [
  { nome: 'Kesler Borges', login: 'kesler', senha: 'mudar123' },
  { nome: 'Teresa Serraceni', login: 'teresa', senha: 'mudar123' },
  { nome: 'Tatiana Cazarim', login: 'tatiana', senha: 'mudar123' }
];

function normalizarTextoAuth(valor = '') {
  return String(valor).trim().toLowerCase().replace(/\s+/g, ' ');
}

function autenticarItaoca(login, senha) {
  const usuario = ITAOCA_USERS.find(item =>
    normalizarTextoAuth(item.login) === normalizarTextoAuth(login) &&
    String(item.senha) === String(senha)
  );

  if (!usuario) return null;

  const sessao = {
    nome: usuario.nome,
    login: usuario.login,
    iniciadoEm: new Date().toISOString()
  };

  sessionStorage.setItem(ITAOCA_AUTH_KEY, JSON.stringify(sessao));
  return sessao;
}

function obterSessaoItaoca() {
  try {
    return JSON.parse(sessionStorage.getItem(ITAOCA_AUTH_KEY) || 'null');
  } catch (err) {
    return null;
  }
}

function estaAutenticadoItaoca() {
  const sessao = obterSessaoItaoca();
  return !!(sessao && sessao.nome && sessao.login);
}

function preencherUsuarioLogado(ids = []) {
  const sessao = obterSessaoItaoca();
  const nome = sessao?.nome || '';
  const lista = Array.isArray(ids) ? ids : [ids];

  lista.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = nome;
  });
}

function nomePaginaAtual() {
  const partes = window.location.pathname.split('/');
  return partes[partes.length - 1] || 'index.html';
}

function exigirLoginItaoca() {
  if (estaAutenticadoItaoca()) return true;

  const next = encodeURIComponent(nomePaginaAtual() + window.location.search + window.location.hash);
  window.location.href = `login.html?next=${next}`;
  return false;
}

function sairItaoca(destino = 'login.html') {
  sessionStorage.removeItem(ITAOCA_AUTH_KEY);
  sessionStorage.removeItem(ITAOCA_PAYLOAD_KEY);
  window.location.href = destino;
}