var myHeaders = new Headers();
myHeaders.append("authority", "www.eneba.com");
myHeaders.append("accept", "*/*");
myHeaders.append("accept-language", "pt_BR");
myHeaders.append("content-type", "application/json");
myHeaders.append("cookie", "userId=016651737941421848825562432377430; region=brazil; exchange=BRL; _gcl_au=1.1.587405659.1692365192; _fbp=fb.1.1692365710501.1506513370; _ga_D9L6N0DH7Y=GS1.1.1693086325.1.1.1693087413.0.0.0; lng=br; cconsent=1; _ga=GA1.1.1047347883.1692365191; zd=79; cf_clearance=YykMod0PFQDjbGcBCUvUm8jZoB14_EjjN3eILedrr8A-1695939854-0-1-3c4d1a42.ce7787c3.6b4c45a2-0.2.1695939854; _ga_DLP0VZCBXJ=GS1.1.1695939824.112.1.1695939855.29.0.0");
myHeaders.append("origin", "https://www.eneba.com");
myHeaders.append("referer", "https://www.eneba.com/br/store/xbox-games");
myHeaders.append("sec-ch-ua", "\"Google Chrome\";v=\"117\", \"Not;A=Brand\";v=\"8\", \"Chromium\";v=\"117\"");
myHeaders.append("sec-ch-ua-mobile", "?1");
myHeaders.append("sec-ch-ua-platform", "\"Android\"");
myHeaders.append("sec-fetch-dest", "empty");
myHeaders.append("sec-fetch-mode", "cors");
myHeaders.append("sec-fetch-site", "same-origin");
myHeaders.append("user-agent", "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Mobile Safari/537.36");
myHeaders.append("x-kl-saas-ajax-request", "Ajax_Request");
myHeaders.append("x-version", "1.966.0");

var graphql = JSON.stringify({
  query: "query Store($after: String, $first: Int, $text: String, $genres: [String], $os: [OS], $languages: [String], $price: Range, $drms: [String], $regions: [String], $countries: [String], $tags: [String], $types: [ProductType], $store: String, $searchType: SearchType, $digitalCurrency: [String], $preorder: Boolean, $currency: AvailableCurrencyType, $autoCorrect: Boolean, $context: ContextInput, $parentShortId: String, $categories: [ProductCategoryEnum], $url: String!, $sortBy: SearchSortEnum, $redirectUrl: String!, $contentContext: Content_ContextInput, $preferredProducts: [String]) {\n  search(\n    after: $after\n    first: $first\n    text: $text\n    genres: $genres\n    os: $os\n    languages: $languages\n    price: $price\n    drms: $drms\n    regions: $regions\n    countries: $countries\n    tags: $tags\n    types: $types\n    store: $store\n    sortBy: $sortBy\n    searchType: $searchType\n    digitalCurrency: $digitalCurrency\n    preorder: $preorder\n    autoCorrect: $autoCorrect\n    context: $context\n    categories: $categories\n    parentShortId: $parentShortId\n    preferredProducts: $preferredProducts\n  ) {\n    filters {\n      ... on RangeFilter {\n        title\n        slug\n        __typename\n      }\n      ... on GenericFilter {\n        title\n        slug\n        __typename\n      }\n      ... on PagerFilter {\n        title\n        slug\n        count\n        from\n        size\n        __typename\n      }\n      ... on ChoiceFilter {\n        title\n        slug\n        items {\n          count\n          name\n          value\n          active\n          slug\n          categoryType\n          __typename\n        }\n        type\n        __typename\n      }\n      ... on ProductFilter {\n        title\n        slug\n        product {\n          ...BasicProduct\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    results {\n      totalCount\n      totalCountRelation\n      edges {\n        node {\n          ...BasicProduct\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  breadcrumbs(url: $url, context: $context, currency: $currency) {\n    label\n    ... on SeoCategoryBreadcrumb {\n      slug\n      type\n      __typename\n    }\n    ... on ProductBreadcrumb {\n      slug\n      __typename\n    }\n    ... on UrlBreadcrumb {\n      url\n      __typename\n    }\n    __typename\n  }\n  Content_accessRule(url: $redirectUrl, context: $contentContext) {\n    statusCode\n    location\n    __typename\n  }\n}\n\nfragment BasicProduct on Product {\n  shortId\n  name\n  slug\n  regions {\n    code\n    name\n    __typename\n  }\n  type {\n    value\n    __typename\n  }\n  drm {\n    name\n    slug\n    __typename\n  }\n  cashback {\n    valuePercent\n    secondsUntilExpiration\n    __typename\n  }\n  cover(size: 300) {\n    ...MultiSizeImage\n    __typename\n  }\n  coverMobile: cover(size: 95) {\n    ...MultiSizeImage\n    __typename\n  }\n  promotion {\n    available\n    __typename\n  }\n  cheapestAuction {\n    ...PreferredOrCheapestAuction\n    __typename\n  }\n  wishItemCount\n  category\n  __typename\n}\n\nfragment PreferredOrCheapestAuction on Auction {\n  id\n  isAddableToCart\n  isInStock\n  price(currency: $currency) {\n    ...Money\n    __typename\n  }\n  isPreOrder\n  merchant {\n    slug\n    displayname\n    physicalReviews(first: 5, after: null) {\n      ...PhysicalReviewConnection\n      __typename\n    }\n    paymentAuthorizationTerm {\n      value\n      __typename\n    }\n    deliveryAuthorizationTerm {\n      value\n      __typename\n    }\n    __typename\n  }\n  discountLabelFromMsrp\n  msrp(currency: $currency) {\n    ...Money\n    __typename\n  }\n  promotionalDiscountLabel\n  promotionalDiscountLabelFromMsrp\n  promotionalPrice(currency: $currency) {\n    ...Money\n    __typename\n  }\n  flags\n  __typename\n}\n\nfragment Money on Money {\n  amount\n  currency\n  __typename\n}\n\nfragment PhysicalReviewConnection on PhysicalReviewConnection {\n  totalCount\n  edges {\n    node {\n      id\n      text\n      auto\n      rating\n      autoText\n      orderItemName\n      submittedAt\n      submittedDiff\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment MultiSizeImage on MultiSizeImage {\n  src\n  src2x\n  src3x\n  srcTiny\n  __typename\n}",
  variables: {"currency":"BRL","context":{"country":"BR","region":"brazil","language":"pt_BR"},"searchType":"DEFAULT","types":["game"],"drms":["xbox"],"regions":["argentina","brazil","global","latam"],"sortBy":"POPULARITY_DESC","first":20,"price":{"currency":"BRL"},"contentContext":{"country":"BR","region":"brazil","language":"pt_BR"},"url":"/br/store/xbox-games","redirectUrl":"https://www.eneba.com/br/store/xbox-games"}
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