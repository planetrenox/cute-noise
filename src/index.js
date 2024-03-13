import { bitmeddler } from './bitmeddler.js';

var WIDTH     = 480,
    HEIGHT    = 360,
    BIT_DEPTH = 4; // 32-bit

var bm = new bitmeddler(WIDTH * HEIGHT);

var load_count = 0; // hacky, I know, shut up its only a demo gawd

var lctx = document.getElementById('cleft').getContext('2d');
var rctx = document.getElementById('cright').getContext('2d');

load_img_into_canvas(lctx, './img/homer_car_1_480px.jpg');
load_img_into_canvas(rctx, './img/homer_car_2_480px.jpg');

var timer = window.setInterval(fizzle, 50);

function fizzle()
{
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

        window.setTimeout(function ()
        {
            bm.reset(); // reset bit-meddler for another pass!
            timer = window.setInterval(fizzle, 50);
        }, 2000);
    }
}

function load_img_into_canvas(ctx, file)
{
    var img1 = new Image();
    img1.onload = function ()
    {
        ctx.drawImage(img1, 0, 0);
        load_count++;
    };
    img1.src = file;
}