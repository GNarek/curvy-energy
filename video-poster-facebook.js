require('dotenv').config();
const path = require('path');
const { postVideoToFacebook } = require('./scripts/services');
require('./scripts/generateImageWithPrompt');
const {
  uploadImageToFacebook,
  postImageAsComment,
} = require('./scripts/comment-image-under-reel');
const { ORIGINAL_IMAGE_PATH } = require('./image-to-reel/paths');
require('./prompts/image-prompt');

const { PAGE_ACCESS_TOKEN } = process.env;
const PAGE_ID = '525878547285435';

const videoOutputPath = path.resolve(__dirname, 'assets/output/final-reel.mp4');

// 🟩 Post a video using a random quote as caption
const videoPosterFacebook = async (message, quote) => {
  console.log('Posting to Facebook...');
  const postId = await postVideoToFacebook(
    message,
    videoOutputPath,
    PAGE_ID,
    PAGE_ACCESS_TOKEN,
  );
  console.log('✅ Video posted to Facebook:', postId);

  console.log('Uploading image...');
  const imageMediaId = await uploadImageToFacebook(ORIGINAL_IMAGE_PATH);
  console.log('Image uploaded');

  console.log('💬 Commenting image...');
  const commentId = await postImageAsComment(postId, imageMediaId, quote);
  console.log('💬 Image commented', commentId);
};

module.exports = {
  videoPosterFacebook,
};
