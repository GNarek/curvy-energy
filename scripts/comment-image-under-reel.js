// new script: comment-image-under-reel.js
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const PAGE_ID = "525878547285435";

/**
 * Uploads an image to Facebook to get a reusable media ID.
 * @param {string} imagePath - Local path to the image file.
 * @returns {Promise<string>} - Facebook image media ID.
 */
const uploadImageToFacebook = async (imagePath) => {
  const form = new FormData();
  form.append("published", "false");
  form.append("access_token", PAGE_ACCESS_TOKEN);
  form.append("source", fs.createReadStream(imagePath));

  const response = await axios.post(
    `https://graph.facebook.com/v19.0/${PAGE_ID}/photos`,
    form,
    { headers: form.getHeaders() }
  );

  return response.data.id;
};

/**
 * Posts the uploaded image as a comment under a post (reel).
 * @param {string} postId - Facebook post ID (reel ID).
 * @param {string} imageMediaId - Facebook image ID.
 * @param {string} text - Comment text.
 */
const postImageAsComment = async (postId, imageMediaId, text) => {
  const response = await axios.post(
    `https://graph.facebook.com/v19.0/${postId}/comments`,
    null,
    {
      params: {
        access_token: PAGE_ACCESS_TOKEN,
        attachment_id: imageMediaId,
        message: text,
      },
    }
  );
  return response.data.id;
};

module.exports = {
  uploadImageToFacebook,
  postImageAsComment,
};
