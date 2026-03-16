/**
 * @file seeds/seed.js
 * @description Popula o banco de dados com dados iniciais de exemplo.
 *
 * Executar com: npm run seed (dentro da pasta backend)
 * Pode ser executado múltiplas vezes — limpa as tabelas antes de inserir.
 */

const bd = require('../database')

console.log('Iniciando seed do banco de dados...')

// Limpa tabelas
bd.exec(`
  DELETE FROM anuncios;
  DELETE FROM campus_setores;
`)

/* ======== Anúncios ======== */
console.log('Inserindo anúncios de exemplo...')

const inserirAnuncio = bd.prepare(`
  INSERT INTO anuncios (titulo, descricao, contato_nome, contato_email, contato_telefone,
    endereco, preco, periodo, tipo, imagem_url, link_externo, selo_esg, status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'aprovado')
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
    preco: 800, periodo: '/mês', tipo: 'MORADIA',
    imagem_url: null, link_externo: null, selo_esg: null
  },
  {
    titulo: 'Quarto individual em república estudantil',
    descricao: 'República organizada com internet, cozinha equipada e lavanderia. Ambiente tranquilo para estudos. Energia solar e coleta seletiva.',
    contato_nome: 'República Universitária',
    contato_email: 'contato@republica.com',
    contato_telefone: '(12) 95555-6666',
    endereco: 'Av. Brasil, 456 — Jardim Califórnia, Jacareí',
    preco: 650, periodo: '/mês', tipo: 'MORADIA',
    imagem_url: null, link_externo: null, selo_esg: 'Habitação Consciente'
  },
  {
    titulo: 'Apartamento para dividir com estudante',
    descricao: 'Apartamento amplo próximo ao centro com garagem e internet. Aceita estudantes, sem necessidade de fiador.',
    contato_nome: 'Fernanda Alves',
    contato_email: 'fernanda@email.com',
    contato_telefone: '(12) 92222-9999',
    endereco: 'Rua Capitão Deolindo, 789 — Centro, Jacareí',
    preco: 900, periodo: '/mês', tipo: 'MORADIA',
    imagem_url: null, link_externo: null, selo_esg: null
  },
  {
    titulo: 'Kitnet mobiliada próxima ao IFSP',
    descricao: 'Kitnet individual com cama, armário, banheiro privativo e internet inclusa. 5 minutos a pé do campus.',
    contato_nome: 'José Carlos',
    contato_email: 'josecarlos@email.com',
    contato_telefone: '(12) 91234-5678',
    endereco: 'Rua Professora Maria, 321 — Jardim das Indústrias, Jacareí',
    preco: 1100, periodo: '/mês', tipo: 'MORADIA',
    imagem_url: null, link_externo: null, selo_esg: null
  },

  // TRANSPORTE
  {
    titulo: 'Carona Jacareí → São José dos Campos',
    descricao: 'Carona diária saindo às 7h do centro de Jacareí até São José dos Campos. Retorno às 18h. Divisão de combustível.',
    contato_nome: 'Carlos Henrique',
    contato_email: 'carlos@email.com',
    contato_telefone: '(12) 99111-2222',
    endereco: 'Saída: Centro de Jacareí',
    preco: 20, periodo: '/dia', tipo: 'TRANSPORTE',
    imagem_url: null, link_externo: null, selo_esg: 'Eco-Friendly'
  },
  {
    titulo: 'Carona para faculdade período noturno',
    descricao: 'Saída às 18h do bairro Villa Branca em Jacareí. Ideal para estudantes do período noturno.',
    contato_nome: 'Juliana Souza',
    contato_email: 'juliana@email.com',
    contato_telefone: '(12) 96666-5555',
    endereco: 'Saída: Villa Branca, Jacareí',
    preco: 15, periodo: '/dia', tipo: 'TRANSPORTE',
    imagem_url: null, link_externo: null, selo_esg: null
  },
  {
    titulo: 'Carona compartilhada para São Paulo',
    descricao: 'Saída sexta-feira às 17h para São Paulo pela Dutra, divisão de combustível e pedágio. Retorno domingo à noite.',
    contato_nome: 'Pedro Lima',
    contato_email: 'pedro@email.com',
    contato_telefone: '(12) 93333-8888',
    endereco: 'Saída: Rodoviária de Jacareí',
    preco: 50, periodo: '/viagem', tipo: 'TRANSPORTE',
    imagem_url: null, link_externo: null, selo_esg: null
  },

  // EMPREGO (apenas informativo)
  {
    titulo: 'Estágio em desenvolvimento web',
    descricao: 'Empresa busca estudante para estágio em programação com PHP e JavaScript. Bolsa de R$ 1.200/mês + vale transporte.',
    contato_nome: 'Tech Solutions',
    contato_email: 'rh@techsolutions.com',
    contato_telefone: '(12) 97777-4444',
    endereco: 'Jacareí — SP',
    preco: 1200, periodo: '/mês', tipo: 'EMPREGO',
    imagem_url: null, link_externo: 'https://www.vagas.com.br',
    selo_esg: 'Certificado de Competência ESG'
  },
  {
    titulo: 'Estágio em marketing digital',
    descricao: 'Agência busca estudante criativo para trabalhar com redes sociais e anúncios pagos. Bolsa de R$ 1.000/mês.',
    contato_nome: 'Agência Criativa',
    contato_email: 'rh@agenciacriativa.com',
    contato_telefone: '(12) 94444-7777',
    endereco: 'São José dos Campos — SP',
    preco: 1000, periodo: '/mês', tipo: 'EMPREGO',
    imagem_url: null, link_externo: 'https://www.indeed.com.br', selo_esg: null
  },
  {
    titulo: 'Estágio em suporte de TI',
    descricao: 'Empresa de tecnologia busca estagiário para suporte técnico e manutenção de redes. Bolsa de R$ 1.300/mês + benefícios.',
    contato_nome: 'InfoTech',
    contato_email: 'contato@infotech.com',
    contato_telefone: '(12) 91111-0000',
    endereco: 'Jacareí — SP',
    preco: 1300, periodo: '/mês', tipo: 'EMPREGO',
    imagem_url: null, link_externo: 'https://www.linkedin.com/jobs', selo_esg: null
  }
]

for (const a of anuncios) {
  inserirAnuncio.run(
    a.titulo, a.descricao, a.contato_nome, a.contato_email, a.contato_telefone,
    a.endereco, a.preco, a.periodo, a.tipo, a.imagem_url, a.link_externo, a.selo_esg
  )
}

/* ======== Setores do Campus ======== */
console.log('Inserindo setores do campus IFSP Jacareí...')

const inserirSetor = bd.prepare(`
  INSERT INTO campus_setores (nome, descricao, telefone, email, localizacao)
  VALUES (?, ?, ?, ?, ?)
`)

const setores = [
  ['Direção-Geral', 'Responsável pela gestão administrativa e acadêmica do campus.', '(12) 3958-1730', 'drg.jcr@ifsp.edu.br', 'Bloco Administrativo — Térreo'],
  ['Coordenadoria de Registros Acadêmicos (CRA)', 'Responsável por matrículas, históricos, diplomas e documentação acadêmica.', '(12) 3958-1730', 'cra.jcr@ifsp.edu.br', 'Bloco Administrativo — Térreo'],
  ['Coordenadoria Sociopedagógica (CSP)', 'Atendimento ao estudante, assistência estudantil, auxílios e acompanhamento pedagógico.', '(12) 3958-1730', 'csp.jcr@ifsp.edu.br', 'Bloco Administrativo — 1º Andar'],
  ['Biblioteca', 'Acervo físico e digital, empréstimos de livros, espaço de estudo individual e em grupo.', '(12) 3958-1730', 'bib.jcr@ifsp.edu.br', 'Bloco Acadêmico — Térreo'],
  ['Coordenadoria de Extensão', 'Projetos de extensão, cursos livres, eventos e atividades com a comunidade externa.', '(12) 3958-1730', 'cex.jcr@ifsp.edu.br', 'Bloco Administrativo — 1º Andar'],
  ['Coordenadoria de Pesquisa e Inovação', 'Apoio a projetos de pesquisa, iniciação científica e inovação tecnológica.', '(12) 3958-1730', 'cpq.jcr@ifsp.edu.br', 'Bloco Administrativo — 1º Andar'],
  ['Coordenadoria de Informática', 'Suporte técnico, laboratórios de informática e infraestrutura de TI do campus.', '(12) 3958-1730', 'cti.jcr@ifsp.edu.br', 'Bloco Administrativo — Térreo'],
  ['Grêmio Estudantil', 'Representação dos estudantes, organização de eventos estudantis e integração entre alunos.', null, 'gremio.jcr@ifsp.edu.br', 'Bloco Acadêmico — Espaço de Convivência']
]

for (const setor of setores) {
  inserirSetor.run(...setor)
}

console.log('Seed concluído com sucesso!')
console.log(`  - ${anuncios.length} anúncios inseridos (${anuncios.filter(a => a.selo_esg).length} com selo ESG)`)
console.log(`  - ${setores.length} setores do campus inseridos`)
