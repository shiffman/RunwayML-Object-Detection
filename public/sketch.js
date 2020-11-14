let countSpan;
let video;
let detections = [];

function setup() {
  createCanvas(320, 240);
  video = createCapture(VIDEO);
  video.size(320, 240);
  // video.hide();
  background(0);
  let generateButton = createButton("detect");
  generateButton.mousePressed(objectDetect);
  countSpan = createSpan("");
}

function draw() {
  image(video.get(), 0, 0, width, height);

  for (let i = 0; i < detections.length; i++) {
    let cube = detections[i];
    let x1 = cube[0] * width;
    let y1 = cube[1] * height;
    let x2 = cube[2] * width;
    let y2 = cube[3] * height;
    rectMode(CORNERS);
    stroke(255);
    noFill();
    strokeWeight(8);
    rect(x1, y1, x2, y2);
  }
}

async function objectDetect() {
  let videoCopy = video.get();
  videoCopy.loadPixels();
  const inputImage64 = videoCopy.canvas.toDataURL();

  // console.log(inputImage64);
  console.log("sending image");

  const inputs = {
    image: inputImage64,
    threshold: 0.5,
  };

  const data = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(inputs),
  };
  const response = await fetch("runwayml", data);
  const outputs = await response.json();
  console.log(outputs);
  detections = outputs.bounding_boxes;

  // If we get something back with no image
  if (outputs.status == "limit") {
    console.log("daily limit reached");
    return;
  }

  updateCount();
}

async function updateCount() {
  let response = await fetch("count");
  let json = await response.json();
  console.log(json);
  countSpan.html(` count: ${json.count}`);
}
