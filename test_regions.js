import fetch from 'node-fetch';
import fs from 'fs';

// Configuração
const API_URL = 'http://localhost:3000/Page';

// Diferentes contextos para testar cada região
const REGIONS_TO_TEST = [
  { country: 'US', region: 'united_states', name: 'United States' },
  { country: 'BR', region: 'brazil', name: 'Brazil' },
  { country: 'GB', region: 'united_kingdom', name: 'United Kingdom' },
  { country: 'DE', region: 'germany', name: 'Germany' },
  { country: 'FR', region: 'france', name: 'France' },
  { country: 'JP', region: 'japan', name: 'Japan' },
  { country: 'AU', region: 'australia', name: 'Australia' },
  { country: 'CA', region: 'canada', name: 'Canada' },
  { country: 'MX', region: 'mexico', name: 'Mexico' },
  { country: 'AR', region: 'argentina', name: 'Argentina' },
  { country: 'ES', region: 'spain', name: 'Spain' },
  { country: 'IT', region: 'italy', name: 'Italy' },
  { country: 'NL', region: 'netherlands', name: 'Netherlands' },
  { country: 'SE', region: 'sweden', name: 'Sweden' },
  { country: 'NO', region: 'norway', name: 'Norway' }
];

// Função para fazer requisição para uma região específica
async function fetchRegionPage(context) {
  const url = new URL(API_URL);
  url.searchParams.set('afterValue', '0');
  url.searchParams.set('sort_by', 'POPULARITY_DESC');
  
  try {
    console.log(`🌍 Testando ${context.name} (${context.region})...`);
    const response = await fetch(url.toString());
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`❌ Erro ao buscar ${context.name}:`, error);
    return null;
  }
}

// Função para extrair informações dos jogos
function extractGameInfo(pageData, context) {
  if (!pageData || !pageData.edges) {
    return [];
  }
  
  return pageData.edges.map(edge => ({
    slug: edge.node.slug,
    name: edge.node.name,
    shortId: edge.node.shortId,
    price: edge.node.cheapestAuction?.price?.amount || null,
    currency: edge.node.cheapestAuction?.price?.currency || 'USD',
    region: edge.node.regions?.[0]?.code || context.region,
    regionName: edge.node.regions?.[0]?.name || context.name,
    context: context.name
  }));
}

// Função principal para testar todas as regiões
async function testAllRegions() {
  console.log('🚀 Testando primeira página de cada região...');
  console.log(`📊 Regiões a testar: ${REGIONS_TO_TEST.length}\n`);
  
  const results = {};
  const allGames = [];
  const regionStats = {};
  
  for (const region of REGIONS_TO_TEST) {
    try {
      const pageData = await fetchRegionPage(region);
      
      if (pageData && pageData.edges) {
        const games = extractGameInfo(pageData, region);
        results[region.name] = {
          success: true,
          gamesCount: games.length,
          games: games,
          totalAvailable: pageData.totalCount || 'N/A'
        };
        allGames.push(...games);
        regionStats[region.name] = games.length;
        
        console.log(`  ✅ ${region.name}: ${games.length} jogos encontrados`);
        
        // Mostrar alguns exemplos
        if (games.length > 0) {
          console.log(`     Exemplos:`);
          games.slice(0, 3).forEach((game, index) => {
            console.log(`       ${index + 1}. ${game.name}`);
            console.log(`          Região: ${game.regionName} (${game.region})`);
            console.log(`          Preço: $${game.price ? (game.price / 100).toFixed(2) : 'N/A'}`);
          });
        }
      } else {
        results[region.name] = {
          success: false,
          error: 'Nenhum dado retornado'
        };
        regionStats[region.name] = 0;
        console.log(`  ❌ ${region.name}: Nenhum jogo encontrado`);
      }
      
      // Pausa entre requisições
      await new Promise(resolve => setTimeout(resolve, 300));
      
    } catch (error) {
      results[region.name] = {
        success: false,
        error: error.message
      };
      regionStats[region.name] = 0;
      console.log(`  ❌ ${region.name}: Erro - ${error.message}`);
    }
    
    console.log(''); // Linha em branco para separar
  }
  
  // Remover duplicatas baseado no slug
  const uniqueGames = [];
  const seenSlugs = new Set();
  
  for (const game of allGames) {
    if (!seenSlugs.has(game.slug)) {
      uniqueGames.push(game);
      seenSlugs.add(game.slug);
    }
  }
  
  // Salvar resultados em arquivo JSON
  const output = {
    metadata: {
      testDate: new Date().toISOString(),
      totalRegions: REGIONS_TO_TEST.length,
      successfulRegions: Object.values(results).filter(r => r.success).length,
      totalGames: allGames.length,
      uniqueGames: uniqueGames.length,
      duplicates: allGames.length - uniqueGames.length
    },
    regionStats: regionStats,
    results: results,
    allGames: allGames,
    uniqueGames: uniqueGames
  };
  
  fs.writeFileSync('region_test_results.json', JSON.stringify(output, null, 2));
  
  // Resumo final
  console.log('🎉 Teste concluído!');
  console.log(`📊 Regiões testadas: ${REGIONS_TO_TEST.length}`);
  console.log(`📊 Regiões com sucesso: ${Object.values(results).filter(r => r.success).length}`);
  console.log(`📊 Total de jogos coletados: ${allGames.length}`);
  console.log(`📊 Jogos únicos: ${uniqueGames.length}`);
  console.log(`📊 Duplicatas: ${allGames.length - uniqueGames.length}`);
  console.log(`💾 Resultados salvos em: region_test_results.json`);
  
  // Estatísticas por região
  console.log('\n📈 Jogos por região:');
  Object.entries(regionStats).forEach(([region, count]) => {
    const status = results[region].success ? '✅' : '❌';
    console.log(`  ${status} ${region}: ${count} jogos`);
  });
  
  // Análise de regiões únicas
  const uniqueRegions = [...new Set(uniqueGames.map(game => game.region))];
  console.log(`\n🌍 Regiões únicas encontradas: ${uniqueRegions.length}`);
  console.log(`   Regiões: ${uniqueRegions.join(', ')}`);
  
  // Top 10 jogos mais comuns
  const gameCounts = {};
  allGames.forEach(game => {
    gameCounts[game.slug] = (gameCounts[game.slug] || 0) + 1;
  });
  
  const topGames = Object.entries(gameCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);
  
  console.log('\n🏆 Top 10 jogos mais comuns:');
  topGames.forEach(([slug, count], index) => {
    const game = allGames.find(g => g.slug === slug);
    console.log(`  ${index + 1}. ${game.name} (${count} regiões)`);
  });
}

// Executar teste
if (import.meta.url === `file://${process.argv[1]}`) {
  testAllRegions();
}

export { testAllRegions };

