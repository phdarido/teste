/**
 * @file server.js
 * @description Servidor principal da API Fala Calourada.
 *
 * Este servidor fornece endpoints REST para o portal informativo
 * do IFSP Jacareí. A plataforma é exclusivamente informativa —
 * não realiza intermediação, negociação ou cobrança de taxas.
 */

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')

// Importa o banco (cria tabelas automaticamente)
require('./database')

// Importa as rotas
const rotasAnuncios = require('./routes/anuncios')
const rotasCampus = require('./routes/campus')
const rotasBeneficios = require('./routes/beneficios')


const app = express()
const PORTA = process.env.PORT || 3000

/* ======== Middlewares ======== */

// Permite requisições do frontend (origens diferentes)
app.use(cors())

// Interpreta corpo das requisições como JSON
app.use(express.json())

// Serve arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '..', 'frontend')))

/* ======== Rotas ======== */

/**
 * GET /health
 * Verifica se o servidor está no ar.
 * Útil para monitoramento e deploy.
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', mensagem: 'Servidor Fala Calourada funcionando!' })
})

// Rotas da API
app.use('/api', rotasAnuncios)
app.use('/api', rotasCampus)
app.use('/api', rotasBeneficios)


// Rota fallback — serve o frontend para qualquer outra rota
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'))
})

/* ======== Inicialização ======== */

app.listen(PORTA, () => {
  console.log(`Servidor Fala Calourada rodando em http://localhost:${PORTA}`)
})
