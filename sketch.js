let shapes = [];
let currentPoints = [];
let isMorphing = false;
let progress = 0;
let hitCount = 0;
let currentShapeIndex = 0;
let nextShapeIndex = 1;

let x, y;
let dx, dy;
let bgImg;

let targetWidth, targetHeight;
let currentWidth, currentHeight;
let rotationAngle = 0;
let targetAngle = 0;

let cachedTransformedPoints = [];
let cachedBounds = null;
let lastTransformParams = null;

let sliderStartWidth, sliderStartHeight;
let sliderMinSize, sliderMaxSize;
let sliderNoiseDensity;
let sliderColorMode;

let textColors = ["#000000"];
let textColor = "#000000";

let noisePoints = [];
let particlePool = [];

let isPaused = false;
let pauseButton;

let lastHitTime = 0;
const hitCooldown = 1000;
const MAX_NOISE_POINTS = 1000;

function preload() {
  bgImg = loadImage("assets/afisha.svg");
}
let canvas;
function setup() {
  canvas = createCanvas(600, 600);
  angleMode(DEGREES);

  // const shape1 = [
  //   { x: 460.5, y: 28.5 },
  //   { x: 227, y: 1 },
  //   { x: 227, y: 154 },
  //   { x: 1.21094, y: 214.5 },
  //   { x: 1.21094, y: 494.5 },
  //   { x: 71.5, y: 494.5 },
  //   { x: 95.5, y: 364.431 },
  //   { x: 203, y: 364.431 },
  //   { x: 227, y: 531 },
  //   { x: 298, y: 531 },
  //   { x: 316.5, y: 353.043 },
  //   { x: 365.039, y: 329 },
  //   { x: 388, y: 406.5 },
  //   { x: 460.5, y: 406.5 },
  //   { x: 460.5, y: 28.5 },
  // ];
  //
  const shape1 = [
    { x: 46.5, y: 318.5 },
    { x: 203.5, y: 433.5 },
    { x: 266, y: 482 },
    { x: 496, y: 268.5 },
    { x: 522.5, y: 113 },
    { x: 478, y: 26 },
    { x: 387, y: 0 },
    { x: 322.5, y: 26 },
    { x: 258, y: 123 },
    { x: 248, y: 207.5 },
    { x: 236, y: 92.5 },
    { x: 169.5, y: 26 },
    { x: 90.5, y: 0 },
    { x: 0, y: 78.5 },
    { x: 0, y: 224 },
  ];

  const shape2_raw = [
    { x: 870, y: 705 },
    { x: 804, y: 738 },
    { x: 738, y: 771 },
    { x: 474, y: 771 },
    { x: 210, y: 771 },
    { x: 210, y: 639 },
    { x: 276, y: 606 },
    { x: 342, y: 573 },
    { x: 342, y: 507 },
    { x: 408, y: 474 },
    { x: 474, y: 441 },
    { x: 474, y: 375 },
    { x: 540, y: 342 },
    { x: 606, y: 309 },
    { x: 870, y: 309 },
  ];

  const shape3_raw = [
    { x: 588, y: 523.582 },
    { x: 511.616, y: 580 },
    { x: 390.795, y: 580 },
    { x: 390.795, y: 310.806 },
    { x: 345.882, y: 177.015 },
    { x: 265.808, y: 177.015 },
    { x: 232.795, y: 183.297 },
    { x: 210.942, y: 194.77 },
    { x: 197.205, y: 254.388 },
    { x: 197.205, y: 523.582 },
    { x: 140.822, y: 580 },
    { x: 0, y: 580 },
    { x: 0, y: 96.4179 },
    { x: 76.3836, y: 0 },
    { x: 588, y: 0 },
  ];

  // shapes = [
  //   rotateArray(shape1.reverse(), 0),
  //   rotateArray(shape2_raw.reverse(), 5),
  //   rotateArray(shape3_raw.reverse(), 25),
  // ];

  shapes = [
    shape1,
    rotateArray(shape2_raw.reverse(), 10),
    rotateArray(shape3_raw.reverse(), 10),
  ];

  currentPoints = shape1.map((p) => ({ x: p.x, y: p.y }));

  initParticlePool();

  let container = createDiv()
    .style("padding", "10px")
    .style("background", "#eee")
    .style("width", "300px")
    .style("position", "fixed")
    .style("top", "10px")
    .style("right", "10px")
    .style("z-index", "1000");

  createDiv("W:").parent(container);
  sliderStartWidth = createSlider(100, 600, 300, 1)
    .parent(container)
    .style("opacity", "0")
    .style("width", "100%")
    .input(resetSimulation);

  createDiv("Тащи еще бумаги! Зацепи по-больше влаги!").parent(container);
  sliderStartHeight = createSlider(100, 600, 300, 1)
    .parent(container)
    .style("opacity", "0")
    .style("width", "100%")
    .input(resetSimulation);

  createDiv("Min Size Range:").parent(container);
  sliderMinSize = createSlider(50, 350, 250, 1)
    .parent(container)
    .style("width", "100%");

  createDiv("Max Size Range:").parent(container);
  sliderMaxSize = createSlider(100, 600, 400, 1)
    .parent(container)
    .style("width", "100%");

  createDiv("Noise Density:").parent(container);
  sliderNoiseDensity = createSlider(0, 1000, 100, 1)
    .parent(container)
    .style("width", "100%");

  createDiv("Noise Color Mode:").parent(container);
  sliderColorMode = createSelect().parent(container).style("width", "100%");
  sliderColorMode.option("Black");
  sliderColorMode.option("White");

  createDiv("").parent(container);
  pauseButton = createButton("Пауза")
    .parent(container)
    .style("width", "100%")
    .style("padding", "10px")
    .style("background", "rgba(0,0,0,1)")
    .style("color", "white")
    .style("border", "none")
    .style("border-radius", "4px")
    .style("cursor", "pointer")
    .style("font-size", "14px")
    .style("margin-top", "10px")
    .mousePressed(togglePause);

  resetSimulation();
}

function initParticlePool() {
  for (let i = 0; i < MAX_NOISE_POINTS; i++) {
    particlePool.push({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      radius: 0,
      color: null,
      active: false,
    });
  }
}

function resetSimulation() {
  targetWidth = currentWidth = sliderStartWidth.value();
  targetHeight = currentHeight = sliderStartHeight.value();

  x = random(width - targetWidth);
  y = random(height - targetHeight);

  rotationAngle = 0;
  targetAngle = 0;

  //скорость движения
  dx = random(1, 3) * (random() < 0.5 ? 1 : -1);
  dy = random(1, 3) * (random() < 0.5 ? 1 : -1);

  textColor = "#000000";

  for (let particle of particlePool) {
    particle.active = false;
  }
  noisePoints = [];

  hitCount = 0;
  progress = 0;
  isMorphing = false;
  lastHitTime = 0;

  cachedBounds = null;
  lastTransformParams = null;
}

function draw() {
  if (isPaused) {
    drawCurrentFrame();
    return;
  }

  noStroke();
  background(255);
  image(bgImg, 0, 0, width, height);

  x += dx;
  y += dy;

  let from = shapes[currentShapeIndex];
  let to = shapes[nextShapeIndex];

  if (isMorphing) {
    progress += 0.02;
    if (progress >= 1) {
      progress = 1;
      isMorphing = false;
      currentShapeIndex = nextShapeIndex;
      nextShapeIndex = (nextShapeIndex + 1) % shapes.length;

      lastTransformParams = null;
    }
    for (let i = 0; i < currentPoints.length; i++) {
      currentPoints[i].x = lerp(from[i].x, to[i].x, progress);
      currentPoints[i].y = lerp(from[i].y, to[i].y, progress);
    }

    lastTransformParams = null;
  }

  let transformParams = `${x},${y},${currentWidth},${currentHeight},${rotationAngle}`;
  let transformedPoints, bounds;

  if (lastTransformParams !== transformParams) {
    let origBounds = getBoundingBox(currentPoints);
    let scaleX = currentWidth / origBounds.width;
    let scaleY = currentHeight / origBounds.height;

    transformedPoints = currentPoints.map((p) =>
      transformPoint(
        p.x - origBounds.minX,
        p.y - origBounds.minY,
        x,
        y,
        scaleX,
        scaleY,
        rotationAngle,
      ),
    );

    bounds = getBoundingBox(transformedPoints);

    cachedTransformedPoints = transformedPoints;
    cachedBounds = bounds;
    lastTransformParams = transformParams;
  } else {
    transformedPoints = cachedTransformedPoints;
    bounds = cachedBounds;
  }

  let hit = false;
  if (bounds.minX < 0) {
    dx = abs(dx);
    x += -bounds.minX;
    hit = true;
    lastTransformParams = null;
  }
  if (bounds.maxX > width) {
    dx = -abs(dx);
    x -= bounds.maxX - width;
    hit = true;
    lastTransformParams = null;
  }
  if (bounds.minY < 0) {
    dy = abs(dy);
    y += -bounds.minY;
    hit = true;
    lastTransformParams = null;
  }
  if (bounds.maxY > height) {
    dy = -abs(dy);
    y -= bounds.maxY - height;
    hit = true;
    lastTransformParams = null;
  }

  let currentTime = millis();
  if (hit && currentTime - lastHitTime > hitCooldown) {
    lastHitTime = currentTime;
    hitCount++;
    randomizeOneSide();
    targetAngle = random(-45, 45);
    textColor = random(textColors);

    if (hitCount >= 3) {
      isMorphing = true;
      progress = 0;
      hitCount = 0;
      generateNoiseOptimized(transformedPoints, bounds);
    }
  }

  currentWidth = lerp(currentWidth, targetWidth, 0.1);
  currentHeight = lerp(currentHeight, targetHeight, 0.1);
  rotationAngle = lerp(rotationAngle, targetAngle, 0.1);

  // fill(0);
  // textSize(10);
  // for (let i = 0; i < transformedPoints.length; i++) {
  //   text(i, transformedPoints[i].x + 5, transformedPoints[i].y - 5);
  // }
  // fill(textColor); // или другой цвет
  // textSize(20); // Размер текста

  // const textStr = "...............";
  // const letters = textStr.split("");

  // for (let i = 0; i < letters.length && i < transformedPoints.length; i++) {
  //   const p = transformedPoints[i];
  //   text(letters[i], p.x, p.y);
  // }

  blendMode(DIFFERENCE);
  noStroke();
  fill("white");
  beginShape();
  for (let p of transformedPoints) vertex(p.x, p.y);
  endShape(CLOSE);

  blendMode(BLEND);
  noStroke();

  updateParticles();
  renderParticles();

  // if (capturing && capturer) {
  //   capturer.capture(canvas.canvas);
  // }
}

function drawCurrentFrame() {
  noStroke();
  background(255);
  image(bgImg, 0, 0, width, height);

  let transformedPoints = cachedTransformedPoints;
  if (!transformedPoints || transformedPoints.length === 0) {
    let origBounds = getBoundingBox(currentPoints);
    let scaleX = currentWidth / origBounds.width;
    let scaleY = currentHeight / origBounds.height;

    transformedPoints = currentPoints.map((p) =>
      transformPoint(
        p.x - origBounds.minX,
        p.y - origBounds.minY,
        x,
        y,
        scaleX,
        scaleY,
        rotationAngle,
      ),
    );
  }

  blendMode(DIFFERENCE);
  noStroke();
  fill("white");
  beginShape();
  for (let p of transformedPoints) vertex(p.x, p.y);
  endShape(CLOSE);

  blendMode(BLEND);
  noStroke();

  renderParticles();
}

function togglePause() {
  isPaused = !isPaused;

  if (isPaused) {
    pauseButton.html("Продолжить");
    pauseButton.style("background", "rgba(0,0,0,0.5)");
  } else {
    pauseButton.html("Пауза");
    pauseButton.style("background", "rgba(0,0,0,1)");
  }
}

function generateNoiseOptimized(transformedPoints, bounds) {
  let density = sliderNoiseDensity.value();
  let activeCount = noisePoints.length;

  let minX = bounds.minX;
  let maxX = bounds.maxX;
  let minY = bounds.minY;
  let maxY = bounds.maxY;

  for (let i = 0; i < density && activeCount < MAX_NOISE_POINTS; i++) {
    let px = minX + Math.random() * (maxX - minX);
    let py = minY + Math.random() * (maxY - minY);

    if (insidePolygon(px, py, transformedPoints)) {
      let particle = null;
      for (let j = 0; j < particlePool.length; j++) {
        if (!particlePool[j].active) {
          particle = particlePool[j];
          break;
        }
      }

      if (particle) {
        particle.x = px;
        particle.y = py;
        particle.vx = (Math.random() - 0.5) * 0.6;
        particle.vy = (Math.random() - 0.5) * 0.6;
        particle.radius = 3 + Math.random() * 20;
        particle.color = color(
          Math.random() * 255,
          Math.random() * 255,
          Math.random() * 255,
        );
        particle.active = true;

        noisePoints.push(particle);
        activeCount++;
      }
    }
  }
}

function updateParticles() {
  for (let i = noisePoints.length - 1; i >= 0; i--) {
    let pt = noisePoints[i];
    pt.x += pt.vx;
    pt.y += pt.vy;
    pt.radius -= 0.2;

    if (pt.radius <= 0) {
      pt.active = false;
      noisePoints.splice(i, 1);
    }
  }
}

function renderParticles() {
  let colorMode = sliderColorMode.value();

  for (let pt of noisePoints) {
    switch (colorMode) {
      case "Black":
        fill(0);
        break;
      case "White":
      default:
        fill(255);
        break;
    }
    circle(pt.x, pt.y, pt.radius * 2);
  }
}

function rotateArray(arr, count) {
  return arr.slice(count).concat(arr.slice(0, count));
}

function transformPoint(px, py, tx, ty, scaleX, scaleY, angleDeg) {
  let sx = px * scaleX;
  let sy = py * scaleY;
  let rad = radians(angleDeg);
  let cosA = cos(rad);
  let sinA = sin(rad);
  let rx = sx * cosA - sy * sinA;
  let ry = sx * sinA + sy * cosA;
  return { x: rx + tx, y: ry + ty };
}

function getBoundingBox(points) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (let p of points) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

function insidePolygon(x, y, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    let xi = polygon[i].x,
      yi = polygon[i].y;
    let xj = polygon[j].x,
      yj = polygon[j].y;
    let intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function randomizeOneSide() {
  let minSize = sliderMinSize.value();
  let maxSize = sliderMaxSize.value();
  if (random() < 0.5) {
    targetWidth = random(minSize, maxSize);
  } else {
    targetHeight = random(minSize, maxSize);
  }
}
