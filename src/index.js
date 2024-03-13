import { bitmeddler } from './bitmeddler.js';

var WIDTH = 480,
    HEIGHT = 360,
    BIT_DEPTH = 4; // 32-bit

var bm = new bitmeddler(WIDTH * HEIGHT);

var load_count = 0;

var lctx, rctx;
var lcanvas, rcanvas;

lcanvas = replaceWithCanvas('showcase');
rcanvas = replaceWithCanvas('showcase2');

lctx = lcanvas.getContext('2d');
rctx = rcanvas.getContext('2d');

var timer = window.setInterval(fizzle, 50);

function fizzle() {
    if (load_count != 2) {
        console.warn("Data not loaded yet!");
        return;
    }

    var ldat = lctx.getImageData(0, 0, WIDTH, HEIGHT);
    var rdat = rctx.getImageData(0, 0, WIDTH, HEIGHT);

    var L = ldat.data,
        R = rdat.data;
    var o = void 0;

    // Do 2000 pixels at a time so we don't hold the browser UI thread up too much
    for (var i = 0; i < 2000; i++) {

        // Here, we're just using bit-meddler to generate a buffer offset
        // but you can easily get a pair of X & Y pixel coordinates with some
        // modulus division
        o = bm.next();

        if (o == null) break;

        o *= BIT_DEPTH; // AGBR; = 4 bytes

        // Swap the pixels ES6 style
        var _ref = [R[o + 0], L[o + 0]];
        L[o + 0] = _ref[0];
        R[o + 0] = _ref[1];
        var _ref2 = [R[o + 1], L[o + 1]];
        L[o + 1] = _ref2[0];
        R[o + 1] = _ref2[1];
        var _ref3 = [R[o + 2], L[o + 2]];
        L[o + 2] = _ref3[0];
        R[o + 2] = _ref3[1];
        var _ref4 = [R[o + 3], L[o + 3]];
        L[o + 3] = _ref4[0];
        R[o + 3] = _ref4[1];
    }

    lctx.putImageData(ldat, 0, 0);
    rctx.putImageData(rdat, 0, 0);

    if (o == null) {
        window.clearInterval(timer);

        window.setTimeout(function () {
            bm.reset(); // reset bit-meddler for another pass!
            timer = window.setInterval(fizzle, 50);
        }, 2000);
    }
}

function replaceWithCanvas(imageId) {
    const image = document.getElementById(imageId);

    const canvas = document.createElement('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    const ctx = canvas.getContext('2d');
    let img1 = new Image();

    // Function to execute once the image is loaded
    const onImageLoad = () => {
        load_count++;
        ctx.drawImage(img1, 0, 0);
        image.parentNode.replaceChild(canvas, image);
    };

    img1.onload = onImageLoad;
    img1.src = image.src;
    if (img1.complete) onImageLoad();

    return canvas;
}