#!/usr/bin/env python3
"""
Exemplo de uso da classe EnebaAPI
Demonstra como usar todos os métodos principais da classe
"""

from eneba_api import EnebaAPI, GameInfo
import json
import time

def exemplo_basico():
    """Exemplo básico de uso da API"""
    print("=== EXEMPLO BÁSICO ===")
    
    # Criar instância da API
    api = EnebaAPI()
    
    # Buscar uma página de jogos do Brasil
    print("1. Buscando primeira página de jogos do Brasil...")
    page_data = api.buscar_pagina(region="brazil")
    
    if page_data:
        games = api.extrair_jogos_da_pagina(page_data, "brazil")
        print(f"   ✅ Encontrados {len(games)} jogos")
        
        # Mostrar alguns exemplos
        print("\n   📋 Primeiros 3 jogos:")
        for i, game in enumerate(games[:3], 1):
            price_str = f"R$ {game.price/100:.2f}" if game.price else "N/A"
            print(f"   {i}. {game.name} - {price_str}")
    else:
        print("   ❌ Erro ao buscar página")

def exemplo_paginacao():
    """Exemplo de paginação de jogos"""
    print("\n=== EXEMPLO DE PAGINAÇÃO ===")
    
    api = EnebaAPI()
    
    # Paginar jogos do Brasil (limitado a 3 páginas para o exemplo)
    print("2. Paginando jogos do Brasil (máximo 3 páginas)...")
    brazil_games = api.paginar_jogos(max_pages=3, region="brazil")
    
    print(f"   ✅ Total de jogos coletados: {len(brazil_games)}")
    
    # Mostrar estatísticas
    stats = api.obter_estatisticas(brazil_games)
    print(f"   📊 Regiões únicas encontradas: {stats['unique_regions']}")
    
    if stats['price_stats']:
        print(f"   💰 Preço médio: R$ {stats['price_stats']['avg_price']/100:.2f}")
        print(f"   💰 Jogos com preço: {stats['price_stats']['games_with_price']}")
        print(f"   💰 Jogos sem preço: {stats['price_stats']['games_without_price']}")

def exemplo_detalhes_jogo():
    """Exemplo de busca de detalhes de um jogo específico"""
    print("\n=== EXEMPLO DE DETALHES DE JOGO ===")
    
    api = EnebaAPI()
    
    # Primeiro, buscar alguns jogos para obter um slug
    print("3. Buscando jogos para obter um slug...")
    page_data = api.buscar_pagina(region="brazil")
    
    if page_data:
        games = api.extrair_jogos_da_pagina(page_data, "brazil")
        
        if games:
            # Pegar o primeiro jogo
            first_game = games[0]
            print(f"   🎮 Buscando detalhes de: {first_game.name}")
            print(f"   🔗 Slug: {first_game.slug}")
            
            # Buscar detalhes
            details = api.buscar_detalhes_jogo(first_game.slug)
            
            if details:
                print("   ✅ Detalhes obtidos com sucesso!")
                print(f"   📋 Estrutura dos dados: {list(details.keys())}")
            else:
                print("   ❌ Erro ao obter detalhes do jogo")
        else:
            print("   ❌ Nenhum jogo encontrado na página")
    else:
        print("   ❌ Erro ao buscar página inicial")

def exemplo_multiplas_regioes():
    """Exemplo de busca em múltiplas regiões"""
    print("\n=== EXEMPLO DE MÚLTIPLAS REGIÕES ===")
    
    api = EnebaAPI()
    
    # Buscar jogos de algumas regiões específicas
    regions_to_test = ["brazil", "united_states", "argentina"]
    
    print("4. Testando múltiplas regiões...")
    
    for region in regions_to_test:
        print(f"\n   🌍 Testando região: {region}")
        
        # Buscar apenas 1 página para cada região (para não demorar muito)
        games = api.paginar_jogos(max_pages=1, region=region)
        
        print(f"   ✅ {len(games)} jogos encontrados")
        
        if games:
            # Mostrar exemplo de jogo
            sample_game = games[0]
            price_str = f"R$ {sample_game.price/100:.2f}" if sample_game.price else "N/A"
            print(f"   📋 Exemplo: {sample_game.name} - {price_str}")
        
        # Pausa entre regiões
        time.sleep(1)

def exemplo_busca_texto():
    """Exemplo de busca por texto específico"""
    print("\n=== EXEMPLO DE BUSCA POR TEXTO ===")
    
    api = EnebaAPI()
    
    # Buscar jogos com texto específico
    search_terms = ["fifa", "call of duty", "minecraft"]
    
    print("5. Testando busca por texto...")
    
    for term in search_terms:
        print(f"\n   🔍 Buscando por: '{term}'")
        
        games = api.paginar_jogos(max_pages=1, search_text=term, region="brazil")
        
        print(f"   ✅ {len(games)} jogos encontrados")
        
        if games:
            # Mostrar alguns exemplos
            print("   📋 Exemplos encontrados:")
            for i, game in enumerate(games[:3], 1):
                price_str = f"R$ {game.price/100:.2f}" if game.price else "N/A"
                print(f"   {i}. {game.name} - {price_str}")
        
        time.sleep(1)

def exemplo_salvar_dados():
    """Exemplo de como salvar os dados coletados"""
    print("\n=== EXEMPLO DE SALVAMENTO DE DADOS ===")
    
    api = EnebaAPI()
    
    print("6. Coletando e salvando dados...")
    
    # Coletar jogos do Brasil (limitado para o exemplo)
    brazil_games = api.paginar_jogos(max_pages=2, region="brazil")
    
    if brazil_games:
        # Criar estrutura de dados para salvar
        data_to_save = {
            "metadata": {
                "total_games": len(brazil_games),
                "region": "brazil",
                "collected_at": time.strftime("%Y-%m-%d %H:%M:%S"),
                "source": "EnebaAPI Python"
            },
            "games": [
                {
                    "slug": game.slug,
                    "name": game.name,
                    "short_id": game.short_id,
                    "price": game.price,
                    "currency": game.currency,
                    "region": game.region
                }
                for game in brazil_games
            ]
        }
        
        # Salvar em arquivo JSON
        filename = "exemplo_jogos_brasil.json"
        api.salvar_jogos_json(data_to_save, filename)
        
        print(f"   ✅ Dados salvos em: {filename}")
        print(f"   📊 Total de jogos salvos: {len(brazil_games)}")
    else:
        print("   ❌ Nenhum jogo encontrado para salvar")

def exemplo_estatisticas_avancadas():
    """Exemplo de análise estatística avançada"""
    print("\n=== EXEMPLO DE ESTATÍSTICAS AVANÇADAS ===")
    
    api = EnebaAPI()
    
    print("7. Coletando dados para análise estatística...")
    
    # Coletar jogos de várias regiões
    all_games = []
    regions_to_analyze = ["brazil", "united_states", "argentina"]
    
    for region in regions_to_analyze:
        print(f"   🌍 Coletando dados de: {region}")
        games = api.paginar_jogos(max_pages=2, region=region)
        all_games.extend(games)
        time.sleep(1)
    
    if all_games:
        # Obter estatísticas
        stats = api.obter_estatisticas(all_games)
        
        print(f"\n   📊 ESTATÍSTICAS GERAIS:")
        print(f"   Total de jogos: {stats['total_games']}")
        print(f"   Regiões únicas: {stats['unique_regions']}")
        
        if stats['price_stats']:
            print(f"\n   💰 ANÁLISE DE PREÇOS:")
            print(f"   Preço mínimo: R$ {stats['price_stats']['min_price']/100:.2f}")
            print(f"   Preço máximo: R$ {stats['price_stats']['max_price']/100:.2f}")
            print(f"   Preço médio: R$ {stats['price_stats']['avg_price']/100:.2f}")
            print(f"   Jogos com preço: {stats['price_stats']['games_with_price']}")
            print(f"   Jogos sem preço: {stats['price_stats']['games_without_price']}")
        
        print(f"\n   🌍 TOP 5 REGIÕES:")
        for i, (region, count) in enumerate(stats['top_regions'][:5], 1):
            print(f"   {i}. {region}: {count} jogos")
    else:
        print("   ❌ Nenhum jogo encontrado para análise")

def main():
    """Função principal que executa todos os exemplos"""
    print("🚀 EXEMPLOS DE USO DA CLASSE EnebaAPI")
    print("=" * 50)
    
    try:
        # Executar exemplos
        exemplo_basico()
        exemplo_paginacao()
        exemplo_detalhes_jogo()
        exemplo_multiplas_regioes()
        exemplo_busca_texto()
        exemplo_salvar_dados()
        exemplo_estatisticas_avancadas()
        
        print("\n" + "=" * 50)
        print("✅ Todos os exemplos executados com sucesso!")
        print("\n💡 DICAS DE USO:")
        print("- Use max_pages pequeno para testes rápidos")
        print("- A API tem rate limiting, então use time.sleep() entre requisições")
        print("- Sempre verifique se os dados foram retornados antes de processar")
        print("- Use a função salvar_jogos_json() para persistir dados")
        print("- A classe suporta todas as regiões listadas em self.regions")
        
    except Exception as e:
        print(f"\n❌ Erro durante execução: {e}")
        print("Verifique sua conexão com a internet e tente novamente.")

if __name__ == "__main__":
    main()
