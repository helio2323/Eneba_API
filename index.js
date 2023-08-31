import express from 'express'

const app = express()

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
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
  });
  

app.listen(5000, () => {
    console.log('App is runing')
} ) 