# Documentação da API — Fala Calourada

Base URL: `http://localhost:3000`

Todas as respostas seguem o formato:
```json
{
  "sucesso": true,
  "dados": [...]
}
```

Em caso de erro:
```json
{
  "sucesso": false,
  "erro": "Mensagem de erro em PT-BR"
}
```

---

## GET /health

Verifica se o servidor está funcionando.

```bash
curl http://localhost:3000/health
```

**Resposta:**
```json
{
  "status": "ok",
  "mensagem": "Servidor Fala Calourada funcionando!"
}
```

---

## GET /api/moradia

Lista anúncios aprovados do tipo MORADIA.

```bash
curl http://localhost:3000/api/moradia
```

**Parâmetros opcionais:** `?selo=Habitação Consciente`

---

## GET /api/transporte

Lista anúncios aprovados do tipo TRANSPORTE.

```bash
curl http://localhost:3000/api/transporte
```

**Parâmetros opcionais:** `?selo=Eco-Friendly`

---

## GET /api/empregos

Lista anúncios aprovados do tipo EMPREGO. Apenas informativo — contém link externo para a vaga.

```bash
curl http://localhost:3000/api/empregos
```

---

## GET /api/anuncios

Lista todos os anúncios aprovados com filtros opcionais.

```bash
# Todos os anúncios
curl http://localhost:3000/api/anuncios

# Filtrar por tipo
curl "http://localhost:3000/api/anuncios?tipo=MORADIA"

# Filtrar por selo ESG
curl "http://localhost:3000/api/anuncios?selo=Eco-Friendly"

# Combinar filtros
curl "http://localhost:3000/api/anuncios?tipo=TRANSPORTE&selo=Eco-Friendly"
```

**Resposta de exemplo:**
```json
{
  "sucesso": true,
  "dados": [
    {
      "id": 1,
      "titulo": "Dividir apartamento perto da faculdade",
      "descricao": "Quarto disponível em apartamento mobiliado...",
      "contato_nome": "Ana Paula",
      "contato_email": "ana@email.com",
      "contato_telefone": "(12) 98888-3333",
      "endereco": "Rua das Flores, 123",
      "preco": 800,
      "periodo": "/mês",
      "tipo": "MORADIA",
      "imagem_url": null,
      "link_externo": null,
      "selo_esg": "Habitação Consciente",
      "status": "aprovado",
      "criado_em": "2026-03-16 14:00:00"
    }
  ]
}
```

---

## POST /api/anuncios

Cria um novo anúncio com status **pendente** (aguardando moderação).

```bash
curl -X POST http://localhost:3000/api/anuncios \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Quarto para alugar",
    "descricao": "Quarto mobiliado perto do IFSP",
    "contato_nome": "Maria",
    "contato_email": "maria@email.com",
    "tipo": "MORADIA",
    "preco": 750,
    "periodo": "/mês",
    "selo_esg": "Habitação Consciente"
  }'
```

**Campos obrigatórios:**
- `titulo` (texto)
- `descricao` (texto)
- `contato_nome` (texto)
- `tipo` ("MORADIA", "TRANSPORTE" ou "EMPREGO")

**Campos opcionais:**
- `contato_email`, `contato_telefone`, `endereco`, `preco`, `periodo`, `imagem_url`, `link_externo`
- `selo_esg` (texto: "Habitação Consciente", "Eco-Friendly" ou "Certificado de Competência ESG")

**Resposta de sucesso (201):**
```json
{
  "sucesso": true,
  "mensagem": "Anúncio enviado com sucesso! Ele ficará pendente até ser aprovado pela moderação.",
  "id": 11
}
```

**Resposta de erro (400):**
```json
{
  "sucesso": false,
  "erros": ["O campo \"título\" é obrigatório.", "O campo \"tipo\" é obrigatório."]
}
```

---

## GET /api/campus

Lista os setores do campus IFSP Jacareí.

```bash
curl http://localhost:3000/api/campus
```

**Resposta de exemplo:**
```json
{
  "sucesso": true,
  "dados": [
    {
      "id": 1,
      "nome": "Biblioteca",
      "descricao": "Acervo físico e digital, empréstimos de livros...",
      "telefone": "(12) 3958-1730",
      "email": "bib.jcr@ifsp.edu.br",
      "localizacao": "Bloco Acadêmico — Térreo"
    }
  ]
}
```

---

## GET /api/beneficios

Retorna informações sobre benefícios sociais (PAP, auxílios).

```bash
curl http://localhost:3000/api/beneficios
```

---

## Selos ESG

Os selos ESG são valores fixos armazenados diretamente no campo `selo_esg` de cada anúncio. Valores válidos:

- `Habitação Consciente` — imóveis sustentáveis
- `Eco-Friendly` — transportes e empresas sustentáveis
- `Certificado de Competência ESG` — boas práticas ESG

Os selos conferem apenas maior visibilidade (anúncios com selo aparecem primeiro nos resultados).
