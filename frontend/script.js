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

const campoTipo = document.getElementById("campoTipo")
const campoLinkWrapper = document.getElementById("campoLinkExternoWrapper")
const campoImagensWrapper = document.getElementById("campoImagensWrapper")
const campoImagens = document.getElementById("campoImagens")
const infoImagens = document.getElementById("infoImagens")

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

async function carregarAnuncios(tipo) {

  tipoAtual = tipo

  try {

    const resposta = await fetch('http://localhost/faculdade/backend/listar_anuncios.php')
    const dados = await resposta.json()

    // 🔥 Converter dados do banco para formato do frontend
    anunciosCache = dados.map(a => ({

      titulo: a.titulo,
      descricao: a.descricao,
      contato_nome: a.contato_nome,
      contato_telefone: a.telefone,
      preco: a.preco,
      periodo: a.periodo,
      tipo: mapTipo(a.tipo)

    }))

    aplicarFiltros()

  } catch (erro) {
    console.error("Erro ao carregar anúncios:", erro)
  }
}

function mapTipo(tipo) {
  if (tipo.toLowerCase() === "moradia") return "moradia"
  if (tipo.toLowerCase() === "transporte") return "transporte"
  if (tipo.toLowerCase() === "emprego") return "empregos"
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

async function enviarAnuncio(evento) {

  evento.preventDefault()

  const formData = new FormData(formularioAnuncio)

  try {

    const resposta = await fetch('http://localhost/faculdade/backend/salvar_anuncio.php', {
      method: 'POST',
      body: formData
    })

    const resultado = await resposta.json()

    if (resultado.sucesso) {

      formularioAnuncio.reset()
      formularioAnuncio.hidden = true
      mensagemSucesso.hidden = false

    } else {
      alert("Erro: " + (resultado.erro || "desconhecido"))
    }

  } catch (erro) {
    console.error(erro)
    alert("Erro na conexão com o servidor")
  }
}

if (campoTipo) {

  campoTipo.addEventListener("change", () => {

    const tipo = campoTipo.value

    // reset
    campoImagens.value = ""

    if (tipo === "EMPREGO") {

      // 👉 emprego
      campoLinkWrapper.hidden = false
      campoImagensWrapper.hidden = false

      campoImagens.multiple = false
      infoImagens.textContent = "Apenas 1 imagem permitida"

    } else if (tipo === "MORADIA" || tipo === "TRANSPORTE") {

      // 👉 moradia e transporte
      campoLinkWrapper.hidden = true
      campoImagensWrapper.hidden = false

      campoImagens.multiple = true
      infoImagens.textContent = "Você pode enviar até 5 imagens"

    } else {

      campoLinkWrapper.hidden = true
      campoImagensWrapper.hidden = true

    }

  })
}

if (campoImagens) {
  campoImagens.addEventListener("change", () => {

    const tipo = campoTipo.value

    if (tipo === "EMPREGO" && campoImagens.files.length > 1) {
      alert("Emprego permite apenas 1 imagem")
      campoImagens.value = ""
    }

    if ((tipo === "MORADIA" || tipo === "TRANSPORTE") && campoImagens.files.length > 5) {
      alert("Máximo de 5 imagens")
      campoImagens.value = ""
    }

  })
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