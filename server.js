
const { HostedModel } = require('@runwayml/hosted-models');
const express = require("express");
const app = express();

// make all the files in 'public' available
app.use(express.static("public"));

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});


const model = new HostedModel({
  url: "https://skygan-70dc7f3a.hosted-models.runwayml.cloud/v1/",
  token: "32H27Z8P299CYIs+p9xayA==",
});


app.post('/runwayml', async (request, response) => {
  const inputs = request.body;
  console.log(inputs);
  const outputs = await model.query(inputs);
  response.json(outputs);
});

