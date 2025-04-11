let isDrawing = false;
let fillMode = false;
let eraseMode = false;
let drawMode = true;
let temp = document.getElementById('temp');
let undoStack = [];
let curr_swatch = 0;
let swatchArray = ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"];
let recentlyUsed = [0, 1, 2, 3, 4, 5, 6, 7];
const colorPicker = document.getElementById("colorPicker");
const undo = document.getElementById("undoButton");
const fill = document.getElementById("fillButton");
const setdraw = document.getElementById("drawButton");
const erase = document.getElementById("eraseButton");
const clear = document.getElementById("clearButton");
const palette = document.getElementById("palette");

setdraw.style.backgroundColor = "#a6a6a6"

/* Creates grid of pixels */
for (let i = 0; i < 400; i++) {
    const pixel = document.createElement("div");
    pixel.classList.add("pixel");
    pixel.classList.add(i);
    pixel.id = i;
    pixel.style.backgroundColor = "#FFFFFF"
    pixel.addEventListener("mousedown", drawstart);
    pixel.addEventListener("mouseover", draw);
    pixel.addEventListener("touchstart", draw);
    pixel.addEventListener("touchmove", draw);
    grid.appendChild(pixel);
}

let swatch_buttons = document.getElementsByClassName('swatch');
console.log(swatch_buttons);

for (let i = 0; i < swatch_buttons.length; i++) {
    swatch_buttons[i].addEventListener('click', paletteColor);
}

function paletteColor(e) {
    let new_color = swatchArray[e.target.id[5]];
    colorPicker.value = new_color;
}

function draw(e) {
    if (isDrawing) {
        let color = "";
        if (eraseMode) {
            color = "#FFFFFF";
        } else {
            color = colorPicker.value;
        }
        e.preventDefault();

        temp.style.backgroundColor = color;
        
        if (e.target.style.backgroundColor != temp.style.backgroundColor) {
            undoStack[undoStack.length - 1][e.target.id] = e.target.style.backgroundColor;
            e.target.style.backgroundColor = color;
        }
    }
}

function update_palette() {
    let curr_color = colorPicker.value;
    console.log(curr_color);

    // if the current color is not already in the palette
    if (!swatchArray.includes(curr_color)) {
        let swatch_num = recentlyUsed.shift();
        recentlyUsed.push(swatch_num);
        console.log(swatch_num);
        console.log("adding");
        swatchArray[swatch_num] = curr_color;
        let next_swatch = document.getElementById("color" + swatch_num);
        console.log(next_swatch);
        next_swatch.style.backgroundColor = curr_color;
    } else {
        let index = swatchArray.indexOf(curr_color);
        let recentlyUsed_index = recentlyUsed.indexOf(index);
        recentlyUsed.splice(recentlyUsed_index, 1);
        recentlyUsed.push(index);
    }

    console.log(recentlyUsed);
}

function drawstart(e) {
    if (drawMode || fillMode) {
        update_palette();
    }

    if (fillMode) {
        fillArea(e);
        return;
    }
    isDrawing = true;
    e.preventDefault();
    let state = {};
    undoStack.push(state);
    undoStack[undoStack.length - 1][e.target.id] = e.target.style.backgroundColor;
    if (eraseMode) {
        e.target.style.backgroundColor = "#FFFFFF";
    } else {
        e.target.style.backgroundColor = colorPicker.value;
    }
}

function fillArea(e) {
    let state = {};
    undoStack.push(state);
    origin = Number(e.target.id);
    let fillStack = [origin];
    //prevColor = e.target.style.backgroundColor
    temp.style.backgroundColor = e.target.style.backgroundColor;
    //e.target.style.backgroundColor = colorPicker.value;
    while (fillStack.length != 0) {
        curr = fillStack.pop();
        if (curr % 20 != 19) {
            if (document.getElementById(curr + 1).style.backgroundColor == temp.style.backgroundColor) {
                fillStack.push(curr + 1);
            }
        }
        if (curr % 20 != 0) {
            if (document.getElementById(curr - 1).style.backgroundColor == temp.style.backgroundColor) {
                fillStack.push(curr - 1);
            }
        }
        if (curr > 19) {
            if (document.getElementById(curr - 20).style.backgroundColor == temp.style.backgroundColor) {
                fillStack.push(curr - 20);
            }
        }
        if (curr < 380) {
            if (document.getElementById(curr + 20).style.backgroundColor == temp.style.backgroundColor) {
                fillStack.push(curr + 20);
            }
        }
        undoStack[undoStack.length - 1][curr] = temp.style.backgroundColor;
        document.getElementById(curr).style.backgroundColor = colorPicker.value;

    }

}

document.onmouseup = function() {
    isDrawing = false;
}

undo.onclick = function() {
    console.log("undo");
    let undoState = undoStack.pop();
    for (var pixel in undoState) {
        document.getElementById(pixel).style.backgroundColor = undoState[pixel];
    }
}

fill.onclick = function() {
    setdraw.style.backgroundColor = "#ffffff"
    erase.style.backgroundColor = "#ffffff"
    fill.style.backgroundColor = "#a6a6a6"
    fillMode = true;
    drawMode = false;
    eraseMode = false;
}

setdraw.onclick = function() {
    setdraw.style.backgroundColor = "#a6a6a6"
    erase.style.backgroundColor = "#ffffff"
    fill.style.backgroundColor = "#ffffff"
    drawMode = true;
    fillMode = false;
    eraseMode = false;
}

erase.onclick = function() {
    console.log("erase");
    setdraw.style.backgroundColor = "#ffffff"
    erase.style.backgroundColor = "#a6a6a6"
    fill.style.backgroundColor = "#ffffff"
    eraseMode = true;
    fillMode = false;
    drawMode = false;
}

clear.onclick = function() {
    temp.style.backgroundColor = "#FFFFFF"
    let state = {};
    undoStack.push(state);
    for (let i = 0; i < 400; i++) {
        if (document.getElementById(i).style.backgroundColor != temp.style.backgroundColor) {
            undoStack[undoStack.length - 1][i] = document.getElementById(i).style.backgroundColor;
            document.getElementById(i).style.backgroundColor = "#FFFFFF";
        }
    }
}
