let countSpan;

function setup() {
  createCanvas(640, 480);
  background(0);
  let generateButton = createButton("generate");
  generateButton.mousePressed(sendVector);
  countSpan = createSpan("");
  sendVector();
}

async function sendVector() {
  console.log("sending image");

  let vector = [];
  for (let i = 0; i < 512; i++) {
    vector[i] = random(-1, 1);
  }
  const inputs = {
    z: vector
  };

  const data = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(inputs)
  };
  const response = await fetch("runwayml", data);
  const outputs = await response.json();

  // If we get something back with no image
  if (outputs.status == "limit") {
    console.log("daily limit reached");
    return;
  }

  const image64 = outputs.image;
  let skyImage = createImg(image64, "StyleGAN generated sky", function() {
    skyImage.hide();
    image(skyImage, 0, 0, width, height);
  });

  updateCount();
}

async function updateCount() {
  let response = await fetch("count");
  let json = await response.json();
  console.log(json);
  countSpan.html(` count: ${json.count}`);
}
