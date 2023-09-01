import express from 'express';

const app = express();
const PORT = 3000;

// Rota para a API
app.get('/api', async (req, res) => {
  try {
    const url = 'https://www.eneba.com/br/store/xbox-games?page=10';

    // Cabeçalhos
    const myHeaders = new Headers();
    myHeaders.append("Cookie", "exchange=BRL; userId=702675361186605467630381466302497");

    // Opções de requisição
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    // Faz a chamada HTTP usando 'fetch'
    const response = await fetch(url, requestOptions);
    
    // Verifica o status da resposta
    if (!response.ok) {
      throw new Error('Erro ao obter os dados da API');
    }

    // Transforma os dados em JSON
    const data = await response.json();

    // Converte os dados para JSON e envia a resposta
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
