require('dotenv').config();
const path = require('path');
const {
  generateCurvyWomanCaption,
  getCallToAction,
  getRandomQuote,
} = require('./scripts/services');
const {
  generateImageWithPrompt,
} = require('./scripts/generateImageWithPrompt');
const { generateDallePrompt } = require('./prompts/image-prompt');
const { imageToReel } = require('./image-to-reel/image-to-reel');
const { videoPosterFacebook } = require('./video-poster-facebook');
const { videoPosterInstagram } = require('./video-poster-instagram');

// 🟩 Post a video using a random quote as caption
const videoPoster = async () => {
  const imagePrompt = generateDallePrompt();
  console.log('🎨 Prompt:', imagePrompt);

  const imageUrl = await generateImageWithPrompt(imagePrompt);

  if (!imageUrl) {
    return;
  }
  const quote = getRandomQuote();
  const videoOutputPath = path.resolve(
    __dirname,
    'assets/output/final-reel.mp4',
  );

  await imageToReel(imageUrl, quote, videoOutputPath);

  const { caption, hashtags } = await generateCurvyWomanCaption(imagePrompt);

  const message = `${getCallToAction()}\n\n${caption}\n\n#CurvyEnergy${hashtags}`;

  await videoPosterFacebook(message, quote);
  await videoPosterInstagram(message, quote);
};

module.exports = {
  videoPoster,
};
