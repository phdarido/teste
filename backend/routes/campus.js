/**
 * @file routes/campus.js
 * @description Rotas para o Guia do Campus IFSP Jacareí.
 * Retorna informações sobre setores, contatos e localização.
 */

const express = require('express')
const router = express.Router()
const bd = require('../database')

/**
 * GET /api/campus
 * Lista todos os setores do campus IFSP Jacareí.
 */
router.get('/campus', (req, res) => {
  try {
    const setores = bd.prepare('SELECT * FROM campus_setores ORDER BY nome ASC').all()
    res.json({ sucesso: true, dados: setores })
  } catch (erro) {
    console.error('Erro ao buscar setores do campus:', erro)
    res.status(500).json({ sucesso: false, erro: 'Erro interno ao buscar setores do campus.' })
  }
})

module.exports = router
