import fetch from 'node-fetch';
import fs from 'fs';

// Configuração
const API_URL = 'http://localhost:3000/Page';
const GAMES_PER_PAGE = 20;
const MAX_GAMES = 10000; // Máximo de jogos disponíveis
const OUTPUT_FILE = 'games_slugs.json';

// Função para fazer requisição para uma página específica
async function fetchPage(afterValue = null, sortBy = 'POPULARITY_DESC') {
  const url = new URL(API_URL);
  url.searchParams.set('afterValue', afterValue || '0');
  url.searchParams.set('sort_by', sortBy);
  
  try {
    const response = await fetch(url.toString());
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar página:', error);
    return null;
  }
}

// Função para extrair slugs de uma página
function extractSlugs(pageData) {
  if (!pageData || !pageData.edges) {
    return [];
  }
  
  return pageData.edges.map(edge => ({
    slug: edge.node.slug,
    name: edge.node.name,
    shortId: edge.node.shortId,
    price: edge.node.cheapestAuction?.price?.amount || null,
    currency: edge.node.cheapestAuction?.price?.currency || 'BRL'
  }));
}

// Função principal para paginar todas as páginas
async function paginateAllGames() {
  console.log('🚀 Iniciando paginação de todos os jogos...');
  console.log(`📊 Total estimado: ${MAX_GAMES} jogos`);
  console.log(`📄 Jogos por página: ${GAMES_PER_PAGE}`);
  
  const allGames = [];
  let currentAfter = null;
  let pageNumber = 1;
  let totalFetched = 0;
  
  // Criar arquivo de progresso
  const progressFile = 'progress.json';
  
  try {
    while (totalFetched < MAX_GAMES) {
      console.log(`\n📖 Buscando página ${pageNumber}...`);
      
      const pageData = await fetchPage(currentAfter);
      
      if (!pageData || !pageData.edges || pageData.edges.length === 0) {
        console.log('✅ Não há mais páginas disponíveis');
        break;
      }
      
      const games = extractSlugs(pageData);
      allGames.push(...games);
      totalFetched += games.length;
      
      console.log(`✅ Página ${pageNumber}: ${games.length} jogos encontrados`);
      console.log(`📈 Total coletado: ${totalFetched} jogos`);
      
      // Salvar progresso a cada 10 páginas
      if (pageNumber % 10 === 0) {
        const progress = {
          pageNumber,
          totalFetched,
          lastAfter: currentAfter,
          timestamp: new Date().toISOString()
        };
        fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2));
        console.log(`💾 Progresso salvo: página ${pageNumber}`);
      }
      
      // Verificar se há próxima página
      if (games.length < GAMES_PER_PAGE) {
        console.log('✅ Última página alcançada');
        break;
      }
      
      // Preparar para próxima página
      const lastGame = games[games.length - 1];
      currentAfter = lastGame.shortId; // Usar shortId para paginação
      pageNumber++;
      
      // Pequena pausa para não sobrecarregar a API
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Salvar todos os jogos em arquivo JSON
    const output = {
      metadata: {
        totalGames: allGames.length,
        totalPages: pageNumber - 1,
        generatedAt: new Date().toISOString(),
        apiUrl: API_URL
      },
      games: allGames
    };
    
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    
    console.log('\n🎉 Paginação concluída!');
    console.log(`📊 Total de jogos coletados: ${allGames.length}`);
    console.log(`📄 Total de páginas processadas: ${pageNumber - 1}`);
    console.log(`💾 Arquivo salvo: ${OUTPUT_FILE}`);
    
    // Remover arquivo de progresso
    if (fs.existsSync(progressFile)) {
      fs.unlinkSync(progressFile);
    }
    
    // Estatísticas adicionais
    const uniqueSlugs = new Set(allGames.map(game => game.slug));
    console.log(`🔍 Slugs únicos: ${uniqueSlugs.size}`);
    
    // Mostrar alguns exemplos
    console.log('\n📋 Exemplos de jogos encontrados:');
    allGames.slice(0, 5).forEach((game, index) => {
      console.log(`${index + 1}. ${game.name}`);
      console.log(`   Slug: ${game.slug}`);
      console.log(`   Preço: R$ ${game.price ? (game.price / 100).toFixed(2) : 'N/A'}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Erro durante a paginação:', error);
    
    // Salvar progresso em caso de erro
    const progress = {
      pageNumber,
      totalFetched,
      lastAfter: currentAfter,
      error: error.message,
      timestamp: new Date().toISOString()
    };
    fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2));
    console.log(`💾 Progresso salvo em caso de erro: ${progressFile}`);
  }
}

// Função para retomar paginação de onde parou
async function resumePagination() {
  const progressFile = 'progress.json';
  
  if (!fs.existsSync(progressFile)) {
    console.log('❌ Arquivo de progresso não encontrado. Iniciando paginação do zero.');
    await paginateAllGames();
    return;
  }
  
  try {
    const progress = JSON.parse(fs.readFileSync(progressFile, 'utf8'));
    console.log(`🔄 Retomando paginação da página ${progress.pageNumber}...`);
    console.log(`📊 Jogos já coletados: ${progress.totalFetched}`);
    
    // Continuar da página onde parou
    // (Implementar lógica de retomada se necessário)
    
  } catch (error) {
    console.error('❌ Erro ao ler progresso:', error);
    await paginateAllGames();
  }
}

// Executar script
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  
  if (args.includes('--resume')) {
    resumePagination();
  } else {
    paginateAllGames();
  }
}

export { paginateAllGames, resumePagination };

