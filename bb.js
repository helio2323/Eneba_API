var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Cookie", "exchange=EUR; userId=702675361186605467630381466302497; fs=1");

var graphql = JSON.stringify({
  query: "",
  variables: {}
})
var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: graphql,
  redirect: 'follow'
};

fetch("https://www.eneba.com/br/store/xbox-games?page=2", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));