/**
 * @file seeds/seed.js
 * @description Popula o banco de dados com dados iniciais de exemplo.
 *
 * Executar com: npm run seed (dentro da pasta backend)
 * Pode ser executado múltiplas vezes — limpa as tabelas antes de inserir.
 */

const bd = require('../database')

console.log('Iniciando seed do banco de dados...')

// Limpa tabelas na ordem correta (respeita chaves estrangeiras)
bd.exec(`
  DELETE FROM anuncio_selos;
  DELETE FROM anuncios;
  DELETE FROM selos_esg;
  DELETE FROM campus_setores;
`)

/* ======== Selos ESG ======== */
console.log('Inserindo selos ESG...')

const inserirSelo = bd.prepare(`
  INSERT INTO selos_esg (nome, descricao, icone) VALUES (?, ?, ?)
`)

const selos = [
  [
    'Habitação Consciente',
    'Para imóveis com práticas sustentáveis como captação de água da chuva, energia solar, coleta seletiva ou materiais ecológicos.',
    '🏡'
  ],
  [
    'Eco-Friendly',
    'Para transportes e empresas que adotam práticas sustentáveis como combustível limpo, carona solidária ou compensação de carbono.',
    '🌿'
  ],
  [
    'Certificado de Competência ESG',
    'Para empresas com boas práticas ambientais, sociais e de governança corporativa.',
    '🏆'
  ]
]

for (const selo of selos) {
  inserirSelo.run(...selo)
}

/* ======== Anúncios ======== */
console.log('Inserindo anúncios de exemplo...')

const inserirAnuncio = bd.prepare(`
  INSERT INTO anuncios (titulo, descricao, contato_nome, contato_email, contato_telefone,
    endereco, preco, periodo, tipo, imagem_url, link_externo, status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'aprovado')
`)

const anuncios = [
  // MORADIA
  {
    titulo: 'Dividir apartamento perto da faculdade',
    descricao: 'Quarto disponível em apartamento mobiliado a 10 minutos do IFSP Jacareí. Inclui internet, cozinha equipada e área de estudos.',
    contato_nome: 'Ana Paula',
    contato_email: 'ana@email.com',
    contato_telefone: '(12) 98888-3333',
    endereco: 'Rua das Flores, 123 — Centro, Jacareí',
    preco: 800,
    periodo: '/mês',
    tipo: 'MORADIA',
    imagem_url: null,
    link_externo: null
  },
  {
    titulo: 'Quarto individual em república estudantil',
    descricao: 'República organizada com internet, cozinha equipada e lavanderia. Ambiente tranquilo para estudos. Perto do ponto de ônibus.',
    contato_nome: 'República Universitária',
    contato_email: 'contato@republica.com',
    contato_telefone: '(12) 95555-6666',
    endereco: 'Av. Brasil, 456 — Jardim Califórnia, Jacareí',
    preco: 650,
    periodo: '/mês',
    tipo: 'MORADIA',
    imagem_url: null,
    link_externo: null
  },
  {
    titulo: 'Apartamento para dividir com estudante',
    descricao: 'Apartamento amplo próximo ao centro com garagem e internet. Aceita estudantes, sem necessidade de fiador.',
    contato_nome: 'Fernanda Alves',
    contato_email: 'fernanda@email.com',
    contato_telefone: '(12) 92222-9999',
    endereco: 'Rua Capitão Deolindo, 789 — Centro, Jacareí',
    preco: 900,
    periodo: '/mês',
    tipo: 'MORADIA',
    imagem_url: null,
    link_externo: null
  },
  {
    titulo: 'Kitnet mobiliada próxima ao IFSP',
    descricao: 'Kitnet individual com cama, armário, banheiro privativo e internet inclusa. Ideal para quem busca privacidade. 5 minutos a pé do campus.',
    contato_nome: 'José Carlos',
    contato_email: 'josecarlos@email.com',
    contato_telefone: '(12) 91234-5678',
    endereco: 'Rua Professora Maria, 321 — Jardim das Indústrias, Jacareí',
    preco: 1100,
    periodo: '/mês',
    tipo: 'MORADIA',
    imagem_url: null,
    link_externo: null
  },

  // TRANSPORTE
  {
    titulo: 'Carona Jacareí → São José dos Campos',
    descricao: 'Carona diária saindo às 7h do centro de Jacareí até São José dos Campos. Retorno às 18h. Divisão de combustível.',
    contato_nome: 'Carlos Henrique',
    contato_email: 'carlos@email.com',
    contato_telefone: '(12) 99111-2222',
    endereco: 'Saída: Centro de Jacareí',
    preco: 20,
    periodo: '/dia',
    tipo: 'TRANSPORTE',
    imagem_url: null,
    link_externo: null
  },
  {
    titulo: 'Carona para faculdade período noturno',
    descricao: 'Saída às 18h do bairro Villa Branca em Jacareí. Ideal para estudantes do período noturno.',
    contato_nome: 'Juliana Souza',
    contato_email: 'juliana@email.com',
    contato_telefone: '(12) 96666-5555',
    endereco: 'Saída: Villa Branca, Jacareí',
    preco: 15,
    periodo: '/dia',
    tipo: 'TRANSPORTE',
    imagem_url: null,
    link_externo: null
  },
  {
    titulo: 'Carona compartilhada para São Paulo',
    descricao: 'Saída sexta-feira às 17h para São Paulo pela Dutra, divisão de combustível e pedágio. Retorno domingo à noite.',
    contato_nome: 'Pedro Lima',
    contato_email: 'pedro@email.com',
    contato_telefone: '(12) 93333-8888',
    endereco: 'Saída: Rodoviária de Jacareí',
    preco: 50,
    periodo: '/viagem',
    tipo: 'TRANSPORTE',
    imagem_url: null,
    link_externo: null
  },

  // EMPREGO (apenas informativo — sem candidatura interna)
  {
    titulo: 'Estágio em desenvolvimento web',
    descricao: 'Empresa de tecnologia busca estudante para estágio em programação com PHP e JavaScript. Bolsa de R$ 1.200/mês + vale transporte.',
    contato_nome: 'Tech Solutions',
    contato_email: 'rh@techsolutions.com',
    contato_telefone: '(12) 97777-4444',
    endereco: 'Jacareí — SP',
    preco: 1200,
    periodo: '/mês',
    tipo: 'EMPREGO',
    imagem_url: null,
    link_externo: 'https://www.vagas.com.br'
  },
  {
    titulo: 'Estágio em marketing digital',
    descricao: 'Agência busca estudante criativo para trabalhar com redes sociais e anúncios pagos. Bolsa de R$ 1.000/mês.',
    contato_nome: 'Agência Criativa',
    contato_email: 'rh@agenciacriativa.com',
    contato_telefone: '(12) 94444-7777',
    endereco: 'São José dos Campos — SP',
    preco: 1000,
    periodo: '/mês',
    tipo: 'EMPREGO',
    imagem_url: null,
    link_externo: 'https://www.indeed.com.br'
  },
  {
    titulo: 'Estágio em suporte de TI',
    descricao: 'Empresa de tecnologia busca estagiário para suporte técnico e manutenção de redes. Bolsa de R$ 1.300/mês + benefícios.',
    contato_nome: 'InfoTech',
    contato_email: 'contato@infotech.com',
    contato_telefone: '(12) 91111-0000',
    endereco: 'Jacareí — SP',
    preco: 1300,
    periodo: '/mês',
    tipo: 'EMPREGO',
    imagem_url: null,
    link_externo: 'https://www.linkedin.com/jobs'
  }
]

for (const a of anuncios) {
  inserirAnuncio.run(
    a.titulo, a.descricao, a.contato_nome, a.contato_email, a.contato_telefone,
    a.endereco, a.preco, a.periodo, a.tipo, a.imagem_url, a.link_externo
  )
}

/* ======== Associar selos ESG a alguns anúncios ======== */
console.log('Associando selos ESG a anúncios...')

const inserirAnuncioSelo = bd.prepare('INSERT INTO anuncio_selos (anuncio_id, selo_id) VALUES (?, ?)')

// Anúncio 2 (república estudantil) → Habitação Consciente (selo 1)
inserirAnuncioSelo.run(2, 1)

// Anúncio 5 (carona Jacareí→SJC) → Eco-Friendly (selo 2)
inserirAnuncioSelo.run(5, 2)

// Anúncio 7 (carona compartilhada SP) → Eco-Friendly (selo 2)
inserirAnuncioSelo.run(7, 2)

// Anúncio 8 (estágio dev web) → Certificado de Competência ESG (selo 3)
inserirAnuncioSelo.run(8, 3)

/* ======== Setores do Campus ======== */
console.log('Inserindo setores do campus IFSP Jacareí...')

const inserirSetor = bd.prepare(`
  INSERT INTO campus_setores (nome, descricao, telefone, email, localizacao)
  VALUES (?, ?, ?, ?, ?)
`)

const setores = [
  [
    'Direção-Geral',
    'Responsável pela gestão administrativa e acadêmica do campus.',
    '(12) 3958-1730',
    'drg.jcr@ifsp.edu.br',
    'Bloco Administrativo — Térreo'
  ],
  [
    'Coordenadoria de Registros Acadêmicos (CRA)',
    'Responsável por matrículas, históricos, diplomas e documentação acadêmica.',
    '(12) 3958-1730',
    'cra.jcr@ifsp.edu.br',
    'Bloco Administrativo — Térreo'
  ],
  [
    'Coordenadoria Sociopedagógica (CSP)',
    'Atendimento ao estudante, assistência estudantil, auxílios e acompanhamento pedagógico.',
    '(12) 3958-1730',
    'csp.jcr@ifsp.edu.br',
    'Bloco Administrativo — 1º Andar'
  ],
  [
    'Biblioteca',
    'Acervo físico e digital, empréstimos de livros, espaço de estudo individual e em grupo.',
    '(12) 3958-1730',
    'bib.jcr@ifsp.edu.br',
    'Bloco Acadêmico — Térreo'
  ],
  [
    'Coordenadoria de Extensão',
    'Projetos de extensão, cursos livres, eventos e atividades com a comunidade externa.',
    '(12) 3958-1730',
    'cex.jcr@ifsp.edu.br',
    'Bloco Administrativo — 1º Andar'
  ],
  [
    'Coordenadoria de Pesquisa e Inovação',
    'Apoio a projetos de pesquisa, iniciação científica e inovação tecnológica.',
    '(12) 3958-1730',
    'cpq.jcr@ifsp.edu.br',
    'Bloco Administrativo — 1º Andar'
  ],
  [
    'Coordenadoria de Informática',
    'Suporte técnico, laboratórios de informática e infraestrutura de TI do campus.',
    '(12) 3958-1730',
    'cti.jcr@ifsp.edu.br',
    'Bloco Administrativo — Térreo'
  ],
  [
    'Grêmio Estudantil',
    'Representação dos estudantes, organização de eventos estudantis e integração entre alunos.',
    null,
    'gremio.jcr@ifsp.edu.br',
    'Bloco Acadêmico — Espaço de Convivência'
  ]
]

for (const setor of setores) {
  inserirSetor.run(...setor)
}

console.log('Seed concluído com sucesso!')
console.log('  - 3 selos ESG inseridos')
console.log(`  - ${anuncios.length} anúncios inseridos`)
console.log(`  - ${setores.length} setores do campus inseridos`)
console.log('  - 4 associações anúncio-selo criadas')
