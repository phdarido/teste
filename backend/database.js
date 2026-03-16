/**
 * @file database.js
 * @description Inicialização e configuração do banco de dados SQLite.
 *
 * Usamos SQLite (via better-sqlite3) por ser leve, sem necessidade de
 * servidor externo, e ideal para projetos acadêmicos.
 * O arquivo do banco é criado automaticamente em ./fala_calourada.db
 */

const Database = require('better-sqlite3')
const path = require('path')

/** Caminho do arquivo do banco de dados */
const CAMINHO_BD = path.join(__dirname, 'fala_calourada.db')

/** Instância única do banco (padrão Singleton) */
const bd = new Database(CAMINHO_BD)

// Ativa WAL para melhor desempenho em leituras concorrentes
bd.pragma('journal_mode = WAL')
bd.pragma('foreign_keys = ON')

/**
 * Cria todas as tabelas do sistema caso ainda não existam.
 * Chamado automaticamente ao iniciar o servidor.
 */
function criarTabelas() {
  bd.exec(`
    /* Tabela principal de anúncios (moradia, transporte, emprego) */
    CREATE TABLE IF NOT EXISTS anuncios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      descricao TEXT NOT NULL,
      contato_nome TEXT NOT NULL,
      contato_email TEXT,
      contato_telefone TEXT,
      endereco TEXT,
      preco REAL,
      periodo TEXT,
      tipo TEXT NOT NULL CHECK(tipo IN ('MORADIA', 'TRANSPORTE', 'EMPREGO')),
      imagem_url TEXT,
      link_externo TEXT,
      status TEXT NOT NULL DEFAULT 'pendente' CHECK(status IN ('pendente', 'aprovado', 'rejeitado')),
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    /*
     * Selos ESG — conferem apenas VISIBILIDADE nos resultados.
     * Não há qualquer benefício financeiro associado.
     */
    CREATE TABLE IF NOT EXISTS selos_esg (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL UNIQUE,
      descricao TEXT NOT NULL,
      icone TEXT NOT NULL
    );

    /* Relação N:N entre anúncios e selos ESG */
    CREATE TABLE IF NOT EXISTS anuncio_selos (
      anuncio_id INTEGER NOT NULL,
      selo_id INTEGER NOT NULL,
      PRIMARY KEY (anuncio_id, selo_id),
      FOREIGN KEY (anuncio_id) REFERENCES anuncios(id) ON DELETE CASCADE,
      FOREIGN KEY (selo_id) REFERENCES selos_esg(id) ON DELETE CASCADE
    );

    /* Setores do campus IFSP Jacareí */
    CREATE TABLE IF NOT EXISTS campus_setores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descricao TEXT,
      telefone TEXT,
      email TEXT,
      localizacao TEXT
    );
  `)
}

// Cria tabelas ao importar o módulo
criarTabelas()

module.exports = bd
