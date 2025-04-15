require('dotenv').config();

const {
  generateCurvyWomanCaption,
  getCallToAction,
  getRandomQuote,
} = require('./scripts/services');
const { generateDallePrompt } = require('./prompts/image-prompt');
const {
  generateImageWithPrompt,
} = require('./scripts/generateImageWithPrompt');
const { imagePosterFacebook } = require('./image-poster-facebook');
const { imagePosterInstagram } = require('./image-poster-instagram');

// 🟦 Post a photo with AI-generated caption & hashtags
const imagePoster = async () => {
  const dallePrompt = generateDallePrompt();
  console.log('🎨 Prompt:', dallePrompt);

  const imageUrl = await generateImageWithPrompt(dallePrompt);
  console.log('🖼️ Image URL:', imageUrl);

  if (!imageUrl) {
    return;
  }

  // const { caption, hashtags } = await generateCurvyWomanCaption(dallePrompt);
  const hashtags =
    '#CurvyEnergy #CurvyAndProud #BodyPositive #PlusSizeBeauty #ConfidenceIsSexy #LoveYourCurves #CurvesAreIn #EffortlessGlam #CurvyVibes #FemininePower';

  const quote = getRandomQuote();
  const message = `${getCallToAction()}\n\n${quote}\n\n#CurvyEnergy, ${hashtags}`;

  console.log('✅ Posting image to Facebook...');
  const postId = await imagePosterFacebook(imageUrl, message);
  console.log('✅ Image posted to Facebook:', postId);

  console.log('📸 Posting image to Instagram...');
  await imagePosterInstagram(imageUrl, message, quote);
  console.log('✅ Image posted to Instagram');
};

module.exports = {
  imagePoster,
};
