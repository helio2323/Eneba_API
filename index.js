import express from 'express'

const app = express()

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


app.get('/', (req, res) => {
    fetch("https://www.eneba.com/br/store/xbox-games?page=1", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  });
  

app.listen(5000, () => {
    console.log('App is runing')
} ) 