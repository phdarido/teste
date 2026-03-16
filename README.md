# Fala Calourada

Portal web informativo para centralizar a jornada estudantil de calouros e veteranos do **IFSP Jacareí**.

> **Projeto acadêmico** — Código: FC-001 | Prazo: Fev–Jul 2026 (1o semestre IFSP)

## O que é

A plataforma reúne informações sobre moradia, transporte, empregos, benefícios sociais e o campus do IFSP Jacareí. Ela **não realiza intermediação direta** — apenas informa e redireciona.

### Seções do site

| Aba | Descrição |
|-----|-----------|
| Moradia | Listagem de imóveis/quartos próximos ao campus |
| Transporte | Linhas de ônibus, caronas, horários |
| Empregos | Redirecionamento para vagas externas (sem candidatura interna) |
| Benefícios | Informações sobre PAP e auxílios da assistência estudantil |
| Campus | Setores, contatos, mapa e infraestrutura do IFSP Jacareí |

### Selos ESG

Anúncios podem ter um selo ESG opcional que confere **apenas destaque visual** nos resultados (sem benefício financeiro): Habitação Consciente, Eco-Friendly ou Certificado de Competência ESG.

## Stack Tecnológica

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| Frontend | HTML + CSS + JavaScript (vanilla) | Simples, sem build tools, acessível para alunos iniciantes |
| Backend | Node.js + Express | Framework popular, documentação extensa em PT-BR |
| Banco de dados | SQLite (via better-sqlite3) | Arquivo único, sem servidor externo, ideal para projetos acadêmicos |

## Pré-requisitos

- [Node.js](https://nodejs.org) versão 18 ou superior
- npm (vem junto com o Node.js)
- Git

## Instalação e Execução

```bash
# 1. Clone o repositório
git clone https://github.com/phdarido/teste.git
cd teste

# 2. Instale as dependências do backend
cd backend
npm install

# 3. Crie o arquivo de configuração
cp .env.example .env

# 4. Popule o banco com dados iniciais
npm run seed

# 5. Inicie o servidor
npm start
```

O servidor estará disponível em **http://localhost:3000**.

O frontend é servido automaticamente pelo backend — basta abrir o navegador no endereço acima.

### Modo desenvolvimento (com hot-reload)

```bash
cd backend
npm run dev
```

## Variáveis de Ambiente

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| PORT | 3000 | Porta do servidor |

Copie `.env.example` para `.env` e ajuste conforme necessário.

## Estrutura de Pastas

```
/
├── backend/
│   ├── server.js            # Servidor Express principal
│   ├── database.js          # Inicialização SQLite + criação de tabelas
│   ├── routes/
│   │   ├── anuncios.js      # GET/POST anúncios (moradia, transporte, emprego)
│   │   ├── campus.js        # GET setores do campus
│   │   └── beneficios.js    # GET benefícios sociais (dados estáticos)
│   ├── seeds/
│   │   └── seed.js          # Dados iniciais de exemplo
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── index.html           # Página principal (SPA-like)
│   ├── style.css            # Estilos mobile-first
│   └── script.js            # Lógica de navegação, cards e formulário
├── docs/
│   └── API.md               # Documentação dos endpoints
├── CONTRIBUTING.md           # Guia de contribuição
├── CHANGELOG.md              # Histórico de mudanças
└── README.md                 # Este arquivo
```

## Status Atual

- [x] Backend com API REST funcional
- [x] 5 abas de navegação (Moradia, Transporte, Empregos, Benefícios, Campus)
- [x] Cards com badges de selos ESG
- [x] Formulário de envio de anúncio (com moderação pendente)
- [x] Filtros por preço e selo ESG
- [x] Dados iniciais (seeds) para todas as seções
- [x] Layout mobile-first responsivo
- [x] Documentação completa

### Backlog (próximos passos sugeridos)

- [ ] Painel de administração para aprovar/rejeitar anúncios
- [ ] Autenticação de usuários (login/cadastro)
- [ ] Upload de imagens para anúncios
- [ ] Busca textual com campo de pesquisa
- [ ] Notificações por e-mail quando anúncio for aprovado
- [ ] Integração com API de mapas (localização dos imóveis)
- [ ] Testes automatizados (unitários e de integração)
- [ ] Deploy em servidor (Render, Railway ou similar)
