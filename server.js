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


// Extra code for checking # of requests per day
// this can be useful for budgeting

let count = 0;
let day = new Date().getDay();
checkDay();
setInterval(checkDay, 1000 * 60 * 60);

function checkDay() {
  let now = new Date().getDay();
  console.log(day, now);
  if (day !== now) {
    day = now;
    console.log("resetting count");
    count = 0;
  }
}