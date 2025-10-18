# 🎮 Script de Paginação da API Eneba

Este script permite paginar todas as páginas da API `/Page` e extrair os slugs dos jogos em formato JSON.

## 📁 Arquivos Gerados

### `paginate_games.js`
Script principal que faz a paginação completa da API e extrai todos os dados dos jogos.

### Arquivos de Saída:
- **`games_slugs.json`** - Arquivo completo com todos os dados dos jogos (2.4MB)
- **`game_slugs_only.json`** - Apenas os slugs em formato JSON
- **`game_slugs.txt`** - Apenas os slugs em formato texto (um por linha)
- **`unique_game_slugs.json`** - Slugs únicos em formato JSON
- **`unique_game_slugs.txt`** - Slugs únicos em formato texto

## 🚀 Como Usar

### 1. Executar Paginação Completa
```bash
node paginate_games.js
```

### 2. Executar com Retomada (se interrompido)
```bash
node paginate_games.js --resume
```

## 📊 Resultados da Execução

- **Total de páginas processadas:** 500
- **Total de registros coletados:** 10.000
- **Slugs únicos encontrados:** 20
- **Duplicatas removidas:** 9.980

## 🔍 Observações Importantes

1. **Paginação Limitada:** A API retorna apenas 20 jogos únicos, mas o script processa 500 páginas (10.000 registros) porque a API repete os mesmos jogos.

2. **Slugs Únicos:** Apenas 20 slugs únicos foram encontrados:
   - `xbox-minecraft-legends-xbox-live-key-brazil`
   - `xbox-sekiro-shadows-die-twice-goty-edition-xbox-live-key-brazil`
   - `xbox-ea-sports-fc-26-standard-edition-xbox-series-x-s-xbox-live-key-brazil`
   - E mais 17 outros...

3. **Progresso:** O script salva o progresso a cada 10 páginas no arquivo `progress.json`.

4. **Rate Limiting:** O script inclui uma pausa de 100ms entre requisições para não sobrecarregar a API.

## 📋 Estrutura dos Dados

### games_slugs.json
```json
{
  "metadata": {
    "totalGames": 10000,
    "totalPages": 500,
    "generatedAt": "2025-10-17T02:52:07.148Z",
    "apiUrl": "http://localhost:3000/Page"
  },
  "games": [
    {
      "slug": "xbox-minecraft-legends-xbox-live-key-brazil",
      "name": "Minecraft Legends XBOX LIVE Key BRAZIL",
      "shortId": "18hjhxfz9we65mcw8k51biwnrr",
      "price": 375,
      "currency": "BRL"
    }
  ]
}
```

### unique_game_slugs.json
```json
{
  "metadata": {
    "totalUniqueSlugs": 20,
    "totalRecords": 10000,
    "duplicates": 9980,
    "generatedAt": "2025-10-17T02:52:07.148Z"
  },
  "uniqueSlugs": [
    "xbox-minecraft-legends-xbox-live-key-brazil",
    "xbox-sekiro-shadows-die-twice-goty-edition-xbox-live-key-brazil"
  ]
}
```

## ⚙️ Configurações

- **Jogos por página:** 20
- **Máximo de jogos:** 10.000
- **Pausa entre requisições:** 100ms
- **Salvamento de progresso:** A cada 10 páginas

## 🛠️ Dependências

- `node-fetch` - Para fazer requisições HTTP
- `fs` - Para manipulação de arquivos (nativo do Node.js)

## 📝 Notas

- O script funciona com a API local rodando em `http://localhost:3000`
- Todos os arquivos são salvos no diretório atual
- O script pode ser interrompido e retomado usando `--resume`
- Os arquivos de progresso são removidos automaticamente após conclusão

