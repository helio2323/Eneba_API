import express from 'express';
import axios from 'axios'; // Importe o pacote 'axios' corretamente

const app = express();
const PORT = 3000;

var myHeaders = new Headers();
myHeaders.append("Cookie", "exchange=BRL; userId=702675361186605467630381466302497");

var requestOptions = {
  headers: myHeaders,
};

// Rota para a API
app.get('/api', async (req, res) => {
  try {
    const url = 'https://www.eneba.com/br/store/xbox-games?page=10';
    const response = await axios.get(url); // Use o método 'get' do pacote 'axios'

    // Transforma os dados em JSON
    const data = response.data;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter os dados da API' });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
