fetch("https://www.eneba.com/graphql/", {
    "headers": {
      "accept": "*/*",
      "accept-language": "en",
      "baggage": "sentry-environment=production,sentry-release=eneba%3Awww%401.3281.0,sentry-public_key=458d6cf95f4e4bcfb9242f27f2b7371a,sentry-trace_id=c23b30ee062e02911255b1acd17ce98a,sentry-sampled=false,sentry-sample_rand=0.9766991404500085,sentry-sample_rate=0",
      "content-type": "application/json",
      "priority": "u=1, i",
      "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Google Chrome\";v=\"140\"",
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": "\"Android\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "sentry-trace": "c23b30ee062e02911255b1acd17ce98a-a32cbdeb5734510c-0",
      "x-version": "1.3281.0"
    },
    "referrer": "https://www.eneba.com/xbox-assassins-creed-valhalla-xbox-live-key-brazil",
    "body": "{\"operationName\":\"WickedNoCache\",\"variables\":{\"isAutoRenewActive\":false,\"isProductVariantSearch\":false,\"isCheapestAuctionIncluded\":true,\"currency\":\"BRL\",\"context\":{\"country\":\"BR\",\"region\":\"brazil\",\"language\":\"en\"},\"slug\":\"xbox-assassins-creed-valhalla-xbox-live-key-brazil\",\"language\":\"en\",\"version\":5,\"abTests\":[\"CFD755\"]},\"extensions\":{\"persistedQuery\":{\"version\":1,\"sha256Hash\":\"28ae6d27538692975dde9284d4f509cd37ab1e0fc13cec44d13569c482b01b46_0c03a7e4f5e9217299a2aba0061b39e9513ec8ab90158a46df0c21918118431278e9e0f07334b64688e1201c009aacc4d3ac2841ec451ea40d2920c92682e207\"}}}",
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  })
  .then(response => {
    console.log('Response status:', response.status);
    return response.text();
  })
  .then(result => {
    console.log('Response:', result);
  })
  .catch(error => {
    console.error('Error:', error);
  });