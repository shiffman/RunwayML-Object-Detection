const fs = require("fs");
require("dotenv").config();

// Extra code for checking # of requests per day
// this can be useful for budgeting
const settings = fs.readFileSync("count.json", "utf-8");
let count = JSON.parse(settings).count;
console.log(`count: ${count}`);

// Today!
let day = new Date().getDay();
// checkDay();
// Check once every minute
// setInterval(checkDay, 1000 * 60);

// function checkDay() {
//   let now = new Date().getDay();
//   // Is it tomorrow?
//   if (day !== now) {
//     day = now;
//     console.log("resetting count!");
//     count = 0;
//   }
//   console.log("writing out count");
//   fs.writeFileSync("count.json", JSON.stringify({ count }), "utf-8");
// }

// A daily limit of 100 is $1.00 per day
const DAILYLIMIT = parseInt(process.env.DAILYLIMIT);
console.log(DAILYLIMIT);

// RunwayML communication
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
  token: process.env.RUNWAYTOKEN,
});

console.log("querying model");
model.info().then((info) => {
  console.log("got info");
  console.log(info);
});

app.get("/count", async (request, response) => {
  response.json({ count });
});

app.post("/runwayml", async (request, response) => {
  console.log(count);
  if (count < DAILYLIMIT) {
    const inputs = request.body;
    count++;
    const outputs = await model.query(inputs);
    outputs.status = "success";
    response.json(outputs);
  } else {
    response.json({ status: "limit" });
  }
});
