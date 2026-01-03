# 🌍 Regiões Suportadas pela API Eneba

Esta lista contém todas as regiões suportadas pela API do Eneba, organizadas por categoria e com informações adicionais.

## 📋 Lista Completa de Regiões

### 🌎 Regiões Globais
- `global` - Global
- `row` - Rest of World (Resto do Mundo)

### 🌍 Regiões Continentais
- `europe` - Europa
- `asia` - Ásia
- `latam` - América Latina
- `north_america` - América do Norte
- `emea` - Europa, Oriente Médio e África
- `middle_east` - Oriente Médio

### 🇺🇸 América do Norte
- `united_states` - Estados Unidos
- `canada` - Canadá
- `mexico` - México

### 🇧🇷 América do Sul
- `brazil` - Brasil
- `argentina` - Argentina
- `colombia` - Colômbia
- `chile` - Chile

### 🇪🇺 Europa
- `united_kingdom` - Reino Unido
- `germany` - Alemanha
- `france` - França
- `spain` - Espanha
- `italy` - Itália
- `netherlands` - Países Baixos
- `sweden` - Suécia
- `norway` - Noruega
- `denmark` - Dinamarca
- `poland` - Polônia
- `austria` - Áustria
- `czech_republic` - República Tcheca
- `belgium` - Bélgica
- `greece` - Grécia
- `hungary` - Hungria
- `luxembourg` - Luxemburgo
- `portugal` - Portugal
- `switzerland` - Suíça

### 🌏 Ásia
- `japan` - Japão
- `south_korea` - Coreia do Sul
- `taiwan` - Taiwan
- `singapore` - Singapura
- `hong_kong` - Hong Kong
- `india` - Índia
- `philippines` - Filipinas
- `vietnam` - Vietnã
- `thailand` - Tailândia

### 🌍 Oriente Médio e África
- `turkey` - Turquia
- `saudi_arabia` - Arábia Saudita
- `united_arab_emirates` - Emirados Árabes Unidos
- `egypt` - Egito
- `south_africa` - África do Sul
- `nigeria` - Nigéria

### 🌏 Oceania
- `australia` - Austrália
- `new_zealand` - Nova Zelândia

### 🇺🇦 Europa Oriental
- `ukraine` - Ucrânia

## 🏆 Regiões Prioritárias (Baseadas em Dados Reais)

As seguintes regiões são consideradas prioritárias por terem mais jogos disponíveis:

| Posição | Região | Código | Jogos Esperados | Páginas Máx |
|---------|--------|--------|-----------------|-------------|
| 1 | Argentina | `argentina` | 7.095 | 50 |
| 2 | Europa | `europe` | 5.066 | 50 |
| 3 | Estados Unidos | `united_states` | 3.581 | 50 |
| 4 | Turquia | `turkey` | 2.927 | 50 |
| 5 | Global | `global` | 1.613 | 50 |
| 6 | Reino Unido | `united_kingdom` | 1.162 | 50 |
| 7 | México | `mexico` | 837 | 50 |
| 8 | Colômbia | `colombia` | 752 | 50 |
| 9 | Brasil | `brazil` | 712 | 50 |
| 10 | Canadá | `canada` | 427 | 30 |
| 11 | Índia | `india` | 322 | 20 |
| 12 | Egito | `egypt` | 221 | 15 |
| 13 | Chile | `chile` | 127 | 10 |
| 14 | Austrália | `australia` | 119 | 10 |
| 15 | América Latina | `latam` | 111 | 10 |

## 💻 Como Usar as Regiões

### Exemplo Básico
```python
from eneba_api import EnebaAPI

api = EnebaAPI()

# Buscar jogos do Brasil
games_br = api.paginar_jogos(region="brazil", max_pages=5)

# Buscar jogos da Argentina
games_ar = api.paginar_jogos(region="argentina", max_pages=5)

# Buscar jogos dos Estados Unidos
games_us = api.paginar_jogos(region="united_states", max_pages=5)
```

### Exemplo com Múltiplas Regiões
```python
# Lista de regiões para testar
regions_to_test = [
    "brazil",
    "argentina", 
    "united_states",
    "europe",
    "germany",
    "france",
    "japan",
    "australia"
]

all_games = []

for region in regions_to_test:
    print(f"Buscando jogos de: {region}")
    games = api.paginar_jogos(region=region, max_pages=3)
    all_games.extend(games)
    print(f"Encontrados: {len(games)} jogos")
```

### Exemplo com Busca por Texto
```python
# Buscar FIFA em diferentes regiões
search_term = "fifa"
regions = ["brazil", "argentina", "united_states"]

for region in regions:
    games = api.paginar_jogos(
        region=region, 
        search_text=search_term, 
        max_pages=2
    )
    print(f"FIFA em {region}: {len(games)} jogos")
```

## 📊 Estatísticas por Região

### Regiões com Mais Jogos (Top 10)
1. **Argentina** - 7.095 jogos esperados
2. **Europa** - 5.066 jogos esperados
3. **Estados Unidos** - 3.581 jogos esperados
4. **Turquia** - 2.927 jogos esperados
5. **Global** - 1.613 jogos esperados
6. **Reino Unido** - 1.162 jogos esperados
7. **México** - 837 jogos esperados
8. **Colômbia** - 752 jogos esperados
9. **Brasil** - 712 jogos esperados
10. **Canadá** - 427 jogos esperados

### Regiões por Continente

#### 🌎 América (8 regiões)
- `united_states`, `canada`, `mexico`, `brazil`, `argentina`, `colombia`, `chile`, `latam`

#### 🇪🇺 Europa (18 regiões)
- `europe`, `united_kingdom`, `germany`, `france`, `spain`, `italy`, `netherlands`, `sweden`, `norway`, `denmark`, `poland`, `austria`, `czech_republic`, `belgium`, `greece`, `hungary`, `luxembourg`, `portugal`, `switzerland`, `ukraine`

#### 🌏 Ásia (9 regiões)
- `asia`, `japan`, `south_korea`, `taiwan`, `singapore`, `hong_kong`, `india`, `philippines`, `vietnam`

#### 🌍 Oriente Médio e África (6 regiões)
- `middle_east`, `turkey`, `saudi_arabia`, `united_arab_emirates`, `egypt`, `south_africa`, `nigeria`

#### 🌏 Oceania (2 regiões)
- `australia`, `new_zealand`

#### 🌍 Global (2 regiões)
- `global`, `row`

## ⚠️ Notas Importantes

1. **Disponibilidade**: Nem todas as regiões podem ter jogos disponíveis a qualquer momento
2. **Idioma**: A maioria das regiões usa inglês como idioma padrão
3. **Moeda**: A moeda padrão é BRL (Real Brasileiro), mas pode variar por região
4. **Rate Limiting**: Use pausas entre requisições para diferentes regiões
5. **Teste**: Sempre teste com poucas páginas primeiro para verificar disponibilidade

## 🔍 Verificação de Regiões

Para verificar quais regiões estão disponíveis no momento:

```python
from eneba_api import EnebaAPI

api = EnebaAPI()

# Testar algumas regiões
test_regions = ["brazil", "argentina", "united_states", "europe"]

for region in test_regions:
    try:
        page_data = api.buscar_pagina(region=region)
        if page_data and page_data.get("results"):
            games = api.extrair_jogos_da_pagina(page_data, region)
            print(f"✅ {region}: {len(games)} jogos disponíveis")
        else:
            print(f"❌ {region}: Nenhum jogo disponível")
    except Exception as e:
        print(f"❌ {region}: Erro - {e}")
```

---

**Total de Regiões Suportadas: 45+ regiões**

Esta lista é baseada na análise do código Node.js original e na documentação da API do Eneba. As regiões podem variar dependendo da disponibilidade e políticas da plataforma.
