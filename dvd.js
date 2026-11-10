let x, y;
let vx = 2;
let vy = 2;
let logo;
let w, h;
let col;
let displayCol;
const history = [];
const trailGap = 6;
const trailLife = 50;
let bounceTimer = trailLife;

function preload() {
  logo = loadImage("logo-dvd.svg");
}

function setup() {
  const s = min(windowWidth, windowHeight);
  const cnv = createCanvas(s, s);
  cnv.parent("canvas-holder");
  setLogoSize();
  x = (width - w) / 2;
  y = (height - h) / 2;
  col = "#ff0000";
  displayCol = color(col);
}

function setLogoSize() {
  w = width * 0.74;
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
    bounceTimer = 0;
  }
  if (y <= 0 || y >= height - h) {
    vy *= -1;
    y = constrain(y, 0, height - h);
    col = randomColor();
    bounceTimer = 0;
  }
  bounceTimer++;

  displayCol = lerpColor(displayCol, color(col), 0.15);

  history.push({ x, y, col: color(displayCol) });
  if (history.length > trailGap * 2 + 1) history.shift();

  const fade = constrain(1 - bounceTimer / trailLife, 0, 1);
  const alphas = [25 * fade, 55 * fade];
  for (let i = 0; i < 2 && fade > 0; i++) {
    const idx = history.length - 1 - trailGap * (2 - i);
    if (idx < 0) continue;
    const p = history[idx];
    const c = color(col);
    c.setAlpha(alphas[i]);
    tint(c);
    image(logo, p.x, p.y, w, h);
  }

  tint(displayCol);
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
