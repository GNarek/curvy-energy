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
const { videoPosterTikTok } = require('./video-poster-tiktok');

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

  // const { caption, hashtags } = await generateCurvyWomanCaption(imagePrompt);
  const hashtags =
    '#CurvyEnergy #CurvyAndProud #BodyPositive #PlusSizeBeauty #ConfidenceIsSexy #LoveYourCurves #CurvesAreIn #EffortlessGlam #CurvyVibes #FemininePower';

  const messageFB = `👉 Get it here: https://curvyenergy.gumroad.com/
💋 Just dropped: Curvy Babes Vol. 1
20 thick, high-res babes waiting for you 😈

\n\n#CurvyEnergy ${hashtags}`;
  const messageIn = `💋 AI generated fantasy for you

🔞 Instant download. No watermarks.
📩 Link in the comments 👇\n\n#CurvyEnergy ${hashtags}`;
  // const message = `${getCallToAction()}\n\n${caption}\n\n#CurvyEnergy${hashtags}`;

  await videoPosterFacebook(
    messageFB,
    `💋 AI generated fantasy for you\nGet it here: https://curvyenergy.gumroad.com/\n\n\n\n${quote}`,
  );

  await videoPosterInstagram(
    messageIn,
    `💋 AI generated fantasy for you\nGet it here: https://curvyenergy.gumroad.com/\n\n\n\n${quote}`,
  );

  // So the same for tiktok :)
  // This what I'm working now
  // await videoPosterTikTok(message);
};

module.exports = {
  videoPoster,
};
