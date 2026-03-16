/**
 * @file script.js
 * @description Lógica principal do frontend Fala Calourada.
 *
 * Gerencia navegação entre seções, consumo da API, renderização de cards,
 * filtros, formulário de envio, benefícios e guia do campus.
 *
 * IMPORTANTE: A plataforma é exclusivamente informativa.
 * Não há intermediação, negociação ou candidatura interna.
 */

/* ======== Configuração ======== */

/** URL base da API */
const API_URL = window.location.origin

/** Selos ESG disponíveis (fixos — apenas visibilidade) */
const SELOS_ESG = [
  { valor: 'Habitação Consciente', icone: '🏡' },
  { valor: 'Eco-Friendly', icone: '🌿' },
  { valor: 'Certificado de Competência ESG', icone: '🏆' }
]

/* ======== Referências ao DOM ======== */
const containerCards = document.getElementById('containerCards')
const semResultados = document.getElementById('semResultados')
const sliderPreco = document.getElementById('sliderPreco')
const valorPreco = document.getElementById('valorPreco')
const selectSelo = document.getElementById('selectSelo')
const areaFiltros = document.getElementById('areaFiltros')
const menuToggle = document.querySelector('.menu-toggle')
const navPrincipal = document.querySelector('.nav-principal')
const botoesNav = document.querySelectorAll('.nav-btn')
const btnAbrirFormulario = document.getElementById('btnAbrirFormulario')
const modalFormulario = document.getElementById('modalFormulario')
const btnFecharModal = document.getElementById('btnFecharModal')
const formularioAnuncio = document.getElementById('formularioAnuncio')
const mensagemSucesso = document.getElementById('mensagemSucesso')

/* ======== Estado ======== */
let anunciosCache = []

/* ======== Inicialização ======== */

function inicializar() {
  // Popula o select de filtro ESG
  SELOS_ESG.forEach(s => {
    const opt = document.createElement('option')
    opt.value = s.valor
    opt.textContent = `${s.icone} ${s.valor}`
    selectSelo.appendChild(opt)
  })

  // Popula o select de selo no formulário
  const selectSeloForm = document.getElementById('campoSeloEsg')
  if (selectSeloForm) {
    SELOS_ESG.forEach(s => {
      const opt = document.createElement('option')
      opt.value = s.valor
      opt.textContent = `${s.icone} ${s.valor}`
      selectSeloForm.appendChild(opt)
    })
  }

  carregarAnuncios('moradia')
}

/* ======== API ======== */

/**
 * Faz GET na API e retorna os dados.
 * @param {string} caminho - Ex: '/api/moradia'
 * @returns {Promise<Array>}
 */
async function buscarDaAPI(caminho) {
  try {
    const resp = await fetch(API_URL + caminho)
    const json = await resp.json()
    return json.sucesso ? json.dados : []
  } catch (erro) {
    console.error('Erro de conexão:', erro)
    return []
  }
}

/**
 * Carrega anúncios de um tipo e renderiza.
 * @param {string} tipo - 'moradia', 'transporte' ou 'empregos'
 */
async function carregarAnuncios(tipo) {
  anunciosCache = await buscarDaAPI(`/api/${tipo}`)
  aplicarFiltros()
}

/* ======== Filtros e Renderização ======== */

/** Aplica filtros de preço e selo sobre o cache e renderiza. */
function aplicarFiltros() {
  const precoMax = parseInt(sliderPreco.value)
  const seloFiltro = selectSelo.value

  const filtrados = anunciosCache.filter(a => {
    const precoOk = !a.preco || a.preco <= precoMax
    const seloOk = !seloFiltro || a.selo_esg === seloFiltro
    return precoOk && seloOk
  })

  renderizarCards(filtrados)
}

/**
 * Renderiza lista de anúncios como cards.
 * @param {Array} anuncios
 */
function renderizarCards(anuncios) {
  containerCards.innerHTML = ''

  if (anuncios.length === 0) {
    semResultados.hidden = false
    return
  }
  semResultados.hidden = true

  anuncios.forEach(anuncio => {
    const card = document.createElement('article')
    card.className = 'card'

    // Badge ESG (se houver)
    const seloInfo = anuncio.selo_esg ? SELOS_ESG.find(s => s.valor === anuncio.selo_esg) : null
    const seloHTML = seloInfo
      ? `<div class="card-selos"><span class="badge-esg">${seloInfo.icone} ${anuncio.selo_esg}</span></div>`
      : ''

    // Link externo (empregos)
    const linkHTML = anuncio.link_externo
      ? `<a href="${anuncio.link_externo}" target="_blank" rel="noopener noreferrer" class="card-link-externo">Ver vaga externa</a>`
      : ''

    // Preço
    const precoHTML = anuncio.preco
      ? `<span class="card-preco">R$ ${Number(anuncio.preco).toLocaleString('pt-BR')}${anuncio.periodo || ''}</span>`
      : ''

    card.innerHTML = `
      <div class="card-conteudo">
        <div class="card-cabecalho">
          <h3>${anuncio.titulo}</h3>
          ${precoHTML}
        </div>
        <span class="card-tipo">${anuncio.tipo}</span>
        ${seloHTML}
        <p class="card-descricao">${anuncio.descricao}</p>
        ${anuncio.endereco ? `<p class="card-descricao" style="font-size:0.8rem;color:#888">${anuncio.endereco}</p>` : ''}
        ${linkHTML}
        <div class="card-contato">
          <p><strong>${anuncio.contato_nome}</strong></p>
          ${anuncio.contato_email ? `<p>${anuncio.contato_email}</p>` : ''}
          ${anuncio.contato_telefone ? `<p>${anuncio.contato_telefone}</p>` : ''}
        </div>
      </div>
    `

    containerCards.appendChild(card)
  })
}

/* ======== Benefícios Sociais ======== */

/** Fallback offline para benefícios */
const BENEFICIOS_FALLBACK = [
  {
    nome: 'Programa de Auxílio Permanência (PAP)',
    descricao: 'Auxílio financeiro mensal para estudantes em vulnerabilidade socioeconômica.',
    requisitos: ['Estar regularmente matriculado no IFSP', 'Comprovar vulnerabilidade socioeconômica'],
    como_solicitar: 'Ficar atento aos editais no site do IFSP.',
    contato: 'Coordenadoria Sociopedagógica — csp.jcr@ifsp.edu.br'
  }
]

async function carregarBeneficios() {
  let beneficios = await buscarDaAPI('/api/beneficios')
  if (beneficios.length === 0) beneficios = BENEFICIOS_FALLBACK

  const lista = document.getElementById('listaBeneficios')
  lista.innerHTML = ''

  beneficios.forEach(b => {
    const card = document.createElement('div')
    card.className = 'beneficio-card'
    const reqHTML = b.requisitos && b.requisitos.length
      ? '<ul>' + b.requisitos.map(r => `<li>${r}</li>`).join('') + '</ul>'
      : ''
    card.innerHTML = `
      <h3>${b.nome}</h3>
      <p>${b.descricao}</p>
      ${reqHTML}
      ${b.como_solicitar ? `<p><strong>Como solicitar:</strong> ${b.como_solicitar}</p>` : ''}
      ${b.contato ? `<p class="beneficio-contato">${b.contato}</p>` : ''}
    `
    lista.appendChild(card)
  })
}

/* ======== Guia do Campus ======== */

async function carregarCampus() {
  const setores = await buscarDaAPI('/api/campus')
  const lista = document.getElementById('listaSetores')
  lista.innerHTML = ''

  setores.forEach(setor => {
    const item = document.createElement('div')
    item.className = 'setor-item'
    item.innerHTML = `
      <div class="setor-cabecalho">
        <span>${setor.nome}</span>
        <span class="setor-seta">&#9660;</span>
      </div>
      <div class="setor-detalhe">
        ${setor.descricao ? `<p>${setor.descricao}</p>` : ''}
        ${setor.telefone ? `<p class="setor-info">Telefone: ${setor.telefone}</p>` : ''}
        ${setor.email ? `<p class="setor-info">E-mail: ${setor.email}</p>` : ''}
        ${setor.localizacao ? `<p class="setor-info">Local: ${setor.localizacao}</p>` : ''}
      </div>
    `
    item.querySelector('.setor-cabecalho').addEventListener('click', () => {
      item.classList.toggle('aberto')
    })
    lista.appendChild(item)
  })
}

/* ======== Navegação ======== */

function navegarPara(secao) {
  botoesNav.forEach(btn => btn.classList.toggle('active', btn.dataset.secao === secao))

  const secoesAnuncio = ['moradia', 'transporte', 'empregos']
  const ehAnuncio = secoesAnuncio.includes(secao)

  document.getElementById('secaoAnuncios').hidden = !ehAnuncio
  document.getElementById('secaoBeneficios').hidden = secao !== 'beneficios'
  document.getElementById('secaoCampus').hidden = secao !== 'campus'
  areaFiltros.hidden = !ehAnuncio

  if (ehAnuncio) carregarAnuncios(secao)
  else if (secao === 'beneficios') carregarBeneficios()
  else if (secao === 'campus') carregarCampus()

  // Fecha menu mobile
  navPrincipal.classList.remove('aberta')
  menuToggle.classList.remove('aberto')
  menuToggle.setAttribute('aria-expanded', 'false')
}

/* ======== Formulário de Envio ======== */

async function enviarAnuncio(evento) {
  evento.preventDefault()
  const form = evento.target
  const botao = form.querySelector('.btn-submit')
  botao.disabled = true
  botao.textContent = 'Enviando...'

  const dados = {
    titulo: form.titulo.value,
    descricao: form.descricao.value,
    contato_nome: form.contato_nome.value,
    contato_email: form.contato_email.value || null,
    contato_telefone: form.contato_telefone.value || null,
    endereco: form.endereco.value || null,
    preco: form.preco.value ? parseFloat(form.preco.value) : null,
    periodo: form.periodo.value || null,
    tipo: form.tipo.value,
    link_externo: form.link_externo.value || null,
    selo_esg: form.selo_esg.value || null
  }

  try {
    const resp = await fetch(API_URL + '/api/anuncios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    })
    const json = await resp.json()
    if (json.sucesso) {
      form.hidden = true
      mensagemSucesso.hidden = false
    } else {
      alert('Erro ao enviar: ' + (json.erros ? json.erros.join('\n') : json.erro))
    }
  } catch (erro) {
    alert('Erro de conexão. Verifique se o servidor está rodando.')
  } finally {
    botao.disabled = false
    botao.textContent = 'Enviar Anúncio'
  }
}

/* ======== Event Listeners ======== */

menuToggle.addEventListener('click', () => {
  const aberto = navPrincipal.classList.toggle('aberta')
  menuToggle.classList.toggle('aberto')
  menuToggle.setAttribute('aria-expanded', String(aberto))
})

botoesNav.forEach(btn => {
  btn.addEventListener('click', () => navegarPara(btn.dataset.secao))
})

sliderPreco.addEventListener('input', () => {
  valorPreco.textContent = `R$ ${parseInt(sliderPreco.value).toLocaleString('pt-BR')}`
  aplicarFiltros()
})

selectSelo.addEventListener('change', aplicarFiltros)

btnAbrirFormulario.addEventListener('click', () => {
  modalFormulario.hidden = false
  formularioAnuncio.hidden = false
  mensagemSucesso.hidden = true
  formularioAnuncio.reset()
})

btnFecharModal.addEventListener('click', () => { modalFormulario.hidden = true })

modalFormulario.addEventListener('click', (e) => {
  if (e.target === modalFormulario) modalFormulario.hidden = true
})

formularioAnuncio.addEventListener('submit', enviarAnuncio)

/* ======== Início ======== */
inicializar()
