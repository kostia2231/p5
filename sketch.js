let layers = [];
let colors = [];
let positions = [];
let noiseImage;

let pauseRadius = 300;
let maxRadius = 2000;
let noiseIntensity = 45;

function drawHeart(x, y, r) {
    push();
    translate(x, y);

    scale(r / 12);

    beginShape();
    for (let t = 0; t <= TWO_PI; t += 0.05) {
        let hx = 16 * pow(sin(t), 3);

        let hy = -(13 * cos(t) - 5 * cos(2 * t) - 2 * cos(3 * t) - cos(4 * t));

        vertex(hx, hy - 2);
    }
    endShape(CLOSE);
    pop();
}

function setup() {
    createCanvas(800, 800);
    noStroke();

    let colorPink = color(255, 160, 240);
    let colorYellow = color(245, 0, 0);
    let colorBlue = color(30, 95, 255);

    colors = [colorPink, colorYellow, colorBlue];

    let x1 = width * 0.28;
    let x2 = width * 0.72;
    let y1 = height * 0.28;
    let y2 = height * 0.72;
    positions = [
        createVector(x1, y1),
        createVector(x2, y1),
        createVector(x1, y2),
        createVector(x2, y2),
    ];

    layers.push({ t: 0, type: 0 });

    noiseImage = createGraphics(width, height);
    noiseImage.loadPixels();
    let d = pixelDensity();
    let halfImage = 4 * (width * d) * (height * d);
    for (let i = 0; i < halfImage; i += 4) {
        let val = random(200, 255);
        noiseImage.pixels[i] = val;
        noiseImage.pixels[i + 1] = val;
        noiseImage.pixels[i + 2] = val;
        noiseImage.pixels[i + 3] = noiseIntensity;
    }
    noiseImage.updatePixels();
}

function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
}

function easeInCubic(x) {
    return x * x * x;
}

function getRadius(t) {
    if (t < 0.35) {
        let normT = t / 0.35;
        return easeOutCubic(normT) * pauseRadius;
    } else if (t < 0.5) {
        return pauseRadius;
    } else {
        let normT = (t - 0.5) / 0.5;
        return pauseRadius + easeInCubic(normT) * (maxRadius - pauseRadius);
    }
}

function draw() {
    let oldestType = layers[0].type;
    let bgType = (oldestType - 1 + colors.length) % colors.length;
    background(colors[bgType]);

    for (let i = 0; i < layers.length; i++) {
        let l = layers[i];

        let r = getRadius(l.t);

        fill(colors[l.type]);
        for (let pos of positions) {
            drawHeart(pos.x, pos.y, r / 2);
        }

        l.t += 0.007;
    }

    let newestLayer = layers[layers.length - 1];
    if (newestLayer.t > 0.75) {
        layers.push({
            t: 0,
            type: (newestLayer.type + 1) % colors.length,
        });
    }

    if (layers[0].t > 1.2) {
        layers.shift();
    }

    fill(0);
    textFont("Helvetica", 75);
    textAlign(LEFT, TOP);
    textLeading(80);
    text("Peter’s\n21:00\nFriedrichstraße 110A", 30, 30);

    textFont("Helvetica", 75);
    textLeading(80);
    textAlign(RIGHT, BOTTOM);
    text("Marie's\nBirthday", width * 0.95, height * 0.96);

    image(noiseImage, 0, 0);
}
