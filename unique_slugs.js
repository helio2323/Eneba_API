import fs from 'fs';

// Ler o arquivo JSON gerado
const data = JSON.parse(fs.readFileSync('games_slugs.json', 'utf8'));

// Extrair apenas os slugs únicos
const allSlugs = data.games.map(game => game.slug);
const uniqueSlugs = [...new Set(allSlugs)];

// Criar arquivo com slugs únicos
const output = {
  metadata: {
    totalUniqueSlugs: uniqueSlugs.length,
    totalRecords: allSlugs.length,
    duplicates: allSlugs.length - uniqueSlugs.length,
    generatedAt: new Date().toISOString(),
    source: 'games_slugs.json'
  },
  uniqueSlugs: uniqueSlugs
};

// Salvar arquivo com slugs únicos
fs.writeFileSync('unique_game_slugs.json', JSON.stringify(output, null, 2));

// Também criar um arquivo de texto simples com um slug único por linha
fs.writeFileSync('unique_game_slugs.txt', uniqueSlugs.join('\n'));

console.log('✅ Arquivos de slugs únicos gerados:');
console.log(`📄 unique_game_slugs.json - ${uniqueSlugs.length} slugs únicos em formato JSON`);
console.log(`📄 unique_game_slugs.txt - ${uniqueSlugs.length} slugs únicos em formato texto`);
console.log(`📊 Total de registros: ${allSlugs.length}`);
console.log(`📊 Slugs únicos: ${uniqueSlugs.length}`);
console.log(`📊 Duplicatas removidas: ${allSlugs.length - uniqueSlugs.length}`);

// Mostrar todos os slugs únicos
console.log('\n📋 Todos os slugs únicos encontrados:');
uniqueSlugs.forEach((slug, index) => {
  console.log(`${index + 1}. ${slug}`);
});

