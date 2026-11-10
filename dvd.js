let x, y;
let vx = 3.5;
let vy = 3.5;
let logo;
let w, h;
let col;
const history = [];
const trailGap = 8;

function preload() {
  logo = loadImage("logo-dvd.svg");
}

function setup() {
  const s = min(windowWidth, windowHeight);
  const cnv = createCanvas(s, s);
  cnv.parent("canvas-holder");
  setLogoSize();
  x = random(width - w);
  y = random(height - h);
  col = randomColor();
}

function setLogoSize() {
  w = width * 0.6;
  h = w * (30 / 470);
}

function windowResized() {
  const s = min(windowWidth, windowHeight);
  resizeCanvas(s, s);
  setLogoSize();
  x = constrain(x, 0, width - w);
  y = constrain(y, 0, height - h);
}

function draw() {
  background(0);

  x += vx;
  y += vy;

  if (x <= 0 || x >= width - w) {
    vx *= -1;
    x = constrain(x, 0, width - w);
    col = randomColor();
  }
  if (y <= 0 || y >= height - h) {
    vy *= -1;
    y = constrain(y, 0, height - h);
    col = randomColor();
  }

  history.push({ x, y, col });
  if (history.length > trailGap * 3 + 1) history.shift();

  const alphas = [60, 120, 180];
  for (let i = 0; i < 3; i++) {
    const idx = history.length - 1 - trailGap * (3 - i);
    if (idx < 0) continue;
    const p = history[idx];
    const c = color(p.col);
    c.setAlpha(alphas[i]);
    tint(c);
    image(logo, p.x, p.y, w, h);
  }

  tint(col);
  image(logo, x, y, w, h);
}

function randomColor() {
  const colors = ["#ff0000", "#0000ff", "#00cc00", "#9900ff"];
  let next;
  do {
    next = random(colors);
  } while (col && next === col);
  return next;
}
