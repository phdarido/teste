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

/**
 * Busca anúncios aprovados com seus selos ESG.
 * Anúncios com selos aparecem primeiro (maior visibilidade).
 * @param {string|null} tipo - Filtro por tipo (MORADIA, TRANSPORTE, EMPREGO)
 * @param {string|null} selo - Filtro por nome do selo ESG
 * @returns {Array} Lista de anúncios com selos
 */
function buscarAnuncios(tipo, selo) {
  let sql = `
    SELECT
      a.*,
      GROUP_CONCAT(s.nome, ', ') AS selos,
      GROUP_CONCAT(s.icone, ', ') AS selos_icones,
      COUNT(s.id) AS total_selos
    FROM anuncios a
    LEFT JOIN anuncio_selos ase ON a.id = ase.anuncio_id
    LEFT JOIN selos_esg s ON ase.selo_id = s.id
    WHERE a.status = 'aprovado'
  `
  const parametros = []

  if (tipo) {
    sql += ' AND a.tipo = ?'
    parametros.push(tipo)
  }

  sql += ' GROUP BY a.id'

  if (selo) {
    sql += ' HAVING selos LIKE ?'
    parametros.push(`%${selo}%`)
  }

  // Anúncios com selos ESG aparecem primeiro (gamificação de visibilidade)
  sql += ' ORDER BY total_selos DESC, a.criado_em DESC'

  return bd.prepare(sql).all(...parametros)
}

/**
 * GET /api/anuncios
 * Lista todos os anúncios aprovados.
 * Parâmetros de query opcionais: ?tipo=MORADIA&selo=Eco-Friendly
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

/**
 * GET /api/moradia
 * Lista anúncios aprovados do tipo MORADIA.
 */
router.get('/moradia', (req, res) => {
  try {
    const anuncios = buscarAnuncios('MORADIA', req.query.selo || null)
    res.json({ sucesso: true, dados: anuncios })
  } catch (erro) {
    console.error('Erro ao buscar moradia:', erro)
    res.status(500).json({ sucesso: false, erro: 'Erro interno ao buscar moradias.' })
  }
})

/**
 * GET /api/transporte
 * Lista anúncios aprovados do tipo TRANSPORTE.
 */
router.get('/transporte', (req, res) => {
  try {
    const anuncios = buscarAnuncios('TRANSPORTE', req.query.selo || null)
    res.json({ sucesso: true, dados: anuncios })
  } catch (erro) {
    console.error('Erro ao buscar transporte:', erro)
    res.status(500).json({ sucesso: false, erro: 'Erro interno ao buscar transportes.' })
  }
})

/**
 * GET /api/empregos
 * Lista anúncios aprovados do tipo EMPREGO.
 * NOTA: Apenas informativo — sem candidatura interna, apenas redirecionamento.
 */
router.get('/empregos', (req, res) => {
  try {
    const anuncios = buscarAnuncios('EMPREGO', req.query.selo || null)
    res.json({ sucesso: true, dados: anuncios })
  } catch (erro) {
    console.error('Erro ao buscar empregos:', erro)
    res.status(500).json({ sucesso: false, erro: 'Erro interno ao buscar empregos.' })
  }
})

/**
 * POST /api/anuncios
 * Cria um novo anúncio com status "pendente".
 * O anúncio só aparece no site após aprovação manual.
 *
 * Corpo da requisição (JSON):
 * - titulo (obrigatório)
 * - descricao (obrigatório)
 * - contato_nome (obrigatório)
 * - tipo (obrigatório: MORADIA, TRANSPORTE ou EMPREGO)
 * - contato_email, contato_telefone, endereco, preco, periodo, imagem_url, link_externo (opcionais)
 * - selos_ids (opcional): array com IDs dos selos ESG solicitados
 */
router.post('/anuncios', (req, res) => {
  try {
    const {
      titulo, descricao, contato_nome, contato_email, contato_telefone,
      endereco, preco, periodo, tipo, imagem_url, link_externo, selos_ids
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

    if (erros.length > 0) {
      return res.status(400).json({ sucesso: false, erros })
    }

    // Insere o anúncio com status pendente
    const resultado = bd.prepare(`
      INSERT INTO anuncios (titulo, descricao, contato_nome, contato_email, contato_telefone,
        endereco, preco, periodo, tipo, imagem_url, link_externo, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendente')
    `).run(
      titulo.trim(), descricao.trim(), contato_nome.trim(),
      contato_email || null, contato_telefone || null,
      endereco || null, preco || null, periodo || null,
      tipo, imagem_url || null, link_externo || null
    )

    // Associa selos ESG se informados
    if (selos_ids && Array.isArray(selos_ids) && selos_ids.length > 0) {
      const inserirSelo = bd.prepare('INSERT OR IGNORE INTO anuncio_selos (anuncio_id, selo_id) VALUES (?, ?)')
      for (const seloId of selos_ids) {
        inserirSelo.run(resultado.lastInsertRowid, seloId)
      }
    }

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
