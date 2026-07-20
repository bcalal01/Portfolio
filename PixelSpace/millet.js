let canHeight;
let canWidth;
let density;
let imgWidth;

let pixelTotal = 0;
let pixelRow = 0;

let mode = "still"


const brightnessd = .5;

const selectButton = document.getElementById('changeMode')
const birdButton = document.getElementById('spawnBird')

function preload() {
    img = loadImage('images/base.jpg');
    bird1 = loadImage('images/bird1.png')
    bird2 = loadImage('images/bird2.png')
    bird3 = loadImage('images/bird3.png')
    bird4 = loadImage('images/bird4.png')
    bird5 = loadImage('images/bird5.png')
    bird6 = loadImage('images/bird6.png')
    bird7 = loadImage('images/bird7.png')
    bird8 = loadImage('images/bird8.png')
    bird9 = loadImage('images/bird9.png')
    bird10 = loadImage('images/bird10.png')
    birdarray = [bird1, bird3, bird4, bird5, bird6, bird7, bird8, bird9, bird10]
}

function setup() {
    canHeight = Math.floor(windowHeight / 2);
    canHeight = canHeight - (canHeight % 4)
    canWidth = Math.floor(windowWidth / 2);
    canWidth = canWidth - (canWidth % 4)
    density = .75
    imgWidth = canWidth * density * 4;
    createCanvas(canWidth, canHeight);

    pixelDensity(density);

    image(img, 0, 0, canWidth, canHeight);

    pixelTotal = pixels.length / 4;

}

function draw() {
    if (mode == "pool") {
        pool();
    } else if (mode == "droplets") {
        droplets();
    } else if (mode == "corridors") {
        corridors();
    } 
}


selectButton.onclick = function () {
    let selectedMode = document.querySelector('input[name="mode"]:checked')
    mode = selectedMode.value;
}

birdButton.onclick = function () {
    let currx = -150;
    let curry = random(-30, canHeight - 30);
    let index = Math.floor(random(0, birdarray.length));

    function recurse() {
        image(birdarray[index % birdarray.length], currx, curry, 150, 150)
        currx += 30;
        curry -= random(0, 10);
        index++;
        if (currx < canWidth) {
            setTimeout(recurse, 1000/12)
        }
    }

    recurse()

}

function pool() {
    loadPixels();
    for (let i = 0; i < pixels.length; i += 4) {
        let val = Math.floor(random(1, 5));
        if (val == 1) {
            pixels[i - 3] = pixels[i + 1];
            pixels[i - 2] = pixels[i + 2];
            pixels[i + 1] += brightnessd;
            pixels[i + 2] += brightnessd;
        } else if (val == 2) {
            pixels[i + 4] = pixels[i];
            pixels[i + 6] = pixels[i + 2]; 
            pixels[i] += brightnessd;
            pixels[i + 2] += brightnessd;
        } else if (val == 3) {
            pixels[(i + imgWidth) % pixels.length] = pixels[i];
            pixels[(i + 1 + imgWidth) % pixels.length] = pixels[i + 1];
            pixels[i] += brightnessd;
            pixels[i + 1] += brightnessd;
        } else if (val == 4) {
            pixels[(i + 1 - imgWidth + pixels.length) % pixels.length] = pixels[i + 1];
            pixels[(i + 2 - imgWidth + pixels.length) % pixels.length] = pixels[i + 2];
            pixels[i + 1] += brightnessd;
            pixels[i + 2] += brightnessd;
        }
    }
    updatePixels();
}

function droplets() {
    loadPixels();
    for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i] == 0 && pixels[i + 1] == 0 && pixels[i + 2] == 0) {
            continue;
        }
        if (Math.floor(random(0, 5)) == 0) {
            pixels[(i + imgWidth) % pixels.length] = pixels[i];
            pixels[(i + 5) % pixels.length] = pixels[i]
            pixels[(i - 2) % pixels.length] = pixels[i]
            pixels[i] = 0;
            pixels[i + 1] = 0;
            pixels[i + 2] = 0;

        }
    }
    updatePixels();
}

function corridors() {
    loadPixels();
    for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i] == 0 && pixels[i + 1] == 0 && pixels[i + 2] == 0) {
            continue;
        }
        if (Math.floor(random(0, 5)) == 0) {
            pixels[(i + imgWidth) % pixels.length] = pixels[i];
            pixels[(i + 5) % pixels.length] = pixels[i + 1]
            pixels[(i - 2) % pixels.length] = pixels[i + 2]
            pixels[i] = 0;
            pixels[i + 1] = 0;
            pixels[i + 2] = 0;

        }
    }
    updatePixels();
}

