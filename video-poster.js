require("dotenv").config();
const path = require("path");
const {
  generateImageWithGoEnhancePrompt,
  generateCurvyWomanCaption,
  getCallToAction,
  postVideoToFacebook,
  getRandomQuote,
} = require("./scripts/services");
const { generateDallePrompt } = require("./prompts/image-prompt");
const { imageToReel } = require("./image-to-reel/image-to-reel");

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const PAGE_ID = "525878547285435";

// 🟩 Post a video using a random quote as caption
const videoPoster = async () => {
  const dallePrompt = generateDallePrompt();
  console.log("🎨 Prompt:", dallePrompt);

  const imageUrl = await generateImageWithGoEnhancePrompt(dallePrompt);
  console.log("🖼️ Image URL:", imageUrl);

  const quote = getRandomQuote();
  const videoOutputPath = path.resolve(
    __dirname,
    "assets/output/final-reel.mp4"
  );

  await imageToReel(imageUrl, quote, videoOutputPath);

  const { caption, hashtags } = await generateCurvyWomanCaption(dallePrompt);

  const message = `${getCallToAction()}\n\n${caption}\n\n${hashtags}`;

  console.log("Posting to Facebook...");

  const postId = await postVideoToFacebook(
    message,
    videoOutputPath,
    PAGE_ID,
    PAGE_ACCESS_TOKEN
  );

  console.log("✅ Video posted to Facebook:", postId);
};

module.exports = {
  videoPoster,
};
