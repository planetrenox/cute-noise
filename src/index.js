import { bitmeddler } from './bitmeddler.js';
import { _ } from 'cute-con'; // console.log with return value

const BIT_DEPTH = 4; // Assuming RGBA - 4 bytes per pixel
var fizzleRate = 2000; // Number of pixels to manipulate per interval
var resetTimeout = 0; // Time (ms) before resetting the effect

function replaceWithCanvas(imageId)
{
    return new Promise((resolve, reject) =>
    {
        const image = document.getElementById(imageId);
        if (!image) {
            reject(new Error(`Image element with ID "${imageId}" not found.`));
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        let img1 = new Image();
        img1.onload = () =>
        {
            _("d");
            canvas.width = img1.naturalWidth;
            canvas.height = img1.naturalHeight;
            canvas.id = `${imageId}-canvas`;
            ctx.drawImage(img1, 0, 0);
            if (image.parentNode) {
                image.parentNode.replaceChild(canvas, image);
            }
            resolve(canvas);
        };
        img1.onerror = () =>
        {
            reject(new Error(`Failed to load image with ID "${imageId}".`));
        };
        img1.src = image.src;
        if (img1.complete) img1.onload();
    });
}

function initBitMeddler(width, height)
{
    return new bitmeddler(width * height);
}

function fizzle(ctx0, ctx1, width, height, bm)
{
    var ldat = ctx0.getImageData(0, 0, width, height);
    var rdat = ctx1.getImageData(0, 0, width, height);
    var L = ldat.data, R = rdat.data;
    var o;

    for (var i = 0; i < fizzleRate; i++) {
        o = bm.next();
        if (o == null) break;
        o *= BIT_DEPTH;

        [L[o + 0], R[o + 0]] = [R[o + 0], L[o + 0]];
        [L[o + 1], R[o + 1]] = [R[o + 1], L[o + 1]];
        [L[o + 2], R[o + 2]] = [R[o + 2], L[o + 2]];
        [L[o + 3], R[o + 3]] = [R[o + 3], L[o + 3]];
    }

    ctx0.putImageData(ldat, 0, 0);
    ctx1.putImageData(rdat, 0, 0);

    if (o == null) {
        console.log("Image manipulation completed.");
        return true; // Signal completion
    }
    return false; // Signal ongoing manipulation
}

function startFizzle(canvas0, canvas1)
{
    const bm = initBitMeddler(canvas0.width, canvas0.height);
    let animationId;
    const animate = () =>
    {
        const done = fizzle(canvas0.getContext('2d'), canvas1.getContext('2d'), canvas0.width, canvas1.height, bm);
        if (done) {
            window.setTimeout(() =>
            {
                bm.reset();
                startFizzle(canvas0, canvas1); // Restart the effect
            }, resetTimeout);
        }
        else {
            animationId = requestAnimationFrame(animate);
        }
    };

    animationId = requestAnimationFrame(animate);
}

// Load and replace images, then start fizzle effect
Promise.all([replaceWithCanvas('showcase'), replaceWithCanvas('showcase2')]).then(([canvas0, canvas1]) =>
{
    startFizzle(canvas0, canvas1);
}).catch((error) =>
{
    console.error('Error loading images:', error);
});