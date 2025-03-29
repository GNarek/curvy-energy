require("dotenv").config();

const {
  generateImageWithGoEnhancePrompt,
  generateCurvyWomanCaption,
  getCallToAction,
  postPhotoToFacebook,
} = require("./scripts/services");
const { generateDallePrompt } = require("./prompts/image-prompt");

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const PAGE_ID = "525878547285435";

// 🟦 Post a photo with AI-generated caption & hashtags
const imagePoster = async () => {
  const dallePrompt = generateDallePrompt();
  console.log("🎨 Prompt:", dallePrompt);

  const imageUrl = await generateImageWithGoEnhancePrompt(dallePrompt);
  console.log("🖼️ Image URL:", imageUrl);

  const { caption, hashtags } = await generateCurvyWomanCaption(dallePrompt);

  const message = `${getCallToAction()}\n\n${caption}\n\n${hashtags}`;

  const postId = await postPhotoToFacebook(
    message,
    imageUrl,
    PAGE_ID,
    PAGE_ACCESS_TOKEN
  );

  console.log("✅ Photo posted to Facebook:", postId);
};

module.exports = {
  imagePoster,
};
