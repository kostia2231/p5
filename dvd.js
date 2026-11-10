let x, y;
let vx = 3.5;
let vy = 3.5;
const size = 80;
let col;

function setup() {
  const s = min(windowWidth, windowHeight);
  const cnv = createCanvas(s, s);
  cnv.parent("canvas-holder");
  x = random(width - size);
  y = random(height - size);
  col = randomColor();
}

function windowResized() {
  const s = min(windowWidth, windowHeight);
  resizeCanvas(s, s);
  x = constrain(x, 0, width - size);
  y = constrain(y, 0, height - size);
}

function draw() {
  background(0);

  x += vx;
  y += vy;

  if (x <= 0 || x >= width - size) {
    vx *= -1;
    x = constrain(x, 0, width - size);
    col = randomColor();
  }
  if (y <= 0 || y >= height - size) {
    vy *= -1;
    y = constrain(y, 0, height - size);
    col = randomColor();
  }

  noStroke();
  fill(col);
  rect(x, y, size, size);
}

function randomColor() {
  return color(random(100, 255), random(100, 255), random(100, 255));
}
