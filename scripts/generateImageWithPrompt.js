require('dotenv').config();
const axios = require('axios');
const { checkImageSafety } = require('./checkImageSafety');
const { generateDallePrompt } = require('../prompts/image-prompt');

const { GOENHANCE_API_KEY } = process.env;

/**
 * Generates an image from GoEnhance using a prompt, polling until complete.
 * @param {string} prompt
 * @param {number} retryCount - Internal use for limiting safety retries
 * @returns {Promise<string>} - Final image URL
 */
const generateImageWithPrompt = async (prompt, retryCount = 0) => {
  const MAX_SAFETY_RETRIES = 5;

  // Step 1: Request image generation
  const generateImage = async () => {
    const seed = new Date().getTime();
    console.log('Seed:', seed);
    const response = await axios.post(
      'https://api.goenhance.ai/api/v1/text2image/generate',
      {
        // 1743628150594
        args: {
          seed: 1743823772793,
          prompt: retryCount > 0 ? generateDallePrompt() : prompt,
          negative_prompt:
            'worst quality, low quality, lowres, small ass, medium size ass, not extra huge ass, normal quality, bad anatomy, bad hands, bad fingers, deformed fingers, extra fingers, fused fingers, long fingers, blurry fingers, twisted hands, distorted limbs, text, watermark, error, nsfw, nude, topless, naked, see-through, sheer, mesh clothing, thong, exposed nipples, nipple covers, erotic, lingerie, bed, pose with no top, open shirt with no bra, fully exposed chest, open robe, straddling, sex toy, censored, mosaic, extreme cleavage, pornographic',
          ratio: '9:16',
          model: 12, // 3 // 12
          batch_size: 1,
        },
        type: 'mx-text2img',
      },
      {
        headers: {
          Authorization: `Bearer ${GOENHANCE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data.data.img_uuid;
  };

  // Step 2: Poll job until complete
  const getImageResult = async (img_uuid) => {
    const MAX_RETRIES = 100;
    const DELAY_MS = 10000;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      const res = await axios.get(
        `https://api.goenhance.ai/api/v1/jobs/detail?img_uuid=${img_uuid}`,
        {
          headers: {
            Authorization: `Bearer ${GOENHANCE_API_KEY}`,
          },
        },
      );

      const { status, json } = res.data.data;

      if (status === 'success' && json && json[0]?.value) {
        return json[0].value;
      }

      console.log(
        `⏳ Attempt ${attempt + 1}), status: ${status}, img_uuid: ${img_uuid}`,
      );
      await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    }

    throw new Error('GoEnhance image generation timed out.');
  };

  console.log(
    `🎨 Generating image (try ${retryCount + 1}/${MAX_SAFETY_RETRIES})...`,
  );
  const img_uuid = await generateImage();
  const imageUrl = await getImageResult(img_uuid);
  console.log('🖼️ Image generated:', imageUrl);

  console.log('🔍 Checking image for safety...');
  const result = await checkImageSafety(imageUrl);

  if (!result.flagged) {
    console.log('✅ The image is safe.');
    return imageUrl;
  }
  console.warn("❌ The image isn't safe. Regenerating...");

  if (retryCount + 1 >= MAX_SAFETY_RETRIES) {
    throw new Error(
      `Image failed safety check after ${MAX_SAFETY_RETRIES} attempts.`,
    );
  }

  return generateImageWithPrompt(prompt, retryCount + 1);
};

module.exports = { generateImageWithPrompt };
