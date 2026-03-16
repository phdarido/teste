# Changelog — Fala Calourada

## [1.0.0] — 2026-03-16

### Adicionado

**Backend (novo)**
- Servidor Node.js + Express com API REST completa
- Banco de dados SQLite com tabelas: anuncios, campus_setores
- Endpoints: GET /health, /api/moradia, /api/transporte, /api/empregos, /api/anuncios, /api/campus, /api/beneficios
- Endpoint POST /api/anuncios com validação de campos obrigatórios e mensagens em PT-BR
- Sistema de moderação: anúncios novos ficam com status "pendente"
- Selos ESG simplificados: campo direto no anúncio (sem tabelas extras)
- Seeds com dados de exemplo: 10 anúncios, 3 selos ESG, 8 setores do campus, 5 benefícios sociais

**Frontend (evoluído)**
- Navegação por 5 abas: Moradia, Transporte, Empregos, Benefícios, Campus
- Menu hambúrguer responsivo para mobile
- Cards de anúncio com badges visuais de selos ESG
- Filtros por preço máximo e selo ESG
- Formulário de envio de anúncio com validação client-side
- Seção de Benefícios Sociais (PAP e auxílios) com fallback offline
- Guia do Campus com layout accordion
- Tags semânticas HTML5, meta tags SEO e Open Graph
- CSS mobile-first com breakpoints para tablet e desktop

**Documentação**
- README.md com instalação, execução e estrutura de pastas
- CONTRIBUTING.md com convenções de commit e fluxo de branches
- docs/API.md com documentação de todos os endpoints e exemplos cURL
- CHANGELOG.md com registro de mudanças
- Comentários JSDoc em PT-BR em todo o código

### Corrigido
- Nome do projeto: "Fala Calorada" corrigido para "Fala Calourada"

### Removido
- Dados hardcoded no frontend (agora vêm da API)
- Botões "Entrar" e "Cadastro" (fora do escopo atual)

## [0.1.0] — 2026 (versão inicial)

### Adicionado
- Página HTML única com cards de anúncios
- Filtro por categoria e preço
- Animação de expansão dos cards
