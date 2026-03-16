/**
 * script.js
 * Versão offline corrigida
 */

/* ======== Configuração ======== */

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
let tipoAtual = 'moradia'

/* ======== Inicialização ======== */

function inicializar() {

  if (selectSelo) {
    SELOS_ESG.forEach(s => {
      const opt = document.createElement('option')
      opt.value = s.valor
      opt.textContent = `${s.icone} ${s.valor}`
      selectSelo.appendChild(opt)
    })
  }

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

/* ======== Dados Offline ======== */

function carregarAnuncios(tipo) {

  tipoAtual = tipo

  anunciosCache = [

    {
      titulo: "Carona diária para IFSP",
      descricao: "Saída do centro de Jacareí às 7h e retorno às 18h. Divisão de combustível.",
      contato_nome: "Mariana Lima",
      contato_telefone: "(12) 98888-2222",
      endereco: "Centro - Jacareí",
      preco: 150,
      periodo: "/mês",
      tipo: "transporte",
      selo_esg: "Eco-Friendly"
    },

    {
      titulo: "Estágio em desenvolvimento web",
      descricao: "Empresa de tecnologia em Jacareí procurando estagiário em programação.",
      contato_nome: "Tech Solutions",
      contato_email: "rh@techsolutions.com",
      tipo: "empregos",
      link_externo: "https://example.com/vaga",
      selo_esg: "Certificado de Competência ESG"
    },

    {
      titulo: "Kitnet simples",
      descricao: "Kitnet pequena para estudante.",
      contato_nome: "João",
      preco: 300,
      periodo: "/mês",
      tipo: "moradia"
    },

    {
      titulo: "Quarto para estudante perto do IFSP",
      descricao: "Quarto mobiliado em república a 10 minutos do campus.",
      contato_nome: "Carlos Souza",
      contato_email: "carlos@email.com",
      contato_telefone: "(12) 99999-0000",
      endereco: "Jardim Flórida - Jacareí",
      preco: 650,
      periodo: "/mês",
      tipo: "moradia",
      selo_esg: "Habitação Consciente"
    }

  ]

  aplicarFiltros()
}

/* ======== Filtros ======== */

function aplicarFiltros() {

  const precoMax = sliderPreco ? parseInt(sliderPreco.value) : 999999
  const seloFiltro = selectSelo ? selectSelo.value : ""

  const filtrados = anunciosCache.filter(a => {

    const tipoOk = a.tipo === tipoAtual
    const precoOk = !a.preco || a.preco <= precoMax
    const seloOk = !seloFiltro || a.selo_esg === seloFiltro

    return tipoOk && precoOk && seloOk
  })

  renderizarCards(filtrados)
}

/* ======== Renderização ======== */
const BENEFICIOS_FALLBACK = [
  {
    nome: 'Programa de Auxílio Permanência (PAP)',
    descricao: 'Auxílio financeiro mensal para estudantes em vulnerabilidade socioeconômica.',
    requisitos: ['Estar regularmente matriculado no IFSP', 'Comprovar vulnerabilidade socioeconômica'],
    como_solicitar: 'Ficar atento aos editais no site do IFSP.',
    contato: 'Coordenadoria Sociopedagógica — csp.jcr@ifsp.edu.br'
  },
  {
    nome: 'Programa de Auxílio Permanência (PAP)',
    descricao: 'Auxílio financeiro mensal para estudantes em vulnerabilidade socioeconômica.',
    requisitos: ['Estar regularmente matriculado no IFSP', 'Comprovar vulnerabilidade socioeconômica'],
    como_solicitar: 'Ficar atento aos editais no site do IFSP.',
    contato: 'Coordenadoria Sociopedagógica — csp.jcr@ifsp.edu.br'
  },
  {
    nome: 'Programa de Auxílio Permanência (PAP)',
    descricao: 'Auxílio financeiro mensal para estudantes em vulnerabilidade socioeconômica.',
    requisitos: ['Estar regularmente matriculado no IFSP', 'Comprovar vulnerabilidade socioeconômica'],
    como_solicitar: 'Ficar atento aos editais no site do IFSP.',
    contato: 'Coordenadoria Sociopedagógica — csp.jcr@ifsp.edu.br'
  }
]

function renderizarCards(anuncios) {

  if (!containerCards) return

  containerCards.innerHTML = ''

  if (anuncios.length === 0) {
    semResultados.hidden = false
    return
  }

  semResultados.hidden = true

  anuncios.forEach(anuncio => {

    const card = document.createElement('article')
    card.className = 'card'

    const precoHTML = anuncio.preco
      ? `<span class="card-preco">R$ ${Number(anuncio.preco).toLocaleString('pt-BR')}${anuncio.periodo || ''}</span>`
      : ''

    const linkHTML = anuncio.link_externo
      ? `<a href="${anuncio.link_externo}" target="_blank" class="card-link-externo">Ver vaga</a>`
      : ''

    const seloHTML = anuncio.selo_esg
      ? `<span class="badge-esg">${anuncio.selo_esg}</span>`
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

        ${anuncio.endereco ? `<p style="font-size:0.8rem;color:#888">${anuncio.endereco}</p>` : ''}

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

/* ======== Navegação ======== */

function navegarPara(secao) {

  botoesNav.forEach(btn =>
    btn.classList.toggle('active', btn.dataset.secao === secao)
  )

  const secoesAnuncio = ['moradia','transporte','empregos']
  const ehAnuncio = secoesAnuncio.includes(secao)

  document.getElementById('secaoAnuncios').hidden = !ehAnuncio
  document.getElementById('secaoBeneficios').hidden = secao !== 'beneficios'
  document.getElementById('secaoCampus').hidden = secao !== 'campus'

  areaFiltros.hidden = !ehAnuncio

  if (ehAnuncio) carregarAnuncios(secao)

  navPrincipal.classList.remove('aberta')
}

/* ======== Formulário ======== */

function enviarAnuncio(evento) {

  evento.preventDefault()

  alert("Anúncio enviado (modo demonstração)")

  formularioAnuncio.reset()
  formularioAnuncio.hidden = true
  mensagemSucesso.hidden = false
}

/* ======== Eventos ======== */

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navPrincipal.classList.toggle('aberta')
  })
}

botoesNav.forEach(btn => {
  btn.addEventListener('click', () => navegarPara(btn.dataset.secao))
})

if (sliderPreco) {
  sliderPreco.addEventListener('input', () => {
    valorPreco.textContent =
      `R$ ${parseInt(sliderPreco.value).toLocaleString('pt-BR')}`
    aplicarFiltros()
  })
}

if (selectSelo) {
  selectSelo.addEventListener('change', aplicarFiltros)
}

if (btnAbrirFormulario) {
  btnAbrirFormulario.addEventListener('click', () => {
    modalFormulario.hidden = false
  })
}

if (btnFecharModal) {
  btnFecharModal.addEventListener('click', () => {
    modalFormulario.hidden = true
  })
}

if (modalFormulario) {
  modalFormulario.addEventListener('click', (e) => {
    if (e.target === modalFormulario) modalFormulario.hidden = true
  })
}

if (formularioAnuncio) {
  formularioAnuncio.addEventListener('submit', enviarAnuncio)
}

/* ======== Start ======== */

inicializar()