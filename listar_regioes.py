#!/usr/bin/env python3
"""
Script para listar todas as regiões suportadas pela API Eneba
"""

from eneba_api import EnebaAPI

def listar_todas_regioes():
    """Lista todas as regiões suportadas pela API"""
    api = EnebaAPI()
    
    print("🌍 REGIÕES SUPORTADAS PELA API ENEBA")
    print("=" * 50)
    
    # Regiões da classe
    print(f"\n📋 Total de regiões na classe: {len(api.regions)}")
    print("\n🔤 Lista alfabética:")
    for i, region in enumerate(sorted(api.regions), 1):
        print(f"{i:2d}. {region}")
    
    # Regiões prioritárias
    print(f"\n🏆 Regiões prioritárias: {len(api.priority_regions)}")
    print("\n📊 Regiões prioritárias (com dados esperados):")
    for i, region in enumerate(api.priority_regions, 1):
        expected = f"{region.expected_games:,}" if region.expected_games else "N/A"
        print(f"{i:2d}. {region.name:15} ({region.region:15}) - {expected:>6} jogos esperados")
    
    return api.regions, api.priority_regions

def testar_regioes_disponiveis():
    """Testa quais regiões estão disponíveis no momento"""
    api = EnebaAPI()
    
    print("\n🧪 TESTANDO DISPONIBILIDADE DAS REGIÕES")
    print("=" * 50)
    
    # Testar regiões prioritárias primeiro
    print("\n🏆 Testando regiões prioritárias:")
    available_regions = []
    
    for region_config in api.priority_regions:
        region = region_config.region
        try:
            print(f"   🔍 Testando {region_config.name} ({region})...", end=" ")
            
            page_data = api.buscar_pagina(region=region)
            
            if page_data and page_data.get("results") and page_data["results"].get("edges"):
                games = api.extrair_jogos_da_pagina(page_data, region)
                print(f"✅ {len(games)} jogos")
                available_regions.append({
                    "region": region,
                    "name": region_config.name,
                    "games_found": len(games),
                    "expected": region_config.expected_games
                })
            else:
                print("❌ Nenhum jogo")
                
        except Exception as e:
            print(f"❌ Erro: {str(e)[:50]}...")
    
    # Resumo das regiões disponíveis
    print(f"\n📊 RESUMO:")
    print(f"   Regiões testadas: {len(api.priority_regions)}")
    print(f"   Regiões disponíveis: {len(available_regions)}")
    
    if available_regions:
        print(f"\n✅ REGIÕES DISPONÍVEIS:")
        for region_info in available_regions:
            efficiency = ""
            if region_info["expected"]:
                eff = (region_info["games_found"] / region_info["expected"]) * 100
                efficiency = f" ({eff:.1f}% do esperado)"
            
            print(f"   • {region_info['name']:15} ({region_info['region']:15}): {region_info['games_found']:>3} jogos{efficiency}")
    
    return available_regions

def gerar_codigo_exemplo():
    """Gera código de exemplo para usar as regiões"""
    api = EnebaAPI()
    
    print("\n💻 CÓDIGO DE EXEMPLO PARA USAR AS REGIÕES")
    print("=" * 50)
    
    print("""
# Exemplo 1: Buscar jogos de uma região específica
from eneba_api import EnebaAPI

api = EnebaAPI()

# Regiões mais populares
regions_populares = [
    "brazil",      # Brasil
    "argentina",   # Argentina  
    "united_states", # Estados Unidos
    "europe",      # Europa
    "germany",     # Alemanha
    "france",      # França
    "japan",       # Japão
    "australia"    # Austrália
]

for region in regions_populares:
    games = api.paginar_jogos(region=region, max_pages=3)
    print(f"{region}: {len(games)} jogos")

# Exemplo 2: Buscar jogos de todas as regiões prioritárias
all_games = []
for region_config in api.priority_regions:
    games = api.paginar_jogos(region=region_config.region, max_pages=5)
    all_games.extend(games)
    print(f"{region_config.name}: {len(games)} jogos")

print(f"Total de jogos coletados: {len(all_games)}")

# Exemplo 3: Buscar jogos específicos em diferentes regiões
search_term = "fifa"
regions = ["brazil", "argentina", "united_states"]

for region in regions:
    games = api.paginar_jogos(
        region=region, 
        search_text=search_term, 
        max_pages=2
    )
    print(f"FIFA em {region}: {len(games)} jogos")
""")

def main():
    """Função principal"""
    print("🚀 LISTADOR DE REGIÕES DA API ENEBA")
    print("=" * 50)
    
    try:
        # Listar todas as regiões
        all_regions, priority_regions = listar_todas_regioes()
        
        # Testar disponibilidade
        available = testar_regioes_disponiveis()
        
        # Gerar código de exemplo
        gerar_codigo_exemplo()
        
        print(f"\n✅ Processo concluído!")
        print(f"   📊 Total de regiões: {len(all_regions)}")
        print(f"   🏆 Regiões prioritárias: {len(priority_regions)}")
        print(f"   ✅ Regiões disponíveis: {len(available)}")
        
    except Exception as e:
        print(f"\n❌ Erro durante execução: {e}")
        print("Verifique sua conexão com a internet e tente novamente.")

if __name__ == "__main__":
    main()
