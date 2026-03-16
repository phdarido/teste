/**
 * @file routes/anuncios.js
 * @description Rotas para gerenciamento de anúncios (moradia, transporte, emprego).
 *
 * IMPORTANTE: Esta API é exclusivamente informativa.
 * - Anúncios de emprego contêm apenas título, descrição e link externo.
 * - NÃO há fluxo de candidatura, negociação ou pagamento.
 * - Anúncios novos ficam com status "pendente" até aprovação manual.
 */

const express = require('express')
const router = express.Router()
const bd = require('../database')

/** Selos ESG válidos */
const SELOS_VALIDOS = ['Habitação Consciente', 'Eco-Friendly', 'Certificado de Competência ESG']

/**
 * Busca anúncios aprovados. Anúncios com selo ESG aparecem primeiro.
 * @param {string|null} tipo - Filtro por tipo (MORADIA, TRANSPORTE, EMPREGO)
 * @param {string|null} selo - Filtro por selo ESG
 * @returns {Array} Lista de anúncios
 */
function buscarAnuncios(tipo, selo) {
  let sql = 'SELECT * FROM anuncios WHERE status = ?'
  const parametros = ['aprovado']

  if (tipo) {
    sql += ' AND tipo = ?'
    parametros.push(tipo)
  }

  if (selo) {
    sql += ' AND selo_esg = ?'
    parametros.push(selo)
  }

  // Anúncios com selo ESG aparecem primeiro (maior visibilidade)
  sql += ' ORDER BY (selo_esg IS NOT NULL) DESC, criado_em DESC'

  return bd.prepare(sql).all(...parametros)
}

/**
 * GET /api/anuncios
 * Lista todos os anúncios aprovados.
 * Query opcionais: ?tipo=MORADIA&selo=Eco-Friendly
 */
router.get('/anuncios', (req, res) => {
  try {
    const { tipo, selo } = req.query
    const anuncios = buscarAnuncios(tipo || null, selo || null)
    res.json({ sucesso: true, dados: anuncios })
  } catch (erro) {
    console.error('Erro ao buscar anúncios:', erro)
    res.status(500).json({ sucesso: false, erro: 'Erro interno ao buscar anúncios.' })
  }
})

/** GET /api/moradia */
router.get('/moradia', (req, res) => {
  try {
    const anuncios = buscarAnuncios('MORADIA', req.query.selo || null)
    res.json({ sucesso: true, dados: anuncios })
  } catch (erro) {
    res.status(500).json({ sucesso: false, erro: 'Erro interno ao buscar moradias.' })
  }
})

/** GET /api/transporte */
router.get('/transporte', (req, res) => {
  try {
    const anuncios = buscarAnuncios('TRANSPORTE', req.query.selo || null)
    res.json({ sucesso: true, dados: anuncios })
  } catch (erro) {
    res.status(500).json({ sucesso: false, erro: 'Erro interno ao buscar transportes.' })
  }
})

/**
 * GET /api/empregos
 * Apenas informativo — sem candidatura interna, apenas redirecionamento.
 */
router.get('/empregos', (req, res) => {
  try {
    const anuncios = buscarAnuncios('EMPREGO', req.query.selo || null)
    res.json({ sucesso: true, dados: anuncios })
  } catch (erro) {
    res.status(500).json({ sucesso: false, erro: 'Erro interno ao buscar empregos.' })
  }
})

/**
 * POST /api/anuncios
 * Cria um novo anúncio com status "pendente".
 */
router.post('/anuncios', (req, res) => {
  try {
    const {
      titulo, descricao, contato_nome, contato_email, contato_telefone,
      endereco, preco, periodo, tipo, imagem_url, link_externo, selo_esg
    } = req.body

    // Validação de campos obrigatórios
    const erros = []
    if (!titulo || !titulo.trim()) erros.push('O campo "título" é obrigatório.')
    if (!descricao || !descricao.trim()) erros.push('O campo "descrição" é obrigatório.')
    if (!contato_nome || !contato_nome.trim()) erros.push('O campo "nome de contato" é obrigatório.')
    if (!tipo) erros.push('O campo "tipo" é obrigatório.')
    if (tipo && !['MORADIA', 'TRANSPORTE', 'EMPREGO'].includes(tipo)) {
      erros.push('O tipo deve ser MORADIA, TRANSPORTE ou EMPREGO.')
    }
    if (selo_esg && !SELOS_VALIDOS.includes(selo_esg)) {
      erros.push('Selo ESG inválido.')
    }

    if (erros.length > 0) {
      return res.status(400).json({ sucesso: false, erros })
    }

    const resultado = bd.prepare(`
      INSERT INTO anuncios (titulo, descricao, contato_nome, contato_email, contato_telefone,
        endereco, preco, periodo, tipo, imagem_url, link_externo, selo_esg, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendente')
    `).run(
      titulo.trim(), descricao.trim(), contato_nome.trim(),
      contato_email || null, contato_telefone || null,
      endereco || null, preco || null, periodo || null,
      tipo, imagem_url || null, link_externo || null, selo_esg || null
    )

    res.status(201).json({
      sucesso: true,
      mensagem: 'Anúncio enviado com sucesso! Ele ficará pendente até ser aprovado pela moderação.',
      id: resultado.lastInsertRowid
    })
  } catch (erro) {
    console.error('Erro ao criar anúncio:', erro)
    res.status(500).json({ sucesso: false, erro: 'Erro interno ao criar anúncio.' })
  }
})

module.exports = router
