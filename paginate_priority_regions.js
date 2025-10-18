import fetch from 'node-fetch';
import fs from 'fs';

// Configuração
const API_URL = 'http://localhost:3000/Page';
const GAMES_PER_PAGE = 20;
const OUTPUT_FILE = 'priority_games_collection.json';

// Regiões prioritárias baseadas nos dados reais (top 15 com mais jogos)
const PRIORITY_REGIONS = [
  { region: 'argentina', name: 'Argentina', expectedGames: 7095, maxPages: 50 },
  { region: 'europe', name: 'Europe', expectedGames: 5066, maxPages: 50 },
  { region: 'united_states', name: 'United States', expectedGames: 3581, maxPages: 50 },
  { region: 'turkey', name: 'Turkey', expectedGames: 2927, maxPages: 50 },
  { region: 'global', name: 'Global', expectedGames: 1613, maxPages: 50 },
  { region: 'united_kingdom', name: 'United Kingdom', expectedGames: 1162, maxPages: 50 },
  { region: 'mexico', name: 'Mexico', expectedGames: 837, maxPages: 50 },
  { region: 'colombia', name: 'Colombia', expectedGames: 752, maxPages: 50 },
  { region: 'brazil', name: 'Brazil', expectedGames: 712, maxPages: 50 },
  { region: 'canada', name: 'Canada', expectedGames: 427, maxPages: 30 },
  { region: 'india', name: 'India', expectedGames: 322, maxPages: 20 },
  { region: 'egypt', name: 'Egypt', expectedGames: 221, maxPages: 15 },
  { region: 'chile', name: 'Chile', expectedGames: 127, maxPages: 10 },
  { region: 'australia', name: 'Australia', expectedGames: 119, maxPages: 10 },
  { region: 'latam', name: 'Latin America', expectedGames: 111, maxPages: 10 }
];

// Função para fazer requisição para uma página específica
async function fetchPage(afterValue = null, region, sortBy = 'POPULARITY_DESC') {
  const url = new URL(API_URL);
  url.searchParams.set('afterValue', afterValue || '0');
  url.searchParams.set('sort_by', sortBy);
  url.searchParams.set('region', region);
  
  try {
    const response = await fetch(url.toString());
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Erro ao buscar página para ${region}:`, error);
    return null;
  }
}

// Função para extrair informações dos jogos
function extractGameInfo(pageData, region) {
  if (!pageData || !pageData.edges) {
    return [];
  }
  
  return pageData.edges.map(edge => ({
    slug: edge.node.slug,
    name: edge.node.name,
    shortId: edge.node.shortId,
    price: edge.node.cheapestAuction?.price?.amount || null,
    currency: edge.node.cheapestAuction?.price?.currency || 'USD',
    region: edge.node.regions?.[0]?.code || region,
    regionName: edge.node.regions?.[0]?.name || region,
    context: region,
    pageInfo: pageData.pageInfo || null
  }));
}

// Função para paginar uma região específica
async function paginateRegion(regionConfig) {
  console.log(`\n🌍 Processando região: ${regionConfig.name} (${regionConfig.region})`);
  console.log(`   📊 Esperado: ${regionConfig.expectedGames} jogos | Máximo: ${regionConfig.maxPages} páginas`);
  
  const regionGames = [];
  let currentAfter = null;
  let pageNumber = 1;
  let totalFetched = 0;
  let consecutiveEmptyPages = 0;
  
  while (pageNumber <= regionConfig.maxPages) {
    console.log(`  📖 Página ${pageNumber}...`);
    
    const pageData = await fetchPage(currentAfter, regionConfig.region);
    
    if (!pageData || !pageData.edges || pageData.edges.length === 0) {
      consecutiveEmptyPages++;
      console.log(`  ⚠️  Página vazia (${consecutiveEmptyPages}/3)`);
      
      if (consecutiveEmptyPages >= 3) {
        console.log(`  ✅ Parando - 3 páginas vazias consecutivas`);
        break;
      }
      
      pageNumber++;
      continue;
    }
    
    consecutiveEmptyPages = 0; // Reset contador
    const games = extractGameInfo(pageData, regionConfig.region);
    regionGames.push(...games);
    totalFetched += games.length;
    
    console.log(`  ✅ ${games.length} jogos encontrados (Total: ${totalFetched})`);
    
    // Verificar se há próxima página
    if (games.length < GAMES_PER_PAGE) {
      console.log(`  ✅ Última página para ${regionConfig.name}`);
      break;
    }
    
    // Preparar para próxima página
    const lastGame = games[games.length - 1];
    currentAfter = lastGame.shortId;
    pageNumber++;
    
    // Pausa para não sobrecarregar a API
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  const efficiency = ((totalFetched / regionConfig.expectedGames) * 100).toFixed(1);
  console.log(`  🎯 ${regionConfig.name}: ${totalFetched} jogos coletados (${efficiency}% do esperado)`);
  
  return {
    region: regionConfig.region,
    name: regionConfig.name,
    games: regionGames,
    totalFetched,
    pagesProcessed: pageNumber - 1,
    efficiency: parseFloat(efficiency)
  };
}

// Função principal para paginar regiões prioritárias
async function paginatePriorityRegions() {
  console.log('🚀 Iniciando paginação das regiões prioritárias...');
  console.log(`📊 Regiões a processar: ${PRIORITY_REGIONS.length}`);
  console.log(`📄 Total esperado de jogos: ${PRIORITY_REGIONS.reduce((sum, r) => sum + r.expectedGames, 0).toLocaleString()}`);
  
  const allGames = [];
  const regionResults = {};
  const regionStats = {};
  
  for (const regionConfig of PRIORITY_REGIONS) {
    try {
      const result = await paginateRegion(regionConfig);
      allGames.push(...result.games);
      regionResults[regionConfig.name] = result;
      regionStats[regionConfig.name] = {
        region: regionConfig.region,
        expected: regionConfig.expectedGames,
        fetched: result.totalFetched,
        efficiency: result.efficiency,
        pagesProcessed: result.pagesProcessed
      };
      
      // Pausa entre regiões
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`❌ Erro ao processar ${regionConfig.name}:`, error);
      regionStats[regionConfig.name] = {
        region: regionConfig.region,
        expected: regionConfig.expectedGames,
        fetched: 0,
        efficiency: 0,
        error: error.message
      };
    }
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
  
  // Análise de diversidade de regiões
  const regionDiversity = {};
  allGames.forEach(game => {
    if (!regionDiversity[game.region]) {
      regionDiversity[game.region] = 0;
    }
    regionDiversity[game.region]++;
  });
  
  // Salvar todos os jogos em arquivo JSON
  const output = {
    metadata: {
      totalGames: allGames.length,
      uniqueGames: uniqueGames.length,
      duplicates: allGames.length - uniqueGames.length,
      regionsProcessed: PRIORITY_REGIONS.length,
      generatedAt: new Date().toISOString(),
      apiUrl: API_URL,
      strategy: "priority_regions"
    },
    regionStats: regionStats,
    regionDiversity: regionDiversity,
    allGames: allGames,
    uniqueGames: uniqueGames,
    summary: {
      totalExpected: PRIORITY_REGIONS.reduce((sum, r) => sum + r.expectedGames, 0),
      totalFetched: allGames.length,
      overallEfficiency: ((allGames.length / PRIORITY_REGIONS.reduce((sum, r) => sum + r.expectedGames, 0)) * 100).toFixed(2),
      uniqueRegions: Object.keys(regionDiversity).length,
      topRegions: Object.entries(regionDiversity)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([region, count]) => ({ region, count }))
    }
  };
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  
  console.log('\n🎉 Paginação das regiões prioritárias concluída!');
  console.log(`📊 Total de jogos coletados: ${allGames.length.toLocaleString()}`);
  console.log(`📊 Jogos únicos: ${uniqueGames.length.toLocaleString()}`);
  console.log(`📊 Duplicatas removidas: ${(allGames.length - uniqueGames.length).toLocaleString()}`);
  console.log(`📊 Eficiência geral: ${output.summary.overallEfficiency}%`);
  console.log(`💾 Arquivo salvo: ${OUTPUT_FILE}`);
  
  // Estatísticas por região
  console.log('\n📈 Estatísticas por região:');
  Object.entries(regionStats).forEach(([region, stats]) => {
    if (stats.error) {
      console.log(`  ❌ ${region}: Erro - ${stats.error}`);
    } else {
      console.log(`  ✅ ${region}: ${stats.fetched.toLocaleString()}/${stats.expected.toLocaleString()} (${stats.efficiency}%)`);
    }
  });
  
  // Top regiões encontradas
  console.log('\n🌍 Top 10 regiões com mais jogos:');
  output.summary.topRegions.forEach((item, index) => {
    console.log(`  ${index + 1}. ${item.region}: ${item.count.toLocaleString()} jogos`);
  });
  
  // Análise de eficiência
  const efficientRegions = Object.entries(regionStats)
    .filter(([, stats]) => !stats.error && stats.efficiency > 50)
    .sort(([,a], [,b]) => b.efficiency - a.efficiency);
  
  console.log('\n⚡ Regiões mais eficientes (>50%):');
  efficientRegions.forEach(([region, stats]) => {
    console.log(`  ${region}: ${stats.efficiency}% (${stats.fetched}/${stats.expected})`);
  });
}

// Executar script
if (import.meta.url === `file://${process.argv[1]}`) {
  paginatePriorityRegions();
}

export { paginatePriorityRegions };
