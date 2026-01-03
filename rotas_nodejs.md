# 🚀 Rotas do Projeto Node.js - Eneba API

Este documento lista todas as rotas disponíveis no projeto Node.js original.

## 📋 Resumo das Rotas

| Método | Rota | Descrição | Arquivo |
|--------|------|-----------|---------|
| `GET` | `/` | Rota raiz (backup) | `backup.js` |
| `GET` | `/Page` | Buscar páginas de jogos | `index.js`, `index_new.js` |
| `GET` | `/Graphql` | API externa (Catalysis Hub) | `index.js`, `index_new.js` |
| `GET` | `/Jogo` | Detalhes de jogo específico | `graphql.js` |

## 🔍 Detalhamento das Rotas

### 1. **GET `/Page`** - Buscar Páginas de Jogos
**Arquivos:** `index.js`, `index_new.js`

**Descrição:** Busca páginas de jogos da API Eneba com suporte a paginação, filtros e diferentes regiões.

**Parâmetros de Query:**
- `afterValue` (string, opcional): Cursor para paginação
- `sort_by` (string, opcional): Tipo de ordenação (padrão: "POPULARITY_DESC")
- `pesq` (string, opcional): Texto de busca
- `region` (string, opcional): Região para busca (padrão: "united_states")

**Exemplo de Uso:**
```bash
# Buscar primeira página do Brasil
GET /Page?region=brazil

# Buscar próxima página
GET /Page?afterValue=abc123&region=brazil

# Buscar com ordenação específica
GET /Page?sort_by=PRICE_ASC&region=brazil

# Buscar com texto específico
GET /Page?pesq=fifa&region=brazil
```

**Resposta:**
```json
{
  "totalCount": 1000,
  "edges": [
    {
      "node": {
        "shortId": "abc123",
        "name": "Nome do Jogo",
        "slug": "nome-do-jogo",
        "regions": [{"code": "brazil", "name": "Brazil"}],
        "cheapestAuction": {
          "price": {"amount": 5000, "currency": "BRL"}
        }
      }
    }
  ]
}
```

**Funcionalidades:**
- ✅ Suporte a múltiplas regiões
- ✅ Paginação com cursor
- ✅ Busca por texto
- ✅ Diferentes tipos de ordenação
- ✅ Filtros por DRM (Xbox)
- ✅ Moeda configurável (BRL)

---

### 2. **GET `/Jogo`** - Detalhes de Jogo Específico
**Arquivo:** `graphql.js`

**Descrição:** Busca detalhes completos de um jogo específico usando seu slug.

**Parâmetros de Query:**
- `slugGame` (string, obrigatório): Slug do jogo
- `linkGame` (string, opcional): Link do jogo (não utilizado)

**Exemplo de Uso:**
```bash
# Buscar detalhes de um jogo
GET /Jogo?slugGame=nome-do-jogo
```

**Resposta:**
```json
{
  "data": {
    "product": {
      "name": "Nome do Jogo",
      "slug": "nome-do-jogo",
      "description": "Descrição do jogo...",
      "price": {"amount": 5000, "currency": "BRL"},
      "images": [...],
      "reviews": [...],
      "merchant": {...}
    }
  }
}
```

**Funcionalidades:**
- ✅ Detalhes completos do produto
- ✅ Informações de preço
- ✅ Avaliações de comerciantes
- ✅ Imagens do produto
- ✅ Informações de disponibilidade

---

### 3. **GET `/Graphql`** - API Externa (Catalysis Hub)
**Arquivos:** `index.js`, `index_new.js`

**Descrição:** Rota para API externa do Catalysis Hub (não relacionada ao Eneba).

**Parâmetros de Query:**
- `searchAfter` (string, opcional): Cursor para paginação

**Exemplo de Uso:**
```bash
# Buscar reações químicas
GET /Graphql?searchAfter=cursor123
```

**Resposta:**
```json
{
  "data": {
    "reactions": {
      "totalCount": 100,
      "edges": [
        {
          "node": {
            "Equation": "H2 + O2 -> H2O",
            "reactionEnergy": 0.5,
            "activationEnergy": 1.2
          }
        }
      ]
    }
  }
}
```

**Nota:** Esta rota não está relacionada ao Eneba e parece ser um teste ou integração externa.

---

### 4. **GET `/`** - Rota Raiz (Backup)
**Arquivo:** `backup.js`

**Descrição:** Rota de backup com configuração hardcoded para o Brasil.

**Parâmetros:** Nenhum

**Exemplo de Uso:**
```bash
# Buscar jogos do Brasil (configuração fixa)
GET /
```

**Resposta:** Mesma estrutura da rota `/Page`

**Funcionalidades:**
- ✅ Configuração fixa para Brasil
- ✅ Query GraphQL completa
- ✅ Headers de autenticação
- ✅ Suporte a paginação

---

## 🔄 Migração para Python

### Equivalências de Rotas

| Rota Node.js | Método Python | Descrição |
|--------------|---------------|-----------|
| `GET /Page` | `buscar_pagina()` | Buscar páginas de jogos |
| `GET /Jogo` | `buscar_detalhes_jogo()` | Detalhes de jogo específico |
| `GET /` (backup) | `buscar_pagina(region="brazil")` | Busca com região fixa |

### Exemplo de Migração

**Node.js:**
```javascript
// Buscar página do Brasil
fetch('/Page?region=brazil&afterValue=abc123')
  .then(response => response.json())
  .then(data => console.log(data));
```

**Python:**
```python
# Buscar página do Brasil
api = EnebaAPI()
page_data = api.buscar_pagina(region="brazil", after_value="abc123")
games = api.extrair_jogos_da_pagina(page_data, "brazil")
```

## 📊 Estatísticas das Rotas

### Uso por Arquivo
- **`index.js`**: 2 rotas principais (`/Page`, `/Graphql`)
- **`index_new.js`**: 2 rotas principais (versão atualizada)
- **`graphql.js`**: 1 rota (`/Jogo`)
- **`backup.js`**: 1 rota (`/`)

### Funcionalidades por Rota
- **`/Page`**: Mais completa, suporte a múltiplas regiões
- **`/Jogo`**: Específica para detalhes de produtos
- **`/Graphql`**: API externa (não relacionada ao Eneba)
- **`/`**: Backup com configuração fixa

## 🚨 Notas Importantes

1. **Portas Diferentes:**
   - `index.js` e `index_new.js`: Porta 3000
   - `backup.js`: Porta 5000

2. **Configurações:**
   - `index.js`: Suporte a múltiplas regiões
   - `index_new.js`: Configuração fixa para Brasil
   - `backup.js`: Configuração hardcoded com autenticação

3. **Headers:**
   - Cada rota usa headers específicos
   - `backup.js` inclui cookies de autenticação
   - Headers são configurados para simular navegador

4. **APIs Externas:**
   - `/Page` e `/Jogo`: API do Eneba (`https://www.eneba.com/graphql/`)
   - `/Graphql`: API do Catalysis Hub (`https://api.catalysis-hub.org/graphql/`)

## 🔧 Configuração do Servidor

### Para Executar
```bash
# Rota principal
node index.js

# Rota de backup
node backup.js

# Rota atualizada
node index_new.js
```

### Dependências
```json
{
  "express": "^4.18.2",
  "axios": "^1.12.2",
  "node-fetch": "^3.3.2"
}
```

---

**Total de Rotas:** 4 rotas principais
**APIs Integradas:** 2 (Eneba + Catalysis Hub)
**Suporte a Regiões:** 45+ regiões
**Funcionalidades:** Busca, paginação, detalhes, filtros
