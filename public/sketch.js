function setup() {
  createCanvas(200, 200);
  background(0);
  let generateButton = createButton("generate");
  generateButton.mousePressed(sendVector);
}

async function sendVector() {
  let vector = [];
  for (let i = 0; i < 512; i++) {
    vector[i] = random(-1, 1);
  }
  const inputs = {
    z: vector
  };

  console.log(inputs);
  const response = await fetch("runwayml", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(inputs)
  });

  const outputs = await response.json();
  const { image } = outputs;
}
