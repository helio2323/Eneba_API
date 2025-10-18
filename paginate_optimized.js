import fetch from 'node-fetch';
import fs from 'fs';

// Configuração
const API_URL = 'http://localhost:3000/Page';
const GAMES_PER_PAGE = 20;
const MAX_PAGES_PER_REGION = 50; // Máximo de páginas por região
const OUTPUT_FILE = 'optimized_games_collection.json';

// Regiões para buscar (baseado na URL da Eneba)
const REGIONS_TO_FETCH = [
  { region: 'united_states', name: 'United States' },
  { region: 'brazil', name: 'Brazil' },
  { region: 'united_kingdom', name: 'United Kingdom' },
  { region: 'germany', name: 'Germany' },
  { region: 'france', name: 'France' },
  { region: 'japan', name: 'Japan' },
  { region: 'australia', name: 'Australia' },
  { region: 'canada', name: 'Canada' },
  { region: 'mexico', name: 'Mexico' },
  { region: 'argentina', name: 'Argentina' },
  { region: 'spain', name: 'Spain' },
  { region: 'italy', name: 'Italy' },
  { region: 'netherlands', name: 'Netherlands' },
  { region: 'sweden', name: 'Sweden' },
  { region: 'norway', name: 'Norway' },
  { region: 'global', name: 'Global' },
  { region: 'europe', name: 'Europe' }
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

// Função para extrair slugs de uma página
function extractSlugs(pageData, region) {
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
    context: region
  }));
}

// Função para paginar uma região específica
async function paginateRegion(region, maxPages = MAX_PAGES_PER_REGION) {
  console.log(`\n🌍 Processando região: ${region.name} (${region.region})`);
  
  const regionGames = [];
  let currentAfter = null;
  let pageNumber = 1;
  let totalFetched = 0;
  
  while (pageNumber <= maxPages) {
    console.log(`  📖 Página ${pageNumber}...`);
    
    const pageData = await fetchPage(currentAfter, region.region);
    
    if (!pageData || !pageData.edges || pageData.edges.length === 0) {
      console.log(`  ✅ Não há mais páginas para ${region.name}`);
      break;
    }
    
    const games = extractSlugs(pageData, region.region);
    regionGames.push(...games);
    totalFetched += games.length;
    
    console.log(`  ✅ ${games.length} jogos encontrados (Total: ${totalFetched})`);
    
    // Verificar se há próxima página
    if (games.length < GAMES_PER_PAGE) {
      console.log(`  ✅ Última página para ${region.name}`);
      break;
    }
    
    // Preparar para próxima página
    const lastGame = games[games.length - 1];
    currentAfter = lastGame.shortId;
    pageNumber++;
    
    // Pausa para não sobrecarregar a API
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  
  console.log(`  🎯 ${region.name}: ${totalFetched} jogos coletados`);
  return regionGames;
}

// Função principal para paginar todas as regiões
async function paginateAllRegions() {
  console.log('🚀 Iniciando paginação otimizada de todas as regiões...');
  console.log(`📊 Regiões a processar: ${REGIONS_TO_FETCH.length}`);
  console.log(`📄 Máximo de páginas por região: ${MAX_PAGES_PER_REGION}`);
  
  const allGames = [];
  const regionStats = {};
  const regionDetails = {};
  
  for (const region of REGIONS_TO_FETCH) {
    try {
      const regionGames = await paginateRegion(region);
      allGames.push(...regionGames);
      regionStats[region.name] = regionGames.length;
      regionDetails[region.name] = {
        region: region.region,
        gamesCount: regionGames.length,
        uniqueRegions: [...new Set(regionGames.map(g => g.region))],
        sampleGames: regionGames.slice(0, 3).map(g => ({
          name: g.name,
          region: g.region,
          price: g.price
        }))
      };
      
      // Pequena pausa entre regiões
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error(`❌ Erro ao processar ${region.name}:`, error);
      regionStats[region.name] = 0;
      regionDetails[region.name] = {
        region: region.region,
        gamesCount: 0,
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
      regionsProcessed: REGIONS_TO_FETCH.length,
      maxPagesPerRegion: MAX_PAGES_PER_REGION,
      generatedAt: new Date().toISOString(),
      apiUrl: API_URL
    },
    regionStats: regionStats,
    regionDetails: regionDetails,
    regionDiversity: regionDiversity,
    allGames: allGames,
    uniqueGames: uniqueGames
  };
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  
  console.log('\n🎉 Paginação otimizada concluída!');
  console.log(`📊 Total de jogos coletados: ${allGames.length}`);
  console.log(`📊 Jogos únicos: ${uniqueGames.length}`);
  console.log(`📊 Duplicatas removidas: ${allGames.length - uniqueGames.length}`);
  console.log(`💾 Arquivo salvo: ${OUTPUT_FILE}`);
  
  // Estatísticas por região
  console.log('\n📈 Estatísticas por região:');
  Object.entries(regionStats).forEach(([region, count]) => {
    console.log(`  ${region}: ${count} jogos`);
  });
  
  // Diversidade de regiões
  console.log('\n🌍 Diversidade de regiões encontradas:');
  Object.entries(regionDiversity)
    .sort(([,a], [,b]) => b - a)
    .forEach(([region, count]) => {
      console.log(`  ${region}: ${count} jogos`);
    });
  
  // Mostrar alguns exemplos únicos
  console.log('\n📋 Exemplos de jogos únicos encontrados:');
  uniqueGames.slice(0, 10).forEach((game, index) => {
    console.log(`${index + 1}. ${game.name}`);
    console.log(`   Slug: ${game.slug}`);
    console.log(`   Região: ${game.regionName} (${game.region})`);
    console.log(`   Preço: $${game.price ? (game.price / 100).toFixed(2) : 'N/A'}`);
    console.log('');
  });
  
  // Análise de regiões únicas
  const uniqueRegions = [...new Set(uniqueGames.map(game => game.region))];
  console.log(`🌍 Total de regiões únicas: ${uniqueRegions.length}`);
  console.log(`   Regiões: ${uniqueRegions.join(', ')}`);
}

// Executar script
if (import.meta.url === `file://${process.argv[1]}`) {
  paginateAllRegions();
}

export { paginateAllRegions };

