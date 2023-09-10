var myHeaders = new Headers();
myHeaders.append("authority", "www.eneba.com");
myHeaders.append("accept", "*/*");
myHeaders.append("accept-language", "pt_BR");
myHeaders.append("content-type", "application/json");
myHeaders.append("cookie", "userId=016651737941421848825562432377430; region=brazil; exchange=BRL; _gcl_au=1.1.587405659.1692365192; cconsent=1; _fbp=fb.1.1692365710501.1506513370; auth=%7B%22accessToken%22%3A%22eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI4NzViN2NhMi02MDIyLTExZTgtYWZhYy0wMjQyYWMxNTAwMGEiLCJqdGkiOiIxODk1ZWU0Mi00M2IxLTExZWUtYTdiNC1iMmZjOGExZjkyZjgiLCJpYXQiOjE2OTMwMTM4MzksIm5iZiI6MTY5MzAxMzgzOSwiZXhwIjoxNjk1NjkyMjM5LCJzdWIiOiJjOGFhYTEyMC0yYjJlLTExZWQtYjUwZC03MjA0ZDE1ZTIxZGMiLCJzY29wZSI6InVzZXIiLCJuYW1lIjoiSEVMSU8gRkVSTkFOREVTIExJTUEiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJoZWxpb2ZyZWlzbGltYUBnbWFpbC5jb20iLCJlbWFpbCI6ImhlbGlvZnJlaXNsaW1hQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJjb3VudHJ5IjoiQlJBIiwiYWRkcmVzcyI6IlJ1YSBBcGFyZWNpZG8gTW9yYmlkZWxpLCAyNzAsIE1vcmJpZGVsbGkiLCJ6aXAiOiIzNzY0MC0wMDAiLCJjaXR5IjoiRXh0cmVtYSIsInN0YXRlIjoiTUciLCJyb2xlcyI6WyJST0xFX0VNQUlMX1ZFUklGSUVEIiwiUk9MRV9QSE9ORV9WRVJJRklFRCIsIlJPTEVfSU5ESVZJRFVBTCIsIlJPTEVfVVNFUiJdLCJwZXJtaXNzaW9ucyI6W10sImVuYWJsZWQiOnRydWUsImJhbm5lZCI6ZmFsc2UsImZyb3plbiI6ZmFsc2UsImludGVybmFsX21lcmNoYW50IjpmYWxzZSwicGhvbmVfbnVtYmVyIjoiMTE5OTAyNzEwNDciLCJwaG9uZV9udW1iZXJfcHJlZml4IjoiKzU1IiwicGhvbmVfbnVtYmVyX2NvbmZpcm1lZF9hdCI6IjIwMjItMDktMjBUMjE6MjA6MTkrMDA6MDAiLCJhcHBfb3RwX2VuYWJsZWRfYXQiOiIyMDIyLTEwLTE0VDIyOjU3OjU1KzAwOjAwIiwicGhvbmVfb3RwX2VuYWJsZWRfYXQiOiIyMDIyLTA5LTIwVDIxOjIxOjQ1KzAwOjAwIiwicGhvbmVfb3RwX3JlcXVlc3RlZF9hdCI6IjIwMjItMTAtMTRUMjI6Mzk6NDArMDA6MDAiLCJwaG9uZV9vdHBfcGhvbmVfbnVtYmVyIjoiMTE5OTAyNzEwNDciLCJwaG9uZV9vdHBfcGhvbmVfbnVtYmVyX3ByZWZpeCI6Iis1NSIsIm1mYV9lbmFibGVkX2F0IjoiMjAyMi0wOS0yMFQyMToyMTo0NSswMDowMCIsImdvb2dsZV9pZCI6IjEwMzE0MTY3MDYyNjQ5MDQzMDUwMSIsInByaXZpbGVnZXNfZXhwaXJlc19hdCI6IjIwMjMtMDgtMjZUMDE6NTc6MTkrMDA6MDAiLCJwcml2aWxlZ2VzX2R1cmF0aW9uIjoiUDBZME0wRFQwSDIwTTBTIiwibG9jYWxlIjoiZW5fVVMiLCJpbml0aWFsX3RyYWZmaWNfc291cmNlIjoidXRtY3NyPShkaXJlY3QpfHV0bWNtZD0obm9uZSl8dXRtY2NuPShub3Qgc2V0KSJ9.pgXMv2lhtKN9xID9AXgy-5i6-gY2TXC-s6ReI-IduhtBPMpAMY9rKgBvO9F5LEttONjFVa6VjtxouEpIMO1eWOQJ47yT3YfLifYw13uva6S54A2oJa6s3GSg8YapwQagQ9S_ev2vbpJFeIC_RfUPF3tHXTMGo2kr_IhaMbxYQR0%22%2C%22refreshToken%22%3A%22def502002cfda4caf34435d971d5d42ad62dee868723934f6307d801b610a2bff8ed2c8bf986980bc30bc37ef93e5ca13246ffd634756deeaca633857ab4a243f960026de7341005d922c1987af39c31c8c0c898d430d8aa470de2435c7b8dd598d73628c75505a4ccfbb51276f45a899e4410f426c3116ecb02812d1f807adab9db9056f14898c669d01d0e996b2412f46e75c00001f7960ae39f3e2e99d379e4a84fd8e063a475585f2cd0e4ea40687d0f3d4dbd853ead005a0d39ed1507d382efd7acaf50426a291e527ba0f66291454445b89c7b41ffdb905829007e413a963d57ce313961a8426658eb45b3ac26e0b42cdc5c1bad18da60c8b2ee81f8b0d8ab77660c60aa975a675e7f5dec852d18c1c7bfbe85027b14387def3a7dce67ff87b308595c3d0a2cb49cc23c70019f28b42d5928ea779e2a19a5e4b83f75f77fad0269aa5091141c0188b2e3ef2eb995%22%7D; af_id=chief117br; _ga_D9L6N0DH7Y=GS1.1.1693086325.1.1.1693087413.0.0.0; lng=br; zd=95; crt=d60bbbbcc8a54e8a882c3e28adb3f465.8ab94815ac4523cfc2b1d3a51bcef099f53c4dd1d1e3cec9c66e407c77f7c2f8; scm=d.brazil.08d75049100e03ec.f0ef3e40d7b94cf97dfbfb56459aab0e6039d2675867d71fadd95415a34de53c; _gid=GA1.2.1439969394.1694365697; _ga=GA1.1.1047347883.1692365191; cf_clearance=yPaSGGH8I74yEek5T4A3KT1plaag1nRr8etZ.sGj__c-1694377714-0-1-2afe0a06.ff5b7cbc.7dff55e6-0.2.1694377714; _ga_DLP0VZCBXJ=GS1.1.1694377714.81.1.1694377723.51.0.0");
myHeaders.append("origin", "https://www.eneba.com");
myHeaders.append("referer", "https://www.eneba.com/br/store/xbox-games?page=1");
myHeaders.append("sec-ch-ua", "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"");
myHeaders.append("sec-ch-ua-mobile", "?0");
myHeaders.append("sec-ch-ua-platform", "\"Windows\"");
myHeaders.append("sec-fetch-dest", "empty");
myHeaders.append("sec-fetch-mode", "cors");
myHeaders.append("sec-fetch-site", "same-origin");
myHeaders.append("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36");
myHeaders.append("x-kl-saas-ajax-request", "Ajax_Request");
myHeaders.append("x-version", "1.876.0");

var graphql = JSON.stringify({
  query: "query QuickProductSearch($text: String!, $currency: AvailableCurrencyType, $sort: SearchSortEnum, $suggestCollection: Boolean, $suggestCategory: Boolean, $context: ContextInput) {\n  quickSearch: search(\n    first: 6\n    text: $text\n    searchType: DEFAULT\n    sortBy: $sort\n    suggestCollection: $suggestCollection\n    suggestCategory: $suggestCategory\n    context: $context\n  ) {\n    results {\n      totalCount\n      totalCountRelation\n      edges {\n        node {\n          ...BasicProduct\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    popularSearches {\n      slug\n      text\n      type\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment BasicProduct on Product {\n  shortId\n  name\n  slug\n  regions {\n    code\n    name\n    __typename\n  }\n  type {\n    value\n    __typename\n  }\n  drm {\n    name\n    slug\n    __typename\n  }\n  cashback {\n    ...Cashback\n    __typename\n  }\n  cover(size: 300) {\n    ...MultiSizeImage\n    __typename\n  }\n  coverMobile: cover(size: 95) {\n    ...MultiSizeImage\n    __typename\n  }\n  promotion {\n    available\n    __typename\n  }\n  cheapestAuction {\n    ...PreferredOrCheapestAuction\n    __typename\n  }\n  wishItemCount\n  category\n  __typename\n}\n\nfragment PreferredOrCheapestAuction on Auction {\n  id\n  isAddableToCart\n  isInStock\n  price(currency: $currency) {\n    ...Money\n    __typename\n  }\n  isPreOrder\n  merchant {\n    slug\n    displayname\n    physicalReviews(first: 5, after: null) {\n      ...PhysicalReviewConnection\n      __typename\n    }\n    paymentAuthorizationTerm {\n      value\n      __typename\n    }\n    deliveryAuthorizationTerm {\n      value\n      __typename\n    }\n    __typename\n  }\n  discountLabelFromMsrp\n  msrp(currency: $currency) {\n    ...Money\n    __typename\n  }\n  promotionalDiscountLabel\n  promotionalDiscountLabelFromMsrp\n  promotionalPrice(currency: $currency) {\n    ...Money\n    __typename\n  }\n  flags\n  __typename\n}\n\nfragment Money on Money {\n  amount\n  currency\n  __typename\n}\n\nfragment PhysicalReviewConnection on PhysicalReviewConnection {\n  totalCount\n  edges {\n    node {\n      id\n      text\n      auto\n      rating\n      autoText\n      orderItemName\n      submittedAt\n      submittedDiff\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment MultiSizeImage on MultiSizeImage {\n  src\n  src2x\n  src3x\n  srcTiny\n  __typename\n}\n\nfragment Cashback on Cashback {\n  valuePercent\n  secondsUntilExpiration\n  __typename\n}",
  variables: {"currency":"BRL","context":{"country":"BR","region":"brazil","language":"pt_BR"},"text":"red dead","sort":"POPULARITY_DESC","suggestCollection":true,"suggestCategory":true}
})
var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: graphql,
  redirect: 'follow'
};

fetch("https://www.eneba.com/graphql/", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));