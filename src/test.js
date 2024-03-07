import bitMeddlerImage from './index.js';

// Replace an image with a canvas
const canvas = bitMeddlerImage.replaceWithCanvas('myImage');

// Apply the scramble pixels effect to the canvas
bitMeddlerImage.scramblePixels(canvas);

// Apply the glitch effect to the canvas
bitMeddlerImage.glitchEffect(canvas);

// Stop the animation on the canvas
bitMeddlerImage.stopAnimation(canvas);

// Reset the animation on the canvas
bitMeddlerImage.resetAnimation(canvas);
