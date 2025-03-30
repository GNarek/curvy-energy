require("dotenv").config();
const path = require("path");
const {
  generateCurvyWomanCaption,
  getCallToAction,
  postVideoToFacebook,
  getRandomQuote,
} = require("./scripts/services");
const {
  generateImageWithPrompt,
} = require("./scripts/generateImageWithPrompt");
const {
  uploadImageToFacebook,
  postImageAsComment,
} = require("./scripts/comment-image-under-reel");
const { ORIGINAL_IMAGE_PATH } = require("./image-to-reel/paths");
const { generateDallePrompt } = require("./prompts/image-prompt");
const { imageToReel } = require("./image-to-reel/image-to-reel");

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const PAGE_ID = "525878547285435";

// 🟩 Post a video using a random quote as caption
const videoPoster = async () => {
  const imagePrompt = generateDallePrompt();
  console.log("🎨 Prompt:", imagePrompt);

  const imageUrl = await generateImageWithPrompt(imagePrompt);

  if (!imageUrl) {
    return;
  }
  const quote = getRandomQuote();
  const videoOutputPath = path.resolve(
    __dirname,
    "assets/output/final-reel.mp4"
  );

  await imageToReel(imageUrl, quote, videoOutputPath);

  const { caption, hashtags } = await generateCurvyWomanCaption(imagePrompt);

  const message = `${getCallToAction()}\n\n${caption}\n\n${hashtags}`;

  console.log("Posting to Facebook...");
  const postId = await postVideoToFacebook(
    message,
    videoOutputPath,
    PAGE_ID,
    PAGE_ACCESS_TOKEN
  );
  console.log("✅ Video posted to Facebook:", postId);

  console.log("Uploading image...");
  const imageMediaId = await uploadImageToFacebook(ORIGINAL_IMAGE_PATH);
  console.log("Image uploaded");

  console.log("💬 Commenting image...");
  const commentId = await postImageAsComment(postId, imageMediaId, quote);
  console.log("💬 Image commented", commentId);
};

module.exports = {
  videoPoster,
};
