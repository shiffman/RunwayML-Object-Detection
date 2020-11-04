const { HostedModel } = require("@runwayml/hosted-models");
const express = require("express");
const app = express();

// make all the files in 'public' available
app.use(express.static("public"));
app.use(express.json({ limit: "10mb" }));

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

const model = new HostedModel({
  url: process.env.RUNWAYURL,
  token: process.env.RUNWAYTOKEN
});

app.post("/runwayml", async (request, response) => {
  const inputs = request.body;
  const outputs = await model.query(inputs);
  response.json(outputs);
});
