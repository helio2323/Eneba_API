# EnebaAPI - Classe Python para API do Eneba

Esta classe Python consolida todas as funcionalidades do projeto Node.js original, permitindo interagir diretamente com a API do Eneba sem necessidade de servidor intermediário.

## 🚀 Características

- **Busca direta**: Consome a API do Eneba diretamente via GraphQL
- **Paginação automática**: Suporte completo para paginação de resultados
- **Múltiplas regiões**: Suporte para todas as regiões disponíveis no Eneba
- **Detalhes de jogos**: Busca informações detalhadas de jogos específicos
- **Análise estatística**: Funções para análise dos dados coletados
- **Rate limiting**: Controle automático de requisições para evitar bloqueios

## 📦 Instalação

```bash
# Instalar dependências
pip install requests

# Ou usando requirements.txt
pip install -r requirements.txt
```

## 🔧 Uso Básico

```python
from eneba_api import EnebaAPI

# Criar instância da API
api = EnebaAPI()

# Buscar uma página de jogos
page_data = api.buscar_pagina(region="brazil")
games = api.extrair_jogos_da_pagina(page_data, "brazil")

# Paginar múltiplas páginas
all_games = api.paginar_jogos(max_pages=10, region="brazil")

# Buscar detalhes de um jogo específico
details = api.buscar_detalhes_jogo("nome-do-jogo")
```

## 📋 Métodos Principais

### `buscar_pagina(after_value, sort_by, search_text, region)`
Busca uma página específica de jogos.

**Parâmetros:**
- `after_value` (str, opcional): Cursor para paginação
- `sort_by` (str): Tipo de ordenação (padrão: "POPULARITY_DESC")
- `search_text` (str): Texto de busca
- `region` (str): Região para busca (padrão: "united_states")

**Retorna:** Dados da página ou None em caso de erro

### `extrair_jogos_da_pagina(page_data, region)`
Extrai informações dos jogos de uma página.

**Parâmetros:**
- `page_data` (dict): Dados da página retornados pela API
- `region` (str): Região dos jogos

**Retorna:** Lista de objetos `GameInfo`

### `paginar_jogos(max_pages, sort_by, search_text, region)`
Pagina através de múltiplas páginas de jogos.

**Parâmetros:**
- `max_pages` (int): Número máximo de páginas (padrão: 50)
- `sort_by` (str): Tipo de ordenação
- `search_text` (str): Texto de busca
- `region` (str): Região para busca

**Retorna:** Lista de todos os jogos encontrados

### `buscar_detalhes_jogo(slug)`
Busca detalhes específicos de um jogo.

**Parâmetros:**
- `slug` (str): Slug do jogo

**Retorna:** Detalhes do jogo ou None em caso de erro

### `paginar_todas_regioes(max_pages_per_region)`
Pagina jogos de todas as regiões suportadas.

**Parâmetros:**
- `max_pages_per_region` (int): Número máximo de páginas por região

**Retorna:** Dicionário com estatísticas e jogos de todas as regiões

## 🌍 Regiões Suportadas

A classe suporta todas as regiões disponíveis no Eneba:

- `brazil` - Brasil
- `united_states` - Estados Unidos
- `argentina` - Argentina
- `europe` - Europa
- `united_kingdom` - Reino Unido
- `germany` - Alemanha
- `france` - França
- `japan` - Japão
- `australia` - Austrália
- `canada` - Canadá
- `mexico` - México
- E muitas outras...

## 📊 Exemplo Completo

```python
from eneba_api import EnebaAPI
import json

# Criar instância
api = EnebaAPI()

# Buscar jogos do Brasil
print("Buscando jogos do Brasil...")
brazil_games = api.paginar_jogos(max_pages=5, region="brazil")

print(f"Encontrados {len(brazil_games)} jogos")

# Mostrar alguns exemplos
for i, game in enumerate(brazil_games[:5], 1):
    price = f"R$ {game.price/100:.2f}" if game.price else "N/A"
    print(f"{i}. {game.name} - {price}")

# Obter estatísticas
stats = api.obter_estatisticas(brazil_games)
print(f"\nEstatísticas:")
print(f"Total: {stats['total_games']} jogos")
print(f"Regiões únicas: {stats['unique_regions']}")

# Salvar dados
data = {
    "metadata": {
        "total_games": len(brazil_games),
        "region": "brazil",
        "collected_at": "2024-01-01 12:00:00"
    },
    "games": [
        {
            "slug": game.slug,
            "name": game.name,
            "price": game.price,
            "region": game.region
        }
        for game in brazil_games
    ]
}

api.salvar_jogos_json(data, "jogos_brasil.json")
```

## 🔍 Busca por Texto

```python
# Buscar jogos específicos
fifa_games = api.paginar_jogos(
    max_pages=3, 
    search_text="fifa", 
    region="brazil"
)

print(f"Encontrados {len(fifa_games)} jogos com 'fifa'")
```

## 📈 Análise de Múltiplas Regiões

```python
# Buscar jogos de todas as regiões prioritárias
all_regions_data = api.paginar_todas_regioes(max_pages_per_region=10)

print(f"Total de jogos: {all_regions_data['metadata']['total_games']}")
print(f"Jogos únicos: {all_regions_data['metadata']['unique_games']}")

# Salvar dados completos
api.salvar_jogos_json(all_regions_data, "todas_regioes.json")
```

## ⚙️ Configurações Avançadas

### Personalizar Headers
```python
api = EnebaAPI()
api.session.headers.update({
    "User-Agent": "MeuApp/1.0"
})
```

### Alterar Configurações Padrão
```python
api = EnebaAPI()
api.default_currency = "USD"
api.default_language = "pt"
api.games_per_page = 50
```

## 🚨 Considerações Importantes

1. **Rate Limiting**: A API tem limitações de taxa. A classe inclui pausas automáticas, mas use com moderação.

2. **Regiões**: Nem todas as regiões podem ter jogos disponíveis. Teste com diferentes regiões.

3. **Erros**: Sempre verifique se os métodos retornaram dados válidos antes de processar.

4. **Conexão**: Requer conexão com a internet para funcionar.

5. **Dados**: Os preços são retornados em centavos (ex: 1000 = R$ 10,00).

## 📝 Estrutura de Dados

### GameInfo
```python
@dataclass
class GameInfo:
    slug: str              # Slug único do jogo
    name: str              # Nome do jogo
    short_id: str          # ID curto para paginação
    price: Optional[float] # Preço em centavos
    currency: str          # Moeda (padrão: BRL)
    region: Optional[str]  # Código da região
    region_name: Optional[str] # Nome da região
    context: Optional[str] # Contexto da busca
```

## 🧪 Testes

Execute o arquivo de exemplo para testar todas as funcionalidades:

```bash
python exemplo_uso.py
```

## 📄 Arquivos

- `eneba_api.py` - Classe principal
- `exemplo_uso.py` - Exemplos de uso
- `README_Python.md` - Esta documentação

## 🔄 Migração do Node.js

Esta classe Python substitui completamente o servidor Node.js original:

| Node.js | Python |
|---------|--------|
| `GET /Page` | `buscar_pagina()` |
| `GET /Jogo` | `buscar_detalhes_jogo()` |
| `paginate_games.js` | `paginar_jogos()` |
| `paginate_all_regions.js` | `paginar_todas_regioes()` |

## 🤝 Contribuição

Para contribuir com melhorias:

1. Faça fork do projeto
2. Crie uma branch para sua feature
3. Implemente as mudanças
4. Teste com `exemplo_uso.py`
5. Faça pull request

## 📞 Suporte

Em caso de problemas:

1. Verifique sua conexão com a internet
2. Teste com `exemplo_uso.py`
3. Verifique os logs de erro
4. Consulte a documentação da API do Eneba

---

**Nota**: Esta classe é para fins educacionais e de pesquisa. Respeite os termos de uso da API do Eneba.
