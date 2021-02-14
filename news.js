const NewsAPI = require("newsapi");
const newsapi = new NewsAPI("Please put your news API key here");
const AWS = require("aws-sdk");

let awsConfig = {
  region: "us-east-1",
  endpoint: "http://dynamodb.us-east-1.amazonaws.com",
  accesskeyId: "Please put your access keyId here",
  secretAccessKey: "Please put your secret access key here",
};
AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();

newsapi.v2
  .topHeadlines({
    q: "COVID-19",
    from: "2021-02-12",
    to: "2021-02-14",
    language: "en",
    country: "ca",
  })
  .then((response) => {
    const newsArray = response.articles.map((res) => {
      return {
        Url: res.url,
        Title: res.title,
        Publication_name: res.author,
        Date: res.publishedAt,
      };
    });

    let save = function () {
      let params = {
        TableName: "newsList",
        Item: JSON.stringify(newsArray),
      };

      docClient.put(params, (err, data) => {
        if (err) {
          console.log(JSON.stringify(err));
        } else {
          console.log("Saved Successfully");
        }
      });
    };
    save();
  })
  .catch((error) => {
    console.log(error.message);
  });
