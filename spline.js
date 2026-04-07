let images = [];
let imgPaths = ["images/ww.png", "images/wp.jpg"];

let worldX = 0;
let worldY = 0;
let targetWidth = 300; // Задаем желаемую ширину здесь!

function preload() {
    for (let path of imgPaths) {
        images.push({
            data: loadImage(path),
            relX: random(-100, 100),
            relY: random(-100, 100),
        });
    }
}

function setup() {
    // Оставляем только эту настройку для Retina-экранов
    pixelDensity(1);

    createCanvas(windowWidth, windowHeight);

    // ВАЖНО: Мы удалили img.resize() и noSmooth().
    // Теперь браузер будет сам красиво и плавно сжимать фото!

    worldX = width / 2;
    worldY = height / 2;
}

function draw() {
    background(20);

    let m = 15;
    let f = {
        top: height / m,
        bottom: height - height / m,
        left: width / m,
        right: width - width / m,
    };

    for (let imgObj of images) {
        let img = imgObj.data;

        // Защита: если картинка еще не успела прогрузиться
        if (img.width === 0) continue;

        // --- МАТЕМАТИКА МАСШТАБА ---
        // Вычисляем коэффициент уменьшения и новую высоту
        let scaleRatio = targetWidth / img.width;
        let targetHeight = img.height * scaleRatio;

        let screenX = Math.floor(worldX + imgObj.relX);
        let screenY = Math.floor(worldY + imgObj.relY);

        // 1. Рисуем картинку (передаем новые размеры, браузер сам ее красиво сожмет)
        image(img, screenX, screenY, targetWidth, targetHeight);

        // 2. ЭФФЕКТЫ РАСТЯЖКИ

        // ВЕРХ
        if (screenY < f.top) {
            // Насколько пикселей картинка ушла за линию (в экранных координатах)
            let distY = constrain(f.top - screenY, 0, targetHeight - 1);

            // Переводим эту дистанцию в координаты ОРИГИНАЛЬНОГО файла
            let sourceY = Math.floor(distY / scaleRatio);

            image(
                img,
                screenX,
                0,
                targetWidth,
                f.top, // Куда рисовать (на экране)
                0,
                sourceY,
                img.width,
                1, // Откуда брать (из оригинального файла)
            );
        }

        // НИЗ
        if (screenY + targetHeight > f.bottom) {
            let distY = constrain(f.bottom - screenY, 0, targetHeight - 1);
            let sourceY = Math.floor(distY / scaleRatio);

            image(
                img,
                screenX,
                f.bottom,
                targetWidth,
                height - f.bottom,
                0,
                sourceY,
                img.width,
                1,
            );
        }

        // ЛЕВО
        if (screenX < f.left) {
            let distX = constrain(f.left - screenX, 0, targetWidth - 1);
            let sourceX = Math.floor(distX / scaleRatio);

            image(
                img,
                0,
                screenY,
                f.left,
                targetHeight,
                sourceX,
                0,
                1,
                img.height,
            );
        }

        // ПРАВО
        if (screenX + targetWidth > f.right) {
            let distX = constrain(f.right - screenX, 0, targetWidth - 1);
            let sourceX = Math.floor(distX / scaleRatio);

            image(
                img,
                f.right,
                screenY,
                width - f.right,
                targetHeight,
                sourceX,
                0,
                1,
                img.height,
            );
        }
    }
}

// Двигаем камеру
function mouseDragged() {
    worldX += mouseX - pmouseX;
    worldY += mouseY - pmouseY;
}

// Пробел для возврата в центр
function keyPressed() {
    if (key === " ") {
        worldX = width / 2;
        worldY = height / 2;
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
