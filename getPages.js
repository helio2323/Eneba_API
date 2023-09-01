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

var raw = JSON.stringify({
  "query": "query{reactions (pubId: \"YohannesCombined2023\",\n        first: 20, after: \"YXJyYXljb25uZWN0aW9uOjIxOQ==\",\n        order: \"chemicalComposition\") {\n        totalCount\n        pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n        }\n        edges {\n          node {\n            Equation\n            sites\n            id\n            pubId\n            dftCode\n            dftFunctional\n            reactants\n            products\n            facet\n            reactionEnergy\n            activationEnergy\n            surfaceComposition\n            chemicalComposition\n            reactionSystems {\n              name\n              aseId\n            }\n          }\n        }\n        }}",
  "variables": null
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://api.catalysis-hub.org/graphql?", requestOptions)
.then(response => response.json())
.then(result => {
  const endCursor = result.data.reactions.pageInfo.endCursor;
  return res.json(endCursor);
})

