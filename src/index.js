import { bitmeddler } from './bitmeddler.js';
import { _ } from 'cute-con';

const bitMeddlerImage = {
    replaceWithCanvas(imageId)
    {
        const image = document.getElementById(imageId);
        if (!image) {
            console.error(`Image element with ID "${imageId}" not found.`);
            return null;
        }

        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        canvas.id = `${imageId}-canvas`;
        const context2D = _(canvas.getContext('2d'));
        context2D.drawImage(image, 0, 0);
        image.parentNode.replaceChild(canvas, image);

        // const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // bitMeddlerEffects[effect](imageData);
        // ctx.putImageData(imageData, 0, 0);

        return canvas;
    },

    scramblePixels(canvas, options = {})
    {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixelData = imageData.data;
        const meddle = _(new bitmeddler(pixelData.length));

        const animationLoop = () =>
        {
            const scrambledIndexes = _(meddle.next());

            for (let i = 0; i < pixelData.length; i += 4) {
                const offset = scrambledIndexes * 4;
                pixelData[i] = pixelData[offset];
                pixelData[i + 1] = pixelData[offset + 1];
                pixelData[i + 2] = pixelData[offset + 2];
            }

            ctx.putImageData(imageData, 0, 0);

            if (scrambledIndexes !== null && !options.stopAnimation) {
                requestAnimationFrame(animationLoop);
            }
        };

        animationLoop();
    },

    glitchEffect(canvas, options = {})
    {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixelData = imageData.data;
        const meddle = new bitmeddler(pixelData.length, options.seed);

        const animationLoop = () =>
        {
            for (let i = 0; i < pixelData.length; i += 4) {
                const offset = meddle.next() * 4;
                const r = pixelData[offset];
                const g = pixelData[offset + 1];
                const b = pixelData[offset + 2];

                pixelData[i] = r;
                pixelData[i + 1] = g;
                pixelData[i + 2] = b;
            }

            ctx.putImageData(imageData, 0, 0);

            if (meddle.next() !== null && !options.stopAnimation) {
                requestAnimationFrame(animationLoop);
            }
        };

        animationLoop();
    },

    // Add more image manipulation functions here

    stopAnimation(canvas)
    {
        canvas.stopAnimation = true;
    },

    resetAnimation(canvas)
    {
        canvas.stopAnimation = false;
    },

};

// Replace an image with a canvas
const canvas = bitMeddlerImage.replaceWithCanvas('showcase');
//const canvas2 = bitMeddlerImage.replaceWithCanvas('showcase2');
//const canvas3 = bitMeddlerImage.replaceWithCanvas('showcase3');
//const canvas4 = bitMeddlerImage.replaceWithCanvas('showcase4');

// Apply the scramble pixels effect to the canvas
//bitMeddlerImage.scramblePixels(canvas);

// Apply the glitch effect to the canvas
//bitMeddlerImage.glitchEffect(canvas2);

// Stop the animation on the canvas
//bitMeddlerImage.stopAnimation(canvas3);

// Reset the animation on the canvas
//bitMeddlerImage.resetAnimation(canvas4);

