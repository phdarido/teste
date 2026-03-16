/**
 * @file routes/selos.js
 * @description Rotas para os Selos ESG (gamificação de visibilidade).
 *
 * IMPORTANTE: Os selos conferem APENAS maior visibilidade/ranking
 * nos resultados da plataforma. Não há qualquer benefício financeiro.
 */

const express = require('express')
const router = express.Router()
const bd = require('../database')

/**
 * GET /api/selos
 * Lista todos os selos ESG disponíveis na plataforma.
 */
router.get('/selos', (req, res) => {
  try {
    const selos = bd.prepare('SELECT * FROM selos_esg ORDER BY nome ASC').all()
    res.json({ sucesso: true, dados: selos })
  } catch (erro) {
    console.error('Erro ao buscar selos ESG:', erro)
    res.status(500).json({ sucesso: false, erro: 'Erro interno ao buscar selos ESG.' })
  }
})

module.exports = router
