import express from 'express'

const app = express()

app.get('/Jogo', (req, res) => {
  const {slugGame} = req.query;
  const {linkGame} = req.query

  var myHeaders = new Headers();
  myHeaders.append("accept", "*/*");
  myHeaders.append("accept-language", "en");
  myHeaders.append("baggage", "sentry-environment=production,sentry-release=eneba%3Awww%401.3281.0,sentry-public_key=458d6cf95f4e4bcfb9242f27f2b7371a,sentry-trace_id=c23b30ee062e02911255b1acd17ce98a,sentry-sampled=false,sentry-sample_rand=0.9766991404500085,sentry-sample_rate=0");
  myHeaders.append("content-type", "application/json");
  myHeaders.append("priority", "u=1, i");
  myHeaders.append("sec-ch-ua", "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Google Chrome\";v=\"140\"");
  myHeaders.append("sec-ch-ua-mobile", "?1");
  myHeaders.append("sec-ch-ua-platform", "\"Android\"");
  myHeaders.append("sec-fetch-dest", "empty");
  myHeaders.append("sec-fetch-mode", "cors");
  myHeaders.append("sec-fetch-site", "same-origin");
  myHeaders.append("sentry-trace", "c23b30ee062e02911255b1acd17ce98a-a32cbdeb5734510c-0");
  myHeaders.append("x-version", "1.3281.0");
  
  var graphql = JSON.stringify({
    "operationName": "WickedNoCache",
    "variables": {
      "isAutoRenewActive": false,
      "isProductVariantSearch": false,
      "isCheapestAuctionIncluded": true,
      "currency": "BRL",
      "context": {
        "country": "BR",
        "region": "brazil",
        "language": "en"
      },
      "slug": slugGame,
      "language": "en",
      "version": 5,
      "abTests": ["CFD755"]
    },
    "extensions": {
      "persistedQuery": {
        "version": 1,
        "sha256Hash": "28ae6d27538692975dde9284d4f509cd37ab1e0fc13cec44d13569c482b01b46_0c03a7e4f5e9217299a2aba0061b39e9513ec8ab90158a46df0c21918118431278e9e0f07334b64688e1201c009aacc4d3ac2841ec451ea40d2920c92682e207"
      }
    }
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: graphql,
    redirect: 'follow',
    referrer: linkGame || "https://www.eneba.com/xbox-assassins-creed-valhalla-xbox-live-key-brazil"
  };

  fetch("https://www.eneba.com/graphql/", requestOptions)
    .then(response => {
      return response.text();
    })
    .then(result => {
      try {
        const jsonResult = JSON.parse(result);
        res.json(jsonResult);
      } catch (error) {
        console.error('Erro ao fazer parse do JSON:', error);
        res.status(500).json({ error: "Erro ao processar resposta da API" });
      }
    })
    .catch(error => {
      console.error('Erro na requisição:', error);
      res.status(500).json({ error: "Erro na requisição para a API" });
    });
});

export default app;