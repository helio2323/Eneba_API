import express from 'express';
import fetch from 'node-fetch';

const app = express();

var myHeaders = new Headers();
myHeaders.append("Cookie", "exchange=EUR; userId=702675361186605467630381466302497; fs=1");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

app.get('/', (req, res) => {
  fetch("https://www.eneba.com/br/store/xbox-games?page=2", requestOptions)
    .then(response => response.text())
    .then(result => {
      // Processar ou manipular o resultado, se necessário
      // Por exemplo, você pode usar bibliotecas como Cheerio para extrair dados do HTML
      // Aqui, estamos enviando o resultado diretamente como resposta JSON
      res.json(result);
    })
    .catch(error => {
      console.error('error', error);
      res.status(500).json({ error: "Ocorreu um erro na solicitação" });
    });
});

app.listen(5000, () => {
  console.log('App is running');
});
