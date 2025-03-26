const axios = require("axios");
const cheerio = require("cheerio");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const postPhotoToFacebook = async (
  message,
  imageUrl,
  PAGE_ID,
  PAGE_ACCESS_TOKEN
) => {
  const res = await axios.post(`https://graph.facebook.com/${PAGE_ID}/photos`, {
    caption: message,
    url: imageUrl,
    access_token: PAGE_ACCESS_TOKEN,
  });
  return res.data.post_id;
};

const generateImageWithGoEnhancePrompt = async (prompt) => {
  const GOENHANCE_API_KEY = process.env.GOENHANCE_API_KEY;
  const axios = require("axios");

  // Step 1: Generate image UUID
  const generateImage = async () => {
    const response = await axios.post(
      "https://api.goenhance.ai/api/v1/text2image/generate",
      {
        args: {
          seed: -1,
          prompt,
          negative_prompt:
            "worst quality,low quality, normal quality, lowres, bad anatomy, bad hands, text, error, nsfw",
          ratio: "1:1",
          model: 12,
          batch_size: 1,
        },
        type: "mx-text2img",
      },
      {
        headers: {
          Authorization: `Bearer ${GOENHANCE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.data.img_uuid;
  };

  // Step 2: Poll job until image is ready
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
        }
      );

      const { status, json } = res.data.data;

      if (status === "success" && json && json[0]?.value) {
        return json[0].value;
      }

      console.log(
        `⏳ Attempt ${attempt + 1}), status: ${status}, img_uuid: ${img_uuid},`
      );
      await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    }

    throw new Error("GoEnhance image generation timed out.");
  };

  const img_uuid = await generateImage();
  return await getImageResult(img_uuid);
};

const generateCurvyWomanCaption = async (prompt) => {
  const res = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: `
You're helping generate a Facebook post caption and matching hashtags for a photo of a confident plus-size woman or two women, unapologetically beautiful in casual, revealing clothing.

The world often tells women they need to be small to be worthy. This page exists to celebrate curves, confidence, softness, skin, and real femininity. The goal is to stop the scroll — with quiet power, poetic defiance, or emotional resonance.

Return your response in **strict JSON format** like this:

{
  "caption": "Your poetic caption here.",
  "hashtags": "#hashtag1 #hashtag2 #hashtag3"
}

Avoid any explanation. No photo description. No generic affirmations. The caption should feel personal, real, and a little bold. Like something someone might write in their journal or post when they’re finally done shrinking.

Do not include any extra text or formatting.

### Image Prompt:
${prompt}
        `.trim(),
        },
      ],
      max_tokens: 300,
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const raw = res.data.choices[0].message.content.trim();

  try {
    const parsed = JSON.parse(raw);
    return {
      caption: parsed.caption.trim(),
      hashtags: parsed.hashtags.trim(),
    };
  } catch (err) {
    console.error("❌ Failed to parse caption JSON:", raw);
    throw err;
  }
};

module.exports = {
  generateImageWithGoEnhancePrompt,
  generateCurvyWomanCaption,
  postPhotoToFacebook,
};
