import fs from 'fs';

// Ler o arquivo JSON gerado
const data = JSON.parse(fs.readFileSync('games_slugs.json', 'utf8'));

// Extrair apenas os slugs
const slugs = data.games.map(game => game.slug);

// Criar arquivo apenas com slugs
const output = {
  metadata: {
    totalSlugs: slugs.length,
    generatedAt: new Date().toISOString(),
    source: 'games_slugs.json'
  },
  slugs: slugs
};

// Salvar arquivo com apenas slugs
fs.writeFileSync('game_slugs_only.json', JSON.stringify(output, null, 2));

// Também criar um arquivo de texto simples com um slug por linha
fs.writeFileSync('game_slugs.txt', slugs.join('\n'));

console.log('✅ Arquivos gerados:');
console.log(`📄 game_slugs_only.json - ${slugs.length} slugs em formato JSON`);
console.log(`📄 game_slugs.txt - ${slugs.length} slugs em formato texto`);
console.log(`📊 Total de slugs únicos: ${new Set(slugs).size}`);

// Mostrar alguns exemplos
console.log('\n📋 Exemplos de slugs:');
slugs.slice(0, 10).forEach((slug, index) => {
  console.log(`${index + 1}. ${slug}`);
});

