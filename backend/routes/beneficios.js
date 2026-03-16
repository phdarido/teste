/**
 * @file routes/beneficios.js
 * @description Rotas para informações sobre benefícios sociais do IFSP.
 *
 * Inclui dados sobre o PAP (Programa de Auxílio Permanência)
 * e demais auxílios da assistência estudantil.
 * Os dados são estáticos e servem como referência informativa.
 */

const express = require('express')
const router = express.Router()

/**
 * Dados estáticos dos benefícios sociais do IFSP.
 * Estes dados podem ser atualizados conforme editais do IFSP.
 */
const BENEFICIOS = [
  {
    id: 1,
    nome: 'Programa de Auxílio Permanência (PAP)',
    descricao: 'Auxílio financeiro mensal para estudantes em situação de vulnerabilidade socioeconômica, visando reduzir a evasão e promover a permanência no curso.',
    requisitos: [
      'Estar regularmente matriculado no IFSP',
      'Comprovar situação de vulnerabilidade socioeconômica',
      'Participar do processo seletivo conforme edital vigente'
    ],
    como_solicitar: 'Ficar atento aos editais publicados no site do IFSP e realizar inscrição no período indicado junto à Coordenadoria Sociopedagógica.',
    contato: 'Coordenadoria Sociopedagógica — csp.jcr@ifsp.edu.br'
  },
  {
    id: 2,
    nome: 'Auxílio Alimentação',
    descricao: 'Auxílio para custear alimentação dos estudantes em vulnerabilidade socioeconômica durante o período letivo.',
    requisitos: [
      'Estar regularmente matriculado no IFSP',
      'Comprovar necessidade socioeconômica',
      'Inscrever-se conforme edital'
    ],
    como_solicitar: 'Inscrição via edital da assistência estudantil, disponível no site do campus.',
    contato: 'Coordenadoria Sociopedagógica — csp.jcr@ifsp.edu.br'
  },
  {
    id: 3,
    nome: 'Auxílio Transporte',
    descricao: 'Auxílio para custear deslocamento dos estudantes até o campus, destinado a alunos em vulnerabilidade socioeconômica.',
    requisitos: [
      'Estar regularmente matriculado no IFSP',
      'Residir em local que demande transporte para acesso ao campus',
      'Comprovar necessidade socioeconômica'
    ],
    como_solicitar: 'Inscrição via edital da assistência estudantil.',
    contato: 'Coordenadoria Sociopedagógica — csp.jcr@ifsp.edu.br'
  },
  {
    id: 4,
    nome: 'Auxílio Moradia',
    descricao: 'Auxílio para estudantes que precisam de moradia próxima ao campus por não residirem na cidade.',
    requisitos: [
      'Estar regularmente matriculado no IFSP',
      'Não residir em Jacareí ou região próxima',
      'Comprovar necessidade socioeconômica'
    ],
    como_solicitar: 'Inscrição via edital específico da assistência estudantil.',
    contato: 'Coordenadoria Sociopedagógica — csp.jcr@ifsp.edu.br'
  },
  {
    id: 5,
    nome: 'Auxílio Conectividade',
    descricao: 'Auxílio para acesso à internet, destinado a estudantes que necessitam de conectividade para atividades acadêmicas.',
    requisitos: [
      'Estar regularmente matriculado no IFSP',
      'Comprovar dificuldade de acesso à internet',
      'Inscrever-se conforme edital'
    ],
    como_solicitar: 'Inscrição via edital da assistência estudantil.',
    contato: 'Coordenadoria Sociopedagógica — csp.jcr@ifsp.edu.br'
  }
]

/**
 * GET /api/beneficios
 * Retorna lista de benefícios sociais disponíveis no IFSP.
 */
router.get('/beneficios', (req, res) => {
  res.json({ sucesso: true, dados: BENEFICIOS })
})

module.exports = router
