require('dotenv').config();

const { postPhotoToFacebook } = require('./scripts/services');

const { PAGE_ACCESS_TOKEN, PAGE_ID } = process.env;

// 🟦 Post a photo with AI-generated caption & hashtags
const imagePosterFacebook = async (imageUrl, message) => {
  const postId = await postPhotoToFacebook(
    message,
    imageUrl,
    PAGE_ID,
    PAGE_ACCESS_TOKEN,
  );

  console.log('✅ Photo posted to Facebook:', postId);
  return postId;
};

module.exports = {
  imagePosterFacebook,
};
