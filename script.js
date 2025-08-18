
// Only use imageCanvas for this app
let imageCanvas = document.getElementById("imageCanvas");
let imgCtx = imageCanvas.getContext("2d");
let selectedFilter = "none";

function loadImage() {
    let file = document.getElementById("image").files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.onload = function(event) {
        let img = new Image();
        img.onload = function() {
            imageCanvas.width = img.width;
            imageCanvas.height = img.height;
            imgCtx.drawImage(img, 0, 0);
            selectedFilter = "none";
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(file);
}

function applyFilterToCanvas(filter) {
    if (!imageCanvas.width || !imageCanvas.height) return;
    let imageData = imgCtx.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        let filteredData = processFilter(data[i], data[i + 1], data[i + 2], filter);
        data[i] = filteredData[0];
        data[i + 1] = filteredData[1];
        data[i + 2] = filteredData[2];
    }
    imgCtx.putImageData(imageData, 0, 0);
    selectedFilter = filter;
}

function processFilter(r, g, b, filter) {
    switch (filter) {
        case 'greyscale':
            let avg = (r + g + b) / 3;
            return [avg, avg, avg];
        case 'red':
            return [r, 0, 0];
        case 'yellow':
            return [r, g, 0];
        case 'golden':
            return [r * 1.2, g * 1.1, b * 0.7];
        case 'rainbow':
            return [r * 1.5, g * 1.2, b * 1.5];
        case 'blue':
            return [0, 0, b];
        default:
            return [r, g, b];
    }
}

function grayscale() { applyFilterToCanvas('greyscale'); }
function red() { applyFilterToCanvas('red'); }
function yellow() { applyFilterToCanvas('yellow'); }
function golden() { applyFilterToCanvas('golden'); }
function rainbow() { applyFilterToCanvas('rainbow'); }
function custom() { applyFilterToCanvas('blue'); }

function reset() {
    if (!imageCanvas.width || !imageCanvas.height) return;
    // Reload the image from the file input
    loadImage();
}

function downloadImage() {
    if (!imageCanvas.width || !imageCanvas.height) return;
    let link = document.createElement('a');
    link.download = 'filtered_image.png';
    link.href = imageCanvas.toDataURL("image/png");
    link.click();
}
