import { bitmeddler } from './bitmeddler.js';

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

        image.parentNode.replaceChild(canvas, image);

        return canvas;
    },

    scramblePixels(canvas, options = {})
    {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixelData = imageData.data;
        const meddle = new bitmeddler(pixelData.length, options.seed);

        const animationLoop = () =>
        {
            const scrambledIndexes = meddle.next();

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

    // Add more utility functions here
};

export default bitMeddlerImage;