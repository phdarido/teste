/**
 * @file script.js
 * @description Lógica principal do frontend Fala Calourada.
 *
 * Este arquivo gerencia:
 * - Navegação entre seções (SPA-like)
 * - Consumo da API backend via fetch()
 * - Renderização de cards com badges ESG
 * - Filtros de preço e selo
 * - Formulário de envio de anúncio
 * - Seções de Benefícios e Campus
 * - Menu mobile (hambúrguer)
 *
 * IMPORTANTE: A plataforma é exclusivamente informativa.
 * Não há intermediação, negociação ou candidatura interna.
 */

/* ======== Configuração ======== */

/** URL base da API — alterar se o backend estiver em outro endereço */
const API_URL = window.location.origin

/* ======== Referências aos elementos do DOM ======== */
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
const checkboxesSelos = document.getElementById('checkboxesSelos')

/* ======== Estado da aplicação ======== */
let secaoAtual = 'moradia'
let anunciosCache = []
let selosDisponiveis = []

/* ======== Inicialização ======== */

/**
 * Inicializa a aplicação: carrega selos e conteúdo da primeira aba.
 */
async function inicializar() {
  await carregarSelos()
  await carregarAnuncios('moradia')
}

/* ======== API — Funções de comunicação com o backend ======== */

/**
 * Faz uma requisição GET à API e retorna os dados.
 * @param {string} caminho - Caminho do endpoint (ex: '/api/moradia')
 * @returns {Promise<Array>} Dados retornados pela API
 */
async function buscarDaAPI(caminho) {
  try {
    const resposta = await fetch(API_URL + caminho)
    const json = await resposta.json()
    if (json.sucesso) {
      return json.dados
    }
    console.error('Erro da API:', json.erro)
    return []
  } catch (erro) {
    console.error('Erro de conexão com a API:', erro)
    return []
  }
}

/**
 * Carrega a lista de selos ESG disponíveis e popula o select e checkboxes.
 */
async function carregarSelos() {
  selosDisponiveis = await buscarDaAPI('/api/selos')

  // Popula o select de filtro
  selectSelo.innerHTML = '<option value="">Todos</option>'
  selosDisponiveis.forEach(selo => {
    const option = document.createElement('option')
    option.value = selo.nome
    option.textContent = `${selo.icone} ${selo.nome}`
    selectSelo.appendChild(option)
  })

  // Popula os checkboxes no formulário
  checkboxesSelos.innerHTML = ''
  selosDisponiveis.forEach(selo => {
    const label = document.createElement('label')
    label.innerHTML = `
      <input type="checkbox" name="selos_ids" value="${selo.id}">
      ${selo.icone} ${selo.nome}
    `
    checkboxesSelos.appendChild(label)
  })
}

/**
 * Carrega anúncios de um tipo específico e renderiza os cards.
 * @param {string} tipo - Tipo de anúncio ('moradia', 'transporte', 'empregos')
 */
async function carregarAnuncios(tipo) {
  anunciosCache = await buscarDaAPI(`/api/${tipo}`)
  aplicarFiltros()
}

/* ======== Renderização de Cards ======== */

/**
 * Aplica filtros de preço e selo sobre os anúncios em cache e renderiza.
 */
function aplicarFiltros() {
  const precoMax = parseInt(sliderPreco.value)
  const seloFiltro = selectSelo.value

  const filtrados = anunciosCache.filter(anuncio => {
    const precoOk = !anuncio.preco || anuncio.preco <= precoMax
    const seloOk = !seloFiltro || (anuncio.selos && anuncio.selos.includes(seloFiltro))
    return precoOk && seloOk
  })

  renderizarCards(filtrados)
}

/**
 * Renderiza uma lista de anúncios como cards no container principal.
 * @param {Array} anuncios - Lista de anúncios a renderizar
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

    // Monta badges ESG se houver selos
    let selosHTML = ''
    if (anuncio.selos) {
      const nomes = anuncio.selos.split(', ')
      const icones = anuncio.selos_icones ? anuncio.selos_icones.split(', ') : []
      selosHTML = '<div class="card-selos">'
      nomes.forEach((nome, i) => {
        const icone = icones[i] || ''
        selosHTML += `<span class="badge-esg" title="Selo ESG: ${nome}">${icone} ${nome}</span>`
      })
      selosHTML += '</div>'
    }

    // Monta link externo para empregos
    let linkHTML = ''
    if (anuncio.link_externo) {
      linkHTML = `<a href="${anuncio.link_externo}" target="_blank" rel="noopener noreferrer" class="card-link-externo">Ver vaga externa</a>`
    }

    // Monta preço se existir
    let precoHTML = ''
    if (anuncio.preco) {
      precoHTML = `<span class="card-preco">R$ ${Number(anuncio.preco).toLocaleString('pt-BR')}${anuncio.periodo || ''}</span>`
    }

    card.innerHTML = `
      <div class="card-conteudo">
        <div class="card-cabecalho">
          <h3>${anuncio.titulo}</h3>
          ${precoHTML}
        </div>
        <span class="card-tipo">${anuncio.tipo}</span>
        ${selosHTML}
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

/**
 * Dados estáticos de benefícios — funciona offline.
 * Carregados do backend quando disponível, senão usa fallback local.
 */
const BENEFICIOS_FALLBACK = [
  {
    nome: 'Programa de Auxílio Permanência (PAP)',
    descricao: 'Auxílio financeiro mensal para estudantes em situação de vulnerabilidade socioeconômica.',
    requisitos: ['Estar regularmente matriculado no IFSP', 'Comprovar situação de vulnerabilidade socioeconômica'],
    como_solicitar: 'Ficar atento aos editais publicados no site do IFSP.',
    contato: 'Coordenadoria Sociopedagógica — csp.jcr@ifsp.edu.br'
  }
]

/**
 * Carrega e renderiza a seção de benefícios sociais.
 */
async function carregarBeneficios() {
  let beneficios = await buscarDaAPI('/api/beneficios')
  if (beneficios.length === 0) {
    beneficios = BENEFICIOS_FALLBACK
  }

  const lista = document.getElementById('listaBeneficios')
  lista.innerHTML = ''

  beneficios.forEach(b => {
    const card = document.createElement('div')
    card.className = 'beneficio-card'

    let requisitosHTML = ''
    if (b.requisitos && b.requisitos.length) {
      requisitosHTML = '<ul>' + b.requisitos.map(r => `<li>${r}</li>`).join('') + '</ul>'
    }

    card.innerHTML = `
      <h3>${b.nome}</h3>
      <p>${b.descricao}</p>
      ${requisitosHTML}
      ${b.como_solicitar ? `<p><strong>Como solicitar:</strong> ${b.como_solicitar}</p>` : ''}
      ${b.contato ? `<p class="beneficio-contato">${b.contato}</p>` : ''}
    `

    lista.appendChild(card)
  })
}

/* ======== Guia do Campus ======== */

/**
 * Carrega e renderiza a seção do Guia do Campus com accordion.
 */
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

    // Toggle do accordion
    item.querySelector('.setor-cabecalho').addEventListener('click', () => {
      item.classList.toggle('aberto')
    })

    lista.appendChild(item)
  })
}

/* ======== Navegação entre Seções ======== */

/**
 * Alterna entre as seções do site (moradia, transporte, empregos, benefícios, campus).
 * @param {string} secao - Nome da seção para ativar
 */
function navegarPara(secao) {
  secaoAtual = secao

  // Atualiza botões de navegação
  botoesNav.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.secao === secao)
  })

  // Seções de anúncios vs. estáticas
  const secoesAnuncio = ['moradia', 'transporte', 'empregos']
  const ehAnuncio = secoesAnuncio.includes(secao)

  // Mostra/esconde elementos
  document.getElementById('secaoAnuncios').hidden = !ehAnuncio
  document.getElementById('secaoBeneficios').hidden = secao !== 'beneficios'
  document.getElementById('secaoCampus').hidden = secao !== 'campus'
  areaFiltros.hidden = !ehAnuncio

  // Carrega conteúdo
  if (ehAnuncio) {
    carregarAnuncios(secao)
  } else if (secao === 'beneficios') {
    carregarBeneficios()
  } else if (secao === 'campus') {
    carregarCampus()
  }

  // Fecha menu mobile ao navegar
  navPrincipal.classList.remove('aberta')
  menuToggle.classList.remove('aberto')
  menuToggle.setAttribute('aria-expanded', 'false')
}

/* ======== Formulário de Envio ======== */

/**
 * Envia o formulário de novo anúncio para a API.
 * O anúncio fica com status "pendente" até aprovação manual.
 */
async function enviarAnuncio(evento) {
  evento.preventDefault()

  const form = evento.target
  const botao = form.querySelector('.btn-submit')
  botao.disabled = true
  botao.textContent = 'Enviando...'

  // Coleta dados do formulário
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
    selos_ids: Array.from(form.querySelectorAll('input[name="selos_ids"]:checked')).map(cb => parseInt(cb.value))
  }

  try {
    const resposta = await fetch(API_URL + '/api/anuncios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    })

    const json = await resposta.json()

    if (json.sucesso) {
      form.hidden = true
      mensagemSucesso.hidden = false
    } else {
      const erroTexto = json.erros ? json.erros.join('\n') : json.erro
      alert('Erro ao enviar: ' + erroTexto)
    }
  } catch (erro) {
    alert('Erro de conexão. Verifique se o servidor está rodando.')
  } finally {
    botao.disabled = false
    botao.textContent = 'Enviar Anúncio'
  }
}

/* ======== Event Listeners ======== */

// Menu hambúrguer
menuToggle.addEventListener('click', () => {
  const aberto = navPrincipal.classList.toggle('aberta')
  menuToggle.classList.toggle('aberto')
  menuToggle.setAttribute('aria-expanded', String(aberto))
})

// Navegação por abas
botoesNav.forEach(btn => {
  btn.addEventListener('click', () => {
    navegarPara(btn.dataset.secao)
  })
})

// Filtro de preço
sliderPreco.addEventListener('input', () => {
  valorPreco.textContent = `R$ ${parseInt(sliderPreco.value).toLocaleString('pt-BR')}`
  aplicarFiltros()
})

// Filtro de selo ESG
selectSelo.addEventListener('change', aplicarFiltros)

// Formulário — abrir e fechar modal
btnAbrirFormulario.addEventListener('click', () => {
  modalFormulario.hidden = false
  formularioAnuncio.hidden = false
  mensagemSucesso.hidden = true
  formularioAnuncio.reset()
})

btnFecharModal.addEventListener('click', () => {
  modalFormulario.hidden = true
})

// Fechar modal ao clicar fora
modalFormulario.addEventListener('click', (evento) => {
  if (evento.target === modalFormulario) {
    modalFormulario.hidden = true
  }
})

// Envio do formulário
formularioAnuncio.addEventListener('submit', enviarAnuncio)

/* ======== Inicializa a aplicação ======== */
inicializar()
