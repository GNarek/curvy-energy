require("dotenv").config();
const {
  generateImageWithGoEnhancePrompt,
  generateCurvyWomanCaption,
  postPhotoToFacebook,
} = require("./services");
const { generateDallePrompt } = require("./image-prompt");

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const PAGE_ID = "525878547285435";

(async () => {
  // Step 1: Generate DALL·E Prompt
  const dallePrompt = generateDallePrompt();
  console.log("🎨 DALL·E Prompt:", dallePrompt);

  // Step 2: Generate DALL·E Image
  const imageUrl = await generateImageWithGoEnhancePrompt(dallePrompt);
  console.log("🖼️ Image URL:", imageUrl);

  // // Step 3: Generate Caption + Hashtags
  // const { caption, hashtags } = await generateCurvyWomanCaption(dallePrompt);

  // const message = `${caption}\n\n${hashtags}`;

  // // Step 4: Post to Facebook
  // const postId = await postPhotoToFacebook(
  //   message,
  //   imageUrl,
  //   PAGE_ID,
  //   PAGE_ACCESS_TOKEN
  // );
  // console.log("✅ Posted to Facebook:", postId);
})();
