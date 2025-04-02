require('dotenv').config();
const axios = require('axios');
const { postCommentToInstagram } = require('./video-poster-instagram');

const { IG_USER_ID, IG_ACCESS_TOKEN } = process.env;

// Utility function to wait
// eslint-disable-next-line no-promise-executor-return
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Check if media is ready
const isMediaReady = async (creationId) => {
  const res = await axios.get(
    `https://graph.facebook.com/v19.0/${creationId}`,
    {
      params: {
        fields: 'status_code',
        access_token: IG_ACCESS_TOKEN,
      },
    },
  );
  return res.data.status_code === 'FINISHED';
};

// Main function
const imagePosterInstagram = async (imageUrl, caption, quote) => {
  try {
    // Step 1: Create media container
    const containerRes = await axios.post(
      `https://graph.facebook.com/v19.0/${IG_USER_ID}/media`,
      null,
      {
        params: {
          image_url: imageUrl,
          caption,
          access_token: IG_ACCESS_TOKEN,
        },
      },
    );

    const creationId = containerRes.data.id;
    console.log('📦 IG media container created:', creationId);

    // 🔁 Step 2: Wait for media to be ready (retry up to 10 times)
    let ready = false;
    for (let i = 1; i <= 10; i += 1) {
      console.log(`⏳ Checking media readiness (attempt ${i}/10)...`);
      // eslint-disable-next-line no-await-in-loop
      if (await isMediaReady(creationId)) {
        ready = true;
        break;
      }
      // eslint-disable-next-line no-await-in-loop
      await wait(5000); // wait 5 seconds between attempts
    }

    if (!ready) {
      throw new Error('⛔ Media not ready after 10 attempts.');
    }

    // Step 3: Publish media
    const publishRes = await axios.post(
      `https://graph.facebook.com/v19.0/${IG_USER_ID}/media_publish`,
      null,
      {
        params: {
          creation_id: creationId,
          access_token: IG_ACCESS_TOKEN,
        },
      },
    );

    const postId = publishRes.data.id;
    console.log('✅ Image posted to Instagram:', postId);

    // Step 4: Post quote as comment
    if (quote) {
      console.log('💬 Posting quote under the image...');
      await postCommentToInstagram(postId, quote);
      console.log('✅ Quote commented under image!');
    }

    return postId;
  } catch (err) {
    console.error(
      '❌ Failed to post image to Instagram:',
      err.response?.data || err.message,
    );
    throw err;
  }
};

module.exports = {
  imagePosterInstagram,
};
