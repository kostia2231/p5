let video;

function setup() {
  createCanvas(400, 400);
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(video);
  video.hide();
}

function draw() {
  background(220);
  image(video, 0, 0, width, height);
}
