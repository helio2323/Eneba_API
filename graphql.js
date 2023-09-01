import express from 'express'

const app = express()

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
  

app.listen(5000, () => {
  console.log('App is runing graph')
} )


///////////////////////////////////////////////////////////


