fetch('http://localhost:3000/Jogo?slugGame=xbox-wo-long-fallen-dynasty-pc-xbox-live-key-brazil=https://www.eneba.com/xbox-wo-long-fallen-dynasty-pc-xbox-live-key-brazil')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Erro:', error));