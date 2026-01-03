import requests
import json
import time
from typing import List, Dict, Optional, Any
from dataclasses import dataclass
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class GameInfo:
    """Classe para representar informações de um jogo"""
    slug: str
    name: str
    short_id: str
    price: Optional[float] = None
    currency: str = 'BRL'
    region: Optional[str] = None
    region_name: Optional[str] = None
    context: Optional[str] = None

@dataclass
class RegionConfig:
    """Classe para configuração de região"""
    region: str
    name: str
    country: str
    max_pages: int = 50
    expected_games: Optional[int] = None

class EnebaAPI:
    """
    Classe para interagir com a API do Eneba diretamente.
    Consolida todas as funcionalidades de busca de páginas, paginação e detalhes de jogos.
    """
    
    def __init__(self, base_url: str = "https://www.eneba.com/graphql/"):
        self.base_url = base_url
        self.session = requests.Session()
        self._setup_headers()
        
        # Configurações padrão
        self.games_per_page = 20
        self.default_currency = "BRL"
        self.default_language = "en"
        
        # Regiões suportadas
        self.regions = [
            "global", "latam", "brazil", "argentina", "europe", "united_states", 
            "turkey", "united_kingdom", "mexico", "colombia", "canada", "india", 
            "egypt", "australia", "chile", "saudi_arabia", "south_africa", "nigeria", 
            "singapore", "japan", "united_arab_emirates", "ukraine", "asia", "taiwan", 
            "germany", "poland", "row", "philippines", "north_america", "spain", 
            "france", "italy", "middle_east", "south_korea", "norway", "denmark", 
            "hong_kong", "hungary", "netherlands", "vietnam", "belgium", "greece", 
            "sweden", "austria", "czech_republic", "emea", "luxembourg", "new_zealand", 
            "portugal", "switzerland"
        ]
        
        # Regiões prioritárias baseadas nos dados reais
        self.priority_regions = [
            RegionConfig("argentina", "Argentina", "AR", 50, 7095),
            RegionConfig("europe", "Europe", "EU", 50, 5066),
            RegionConfig("united_states", "United States", "US", 50, 3581),
            RegionConfig("turkey", "Turkey", "TR", 50, 2927),
            RegionConfig("global", "Global", "GL", 50, 1613),
            RegionConfig("united_kingdom", "United Kingdom", "GB", 50, 1162),
            RegionConfig("mexico", "Mexico", "MX", 50, 837),
            RegionConfig("colombia", "Colombia", "CO", 50, 752),
            RegionConfig("brazil", "Brazil", "BR", 50, 712),
            RegionConfig("canada", "Canada", "CA", 30, 427),
            RegionConfig("india", "India", "IN", 20, 322),
            RegionConfig("egypt", "Egypt", "EG", 15, 221),
            RegionConfig("chile", "Chile", "CL", 10, 127),
            RegionConfig("australia", "Australia", "AU", 10, 119),
            RegionConfig("latam", "Latin America", "LA", 10, 111)
        ]
    
    def _setup_headers(self):
        """Configura os headers padrão para as requisições"""
        self.session.headers.update({
            "accept": "*/*",
            "accept-language": "en",
            "baggage": "sentry-environment=production,sentry-release=eneba%3Awww%401.3281.0,sentry-public_key=0857afeb74f643e19d8c7aec931404b3,sentry-trace_id=b4b34194fe314136b591544912c9095a,sentry-sampled=false,sentry-sample_rand=0.9053605260310796,sentry-sample_rate=0",
            "content-type": "application/json",
            "priority": "u=1, i",
            "sec-ch-ua": '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
            "sec-ch-ua-mobile": "?1",
            "sec-ch-ua-platform": '"Android"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "sentry-trace": "b4b34194fe314136b591544912c9095a-b44d90d6ae03dfa4-0",
            "x-version": "1.3281.0"
        })
    
    def _build_search_query(self, after_value: Optional[str] = None, 
                          sort_by: str = "POPULARITY_DESC", 
                          search_text: str = "", 
                          region: str = "united_states") -> Dict[str, Any]:
        """Constrói a query GraphQL para busca de jogos"""
        return {
            "operationName": "Store",
            "variables": {
                "currency": self.default_currency,
                "context": {
                    "country": region.upper() if region != "united_states" else "US",
                    "region": region,
                    "language": self.default_language
                },
                "searchType": "DEFAULT",
                "types": ["game"],
                "drms": ["xbox"],
                "regions": self.regions,
                "sortBy": sort_by,
                "after": after_value if after_value != "0" else None,
                "first": self.games_per_page,
                "price": {
                    "currency": self.default_currency
                },
                "url": "/store/xbox-games",
                "redirectUrl": "https://www.eneba.com/store/xbox-games",
                "text": search_text
            },
            "extensions": {
                "persistedQuery": {
                    "version": 1,
                    "sha256Hash": "e7c4cb284593ba8790a73238ee99c8b3cceb6dae6a3bd6a3eb46de758bab688e_fa9d4ba78292d78e2783bcbfcafd66f124a700122195de5fb927b7244800cf5a3e299cb9abf45322afaac142ce79f9f89d4447d0d908f83f9ff19f79be55f40e"
                }
            }
        }
    
    def _build_game_details_query(self, slug: str) -> Dict[str, Any]:
        """Constrói a query GraphQL para detalhes de um jogo específico"""
        return {
            "operationName": "WickedNoCache",
            "variables": {
                "isAutoRenewActive": False,
                "isProductVariantSearch": False,
                "isCheapestAuctionIncluded": True,
                "currency": self.default_currency,
                "context": {
                    "country": "BR",
                    "region": "brazil",
                    "language": self.default_language
                },
                "slug": slug,
                "language": self.default_language,
                "version": 5,
                "abTests": ["CFD755"]
            },
            "extensions": {
                "persistedQuery": {
                    "version": 1,
                    "sha256Hash": "28ae6d27538692975dde9284d4f509cd37ab1e0fc13cec44d13569c482b01b46_0c03a7e4f5e9217299a2aba0061b39e9513ec8ab90158a46df0c21918118431278e9e0f07334b64688e1201c009aacc4d3ac2841ec451ea40d2920c92682e207"
                }
            }
        }
    
    def buscar_pagina(self, after_value: Optional[str] = None, 
                     sort_by: str = "POPULARITY_DESC", 
                     search_text: str = "", 
                     region: str = "united_states") -> Optional[Dict[str, Any]]:
        """
        Busca uma página específica de jogos da API Eneba.
        
        Args:
            after_value: Valor para paginação (cursor)
            sort_by: Tipo de ordenação (padrão: POPULARITY_DESC)
            search_text: Texto de busca
            region: Região para busca
            
        Returns:
            Dados da página ou None em caso de erro
        """
        try:
            query = self._build_search_query(after_value, sort_by, search_text, region)
            
            response = self.session.post(self.base_url, json=query)
            response.raise_for_status()
            
            data = response.json()
            
            if data and data.get("data") and data["data"].get("search"):
                return data["data"]["search"]
            else:
                logger.error("Resposta inválida da API Eneba")
                return None
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Erro na requisição: {e}")
            return None
        except Exception as e:
            logger.error(f"Erro inesperado: {e}")
            return None
    
    def extrair_jogos_da_pagina(self, page_data: Dict[str, Any], 
                               region: str = "united_states") -> List[GameInfo]:
        """
        Extrai informações dos jogos de uma página.
        
        Args:
            page_data: Dados da página retornados pela API
            region: Região dos jogos
            
        Returns:
            Lista de objetos GameInfo
        """
        if not page_data or not page_data.get("results") or not page_data["results"].get("edges"):
            return []
        
        games = []
        for edge in page_data["results"]["edges"]:
            node = edge["node"]
            game = GameInfo(
                slug=node.get("slug", ""),
                name=node.get("name", ""),
                short_id=node.get("shortId", ""),
                price=node.get("cheapestAuction", {}).get("price", {}).get("amount"),
                currency=node.get("cheapestAuction", {}).get("price", {}).get("currency", self.default_currency),
                region=node.get("regions", [{}])[0].get("code", region) if node.get("regions") else region,
                region_name=node.get("regions", [{}])[0].get("name", region) if node.get("regions") else region,
                context=region
            )
            games.append(game)
        
        return games
    
    def paginar_jogos(self, max_pages: int = 50, 
                     sort_by: str = "POPULARITY_DESC", 
                     search_text: str = "", 
                     region: str = "united_states") -> List[GameInfo]:
        """
        Pagina através de múltiplas páginas de jogos.
        
        Args:
            max_pages: Número máximo de páginas para buscar
            sort_by: Tipo de ordenação
            search_text: Texto de busca
            region: Região para busca
            
        Returns:
            Lista de todos os jogos encontrados
        """
        logger.info(f"🚀 Iniciando paginação para região: {region}")
        logger.info(f"📄 Máximo de páginas: {max_pages}")
        
        all_games = []
        current_after = None
        page_number = 1
        consecutive_empty_pages = 0
        
        while page_number <= max_pages:
            logger.info(f"📖 Buscando página {page_number}...")
            
            page_data = self.buscar_pagina(current_after, sort_by, search_text, region)
            
            if not page_data or not page_data.get("results") or not page_data["results"].get("edges"):
                consecutive_empty_pages += 1
                logger.warning(f"⚠️  Página vazia ({consecutive_empty_pages}/3)")
                
                if consecutive_empty_pages >= 3:
                    logger.info("✅ Parando - 3 páginas vazias consecutivas")
                    break
                
                page_number += 1
                continue
            
            consecutive_empty_pages = 0
            games = self.extrair_jogos_da_pagina(page_data, region)
            all_games.extend(games)
            
            logger.info(f"✅ Página {page_number}: {len(games)} jogos encontrados (Total: {len(all_games)})")
            
            # Verificar se há próxima página
            if len(games) < self.games_per_page:
                logger.info("✅ Última página alcançada")
                break
            
            # Preparar para próxima página
            if games:
                current_after = games[-1].short_id
            page_number += 1
            
            # Pausa para não sobrecarregar a API
            time.sleep(0.2)
        
        logger.info(f"🎉 Paginação concluída! Total: {len(all_games)} jogos")
        return all_games
    
    def paginar_todas_regioes(self, max_pages_per_region: int = 50) -> Dict[str, Any]:
        """
        Pagina jogos de todas as regiões suportadas.
        
        Args:
            max_pages_per_region: Número máximo de páginas por região
            
        Returns:
            Dicionário com estatísticas e jogos de todas as regiões
        """
        logger.info("🚀 Iniciando paginação de todas as regiões...")
        
        all_games = []
        region_stats = {}
        region_details = {}
        
        for region_config in self.priority_regions:
            try:
                logger.info(f"\n🌍 Processando região: {region_config.name} ({region_config.region})")
                
                region_games = self.paginar_jogos(
                    max_pages=region_config.max_pages,
                    region=region_config.region
                )
                
                all_games.extend(region_games)
                region_stats[region_config.name] = len(region_games)
                region_details[region_config.name] = {
                    "region": region_config.region,
                    "games_count": len(region_games),
                    "expected_games": region_config.expected_games,
                    "efficiency": (len(region_games) / region_config.expected_games * 100) if region_config.expected_games else 0,
                    "sample_games": region_games[:3] if region_games else []
                }
                
                # Pausa entre regiões
                time.sleep(0.5)
                
            except Exception as e:
                logger.error(f"❌ Erro ao processar {region_config.name}: {e}")
                region_stats[region_config.name] = 0
                region_details[region_config.name] = {
                    "region": region_config.region,
                    "games_count": 0,
                    "error": str(e)
                }
        
        # Remover duplicatas baseado no slug
        unique_games = []
        seen_slugs = set()
        
        for game in all_games:
            if game.slug not in seen_slugs:
                unique_games.append(game)
                seen_slugs.add(game.slug)
        
        # Análise de diversidade de regiões
        region_diversity = {}
        for game in all_games:
            region_diversity[game.region] = region_diversity.get(game.region, 0) + 1
        
        result = {
            "metadata": {
                "total_games": len(all_games),
                "unique_games": len(unique_games),
                "duplicates": len(all_games) - len(unique_games),
                "regions_processed": len(self.priority_regions),
                "generated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
                "strategy": "all_regions"
            },
            "region_stats": region_stats,
            "region_details": region_details,
            "region_diversity": region_diversity,
            "all_games": all_games,
            "unique_games": unique_games
        }
        
        logger.info(f"\n🎉 Paginação de todas as regiões concluída!")
        logger.info(f"📊 Total de jogos: {len(all_games)}")
        logger.info(f"📊 Jogos únicos: {len(unique_games)}")
        logger.info(f"📊 Duplicatas removidas: {len(all_games) - len(unique_games)}")
        
        return result
    
    def buscar_detalhes_jogo(self, slug: str) -> Optional[Dict[str, Any]]:
        """
        Busca detalhes específicos de um jogo.
        
        Args:
            slug: Slug do jogo
            
        Returns:
            Detalhes do jogo ou None em caso de erro
        """
        try:
            query = self._build_game_details_query(slug)
            
            response = self.session.post(self.base_url, json=query)
            response.raise_for_status()
            
            data = response.json()
            
            if data and data.get("data"):
                return data["data"]
            else:
                logger.error("Resposta inválida da API Eneba para detalhes do jogo")
                return None
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Erro na requisição de detalhes: {e}")
            return None
        except Exception as e:
            logger.error(f"Erro inesperado ao buscar detalhes: {e}")
            return None
    
    def salvar_jogos_json(self, games_data: Dict[str, Any], filename: str):
        """
        Salva os dados dos jogos em um arquivo JSON.
        
        Args:
            games_data: Dados dos jogos para salvar
            filename: Nome do arquivo para salvar
        """
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(games_data, f, indent=2, ensure_ascii=False, default=str)
            logger.info(f"💾 Dados salvos em: {filename}")
        except Exception as e:
            logger.error(f"Erro ao salvar arquivo: {e}")
    
    def obter_estatisticas(self, games: List[GameInfo]) -> Dict[str, Any]:
        """
        Obtém estatísticas dos jogos coletados.
        
        Args:
            games: Lista de jogos
            
        Returns:
            Dicionário com estatísticas
        """
        if not games:
            return {"total": 0}
        
        # Estatísticas básicas
        total_games = len(games)
        unique_regions = len(set(game.region for game in games if game.region))
        
        # Análise de preços
        games_with_price = [game for game in games if game.price is not None]
        prices = [game.price for game in games_with_price]
        
        price_stats = {}
        if prices:
            price_stats = {
                "min_price": min(prices),
                "max_price": max(prices),
                "avg_price": sum(prices) / len(prices),
                "games_with_price": len(games_with_price),
                "games_without_price": total_games - len(games_with_price)
            }
        
        # Análise por região
        region_counts = {}
        for game in games:
            if game.region:
                region_counts[game.region] = region_counts.get(game.region, 0) + 1
        
        return {
            "total_games": total_games,
            "unique_regions": unique_regions,
            "price_stats": price_stats,
            "region_distribution": region_counts,
            "top_regions": sorted(region_counts.items(), key=lambda x: x[1], reverse=True)[:10]
        }

# Exemplo de uso
if __name__ == "__main__":
    # Criar instância da API
    api = EnebaAPI()
    
    # Exemplo 1: Buscar uma página específica
    print("=== Exemplo 1: Buscar uma página ===")
    page_data = api.buscar_pagina(region="brazil")
    if page_data:
        games = api.extrair_jogos_da_pagina(page_data, "brazil")
        print(f"Encontrados {len(games)} jogos na primeira página")
        for game in games[:3]:  # Mostrar apenas os 3 primeiros
            print(f"- {game.name} (R$ {game.price/100 if game.price else 'N/A'})")
    
    # Exemplo 2: Paginar jogos de uma região
    print("\n=== Exemplo 2: Paginar jogos do Brasil ===")
    brazil_games = api.paginar_jogos(max_pages=5, region="brazil")
    print(f"Total de jogos do Brasil: {len(brazil_games)}")
    
    # Exemplo 3: Buscar detalhes de um jogo específico
    print("\n=== Exemplo 3: Detalhes de um jogo ===")
    if brazil_games:
        first_game = brazil_games[0]
        details = api.buscar_detalhes_jogo(first_game.slug)
        if details:
            print(f"Detalhes encontrados para: {first_game.name}")
        else:
            print("Não foi possível obter detalhes do jogo")
    
    # Exemplo 4: Obter estatísticas
    print("\n=== Exemplo 4: Estatísticas ===")
    stats = api.obter_estatisticas(brazil_games)
    print(f"Total de jogos: {stats['total_games']}")
    print(f"Regiões únicas: {stats['unique_regions']}")
    if stats['price_stats']:
        print(f"Preço médio: R$ {stats['price_stats']['avg_price']/100:.2f}")
