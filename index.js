import express from 'express'
import graphqlRoutes from './graphql.js'

const app = express()

// Usar as rotas do graphql.js
app.use('/', graphqlRoutes)

//POPULARITY_DESC
app.get('/Page', (req, res) => {
  const {afterValue} = req.query;
  const {sort_by} = req.query
  const {pesq} = req.query
  const {region} = req.query // Novo parâmetro para região


  var myHeaders = new Headers();
  myHeaders.append("accept", "*/*");
  myHeaders.append("accept-language", "en");
  myHeaders.append("baggage", "sentry-environment=production,sentry-release=eneba%3Awww%401.3281.0,sentry-public_key=0857afeb74f643e19d8c7aec931404b3,sentry-trace_id=b4b34194fe314136b591544912c9095a,sentry-sampled=false,sentry-sample_rand=0.9053605260310796,sentry-sample_rate=0");
  myHeaders.append("content-type", "application/json");
  myHeaders.append("priority", "u=1, i");
  myHeaders.append("sec-ch-ua", "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Google Chrome\";v=\"140\"");
  myHeaders.append("sec-ch-ua-mobile", "?1");
  myHeaders.append("sec-ch-ua-platform", "\"Android\"");
  myHeaders.append("sec-fetch-dest", "empty");
  myHeaders.append("sec-fetch-mode", "cors");
  myHeaders.append("sec-fetch-site", "same-origin");
  myHeaders.append("sentry-trace", "b4b34194fe314136b591544912c9095a-b44d90d6ae03dfa4-0");
  myHeaders.append("x-version", "1.3281.0");
  
var graphql = JSON.stringify({
  "operationName": "Store",
  "variables": {
    "currency": "BRL",
    "context": {
      "country": region ? region.toUpperCase() : "US",
      "region": region || "united_states",
      "language": "en"
    },
    "searchType": "DEFAULT",
    "types": ["game"],
    "drms": ["xbox"],
    "regions": ["global", "latam", "brazil", "argentina", "europe", "united_states", "turkey", "united_kingdom", "mexico", "colombia", "canada", "india", "egypt", "australia", "chile", "saudi_arabia", "south_africa", "nigeria", "singapore", "japan", "united_arab_emirates", "ukraine", "asia", "taiwan", "germany", "poland", "row", "philippines", "north_america", "spain", "france", "italy", "middle_east", "south_korea", "norway", "denmark", "hong_kong", "hungary", "netherlands", "vietnam", "belgium", "greece", "sweden", "austria", "czech_republic", "emea", "luxembourg", "new_zealand", "portugal", "switzerland"],
    "sortBy": sort_by || "POPULARITY_DESC",
    "after": afterValue === "0" ? null : afterValue,
    "first": 20,
    "price": {
      "currency": "BRL"
    },
    "url": "/store/xbox-games",
    "redirectUrl": "https://www.eneba.com/store/xbox-games",
    "text": pesq || ""
  },
  "extensions": {
    "persistedQuery": {
      "version": 1,
      "sha256Hash": "e7c4cb284593ba8790a73238ee99c8b3cceb6dae6a3bd6a3eb46de758bab688e_fa9d4ba78292d78e2783bcbfcafd66f124a700122195de5fb927b7244800cf5a3e299cb9abf45322afaac142ce79f9f89d4447d0d908f83f9ff19f79be55f40e"
    }
  }
})
    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: graphql,
    redirect: 'follow'
    };
    

  fetch("https://www.eneba.com/graphql/", requestOptions)
    .then(response => response.json())
    .then(result => {
      if (result && result.data && result.data.search && result.data.search.results) {
        const results = result.data.search.results;
        return res.json(results); // Envie apenas o campo 'results' como resposta JSON
      } else {
        return res.status(500).json({ error: "Resposta inválida da chamada GraphQL" });
      }
    })
    .catch(error => {
      console.log('error', error);
      return res.status(500).json({ error: "Ocorreu um erro ao fazer a chamada GraphQL" });
    });
});


app.listen(3000, () => {
  console.log('App is runing')
} )


///////////////////////////////////////////////////////////


app.get('/Graphql', (req, res) => {
  const { searchAfter } = req.query;

  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Accept-Language", "pt-PT,pt;q=0.9,en-US;q=0.8,en;q=0.7");
  myHeaders.append("Connection", "keep-alive");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Origin", "https://api.catalysis-hub.org");
  myHeaders.append("Sec-Fetch-Dest", "empty");
  myHeaders.append("Sec-Fetch-Mode", "cors");
  myHeaders.append("Sec-Fetch-Site", "same-origin");
  myHeaders.append("User-Agent", "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36");
  myHeaders.append("X-KL-saas-Ajax-Request", "Ajax_Request");
  myHeaders.append("sec-ch-ua", "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"");
  myHeaders.append("sec-ch-ua-mobile", "?1");
  myHeaders.append("sec-ch-ua-platform", "\"Android\"");
  
  var query = `{
    reactions(pubId: "YohannesCombined2023",
    first: 20, after: "${searchAfter}",
    order: "chemicalComposition") {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          Equation
          sites
          id
          pubId
          dftCode
          dftFunctional
          reactants
          products
          facet
          reactionEnergy
          activationEnergy
          surfaceComposition
          chemicalComposition
          reactionSystems {
            name
            aseId
          }
        }
      }
    }
  }`;
  
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify({ query }), // Passa a query direto no corpo da requisição
    redirect: 'follow'
  };
    
  fetch("https://api.catalysis-hub.org/graphql?", requestOptions)
  .then(response => response.json())
  .then(result => {
    console.log("API response:", result);
    if (result.data && result.data.reactions) {
      return res.json(result);
    } else {
      return res.status(500).json({ error: 'Resposta da API inválida' });
    }
  })
  .catch(error => console.log('error', error));
});
