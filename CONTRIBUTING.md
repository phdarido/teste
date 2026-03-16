# Guia de Contribuição — Fala Calourada

Obrigado por contribuir com o projeto! Este guia ajuda a manter o código organizado e facilitar o trabalho em equipe.

## Como configurar o ambiente

1. Faça um fork do repositório
2. Clone o fork: `git clone https://github.com/SEU-USUARIO/teste.git`
3. Siga as instruções de instalação do README.md
4. Crie uma branch para sua feature: `git checkout -b feat/minha-feature`

## Convenções de Commits

Usamos prefixos nos commits para facilitar o entendimento do histórico:

| Prefixo | Quando usar | Exemplo |
|---------|-------------|---------|
| `feat:` | Nova funcionalidade | `feat: adicionar filtro por bairro` |
| `fix:` | Correção de bug | `fix: corrigir filtro de preço não funcionando` |
| `docs:` | Documentação | `docs: atualizar README com novas instruções` |
| `style:` | Formatação/CSS (sem mudança de lógica) | `style: ajustar espaçamento dos cards` |
| `refactor:` | Refatoração de código | `refactor: extrair função de validação` |
| `seed:` | Alteração nos dados iniciais | `seed: adicionar novos setores do campus` |

## Fluxo de Branches

```
main                    ← branch principal (protegida)
  └── feat/nome-da-feature  ← sua branch de trabalho
```

1. Sempre crie sua branch a partir da `main`
2. Faça commits pequenos e frequentes
3. Abra um Pull Request quando terminar
4. Peça revisão de pelo menos 1 colega

## Como adicionar uma nova seção ao site

1. **Backend:** Crie um novo arquivo em `backend/routes/` com a rota GET
2. **Backend:** Registre a rota em `backend/server.js` (`app.use('/api', novaRota)`)
3. **Frontend:** Adicione o botão de navegação no `index.html`
4. **Frontend:** Adicione a seção HTML no `<main>`
5. **Frontend:** Adicione a lógica de carregamento no `script.js`
6. **Docs:** Atualize o `docs/API.md` com o novo endpoint

## Como adicionar um novo selo ESG

1. Adicione o novo valor no CHECK constraint da coluna `selo_esg` em `backend/database.js`
2. Adicione o novo selo no array `SELOS_ESG` em `frontend/script.js`
3. Pronto — o filtro e o formulário já vão mostrar o novo selo

## Regras gerais

- Comentários e variáveis em **PT-BR**
- Mantenha a simplicidade — o projeto é para alunos, não devs experientes
- Não quebre o que já funciona — teste antes de abrir PR
- Não adicione dependências sem discussão prévia com o time
