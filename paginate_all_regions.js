import fetch from 'node-fetch';
import fs from 'fs';

// Configuração
const API_URL = 'http://localhost:3000/Page';
const GAMES_PER_PAGE = 20;
const OUTPUT_FILE = 'all_regions_games.json';

// Diferentes contextos para capturar jogos de várias regiões
const REGIONS_TO_FETCH = [
  { country: 'US', region: 'united_states', name: 'United States' },
  { country: 'BR', region: 'brazil', name: 'Brazil' },
  { country: 'GB', region: 'united_kingdom', name: 'United Kingdom' },
  { country: 'DE', region: 'germany', name: 'Germany' },
  { country: 'FR', region: 'france', name: 'France' },
  { country: 'JP', region: 'japan', name: 'Japan' },
  { country: 'AU', region: 'australia', name: 'Australia' },
  { country: 'CA', region: 'canada', name: 'Canada' },
  { country: 'MX', region: 'mexico', name: 'Mexico' },
  { country: 'AR', region: 'argentina', name: 'Argentina' }
];

// Função para fazer requisição para uma página específica com contexto
async function fetchPageWithContext(afterValue = null, context, sortBy = 'POPULARITY_DESC') {
  const url = new URL(API_URL);
  url.searchParams.set('afterValue', afterValue || '0');
  url.searchParams.set('sort_by', sortBy);
  
  try {
    const response = await fetch(url.toString());
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Erro ao buscar página para ${context.name}:`, error);
    return null;
  }
}

// Função para extrair slugs de uma página
function extractSlugs(pageData, context) {
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

// Função para paginar uma região específica
async function paginateRegion(context, maxPages = 50) {
  console.log(`\n🌍 Processando região: ${context.name} (${context.region})`);
  
  const regionGames = [];
  let currentAfter = null;
  let pageNumber = 1;
  let totalFetched = 0;
  
  while (pageNumber <= maxPages) {
    console.log(`  📖 Página ${pageNumber}...`);
    
    const pageData = await fetchPageWithContext(currentAfter, context);
    
    if (!pageData || !pageData.edges || pageData.edges.length === 0) {
      console.log(`  ✅ Não há mais páginas para ${context.name}`);
      break;
    }
    
    const games = extractSlugs(pageData, context);
    regionGames.push(...games);
    totalFetched += games.length;
    
    console.log(`  ✅ ${games.length} jogos encontrados (Total: ${totalFetched})`);
    
    // Verificar se há próxima página
    if (games.length < GAMES_PER_PAGE) {
      console.log(`  ✅ Última página para ${context.name}`);
      break;
    }
    
    // Preparar para próxima página
    const lastGame = games[games.length - 1];
    currentAfter = lastGame.shortId;
    pageNumber++;
    
    // Pausa para não sobrecarregar a API
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log(`  🎯 ${context.name}: ${totalFetched} jogos coletados`);
  return regionGames;
}

// Função principal para paginar todas as regiões
async function paginateAllRegions() {
  console.log('🚀 Iniciando paginação de todas as regiões...');
  console.log(`📊 Regiões a processar: ${REGIONS_TO_FETCH.length}`);
  
  const allGames = [];
  const regionStats = {};
  
  for (const region of REGIONS_TO_FETCH) {
    try {
      const regionGames = await paginateRegion(region);
      allGames.push(...regionGames);
      regionStats[region.name] = regionGames.length;
      
      // Pequena pausa entre regiões
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`❌ Erro ao processar ${region.name}:`, error);
      regionStats[region.name] = 0;
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
  
  // Salvar todos os jogos em arquivo JSON
  const output = {
    metadata: {
      totalGames: allGames.length,
      uniqueGames: uniqueGames.length,
      duplicates: allGames.length - uniqueGames.length,
      regionsProcessed: REGIONS_TO_FETCH.length,
      generatedAt: new Date().toISOString(),
      apiUrl: API_URL
    },
    regionStats: regionStats,
    allGames: allGames,
    uniqueGames: uniqueGames
  };
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  
  console.log('\n🎉 Paginação de todas as regiões concluída!');
  console.log(`📊 Total de jogos coletados: ${allGames.length}`);
  console.log(`📊 Jogos únicos: ${uniqueGames.length}`);
  console.log(`📊 Duplicatas removidas: ${allGames.length - uniqueGames.length}`);
  console.log(`💾 Arquivo salvo: ${OUTPUT_FILE}`);
  
  // Estatísticas por região
  console.log('\n📈 Estatísticas por região:');
  Object.entries(regionStats).forEach(([region, count]) => {
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
  console.log(`🌍 Regiões únicas encontradas: ${uniqueRegions.length}`);
  console.log(`   Regiões: ${uniqueRegions.join(', ')}`);
}

// Executar script
if (import.meta.url === `file://${process.argv[1]}`) {
  paginateAllRegions();
}

export { paginateAllRegions };

