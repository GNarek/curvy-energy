require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const path = require("path");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const getRandomQuote = () => {
  const quotesPath = path.resolve(__dirname, "../assets/quotes/quotes.json");
  console.log("quotesPath", quotesPath);
  const raw = fs.readFileSync(quotesPath, "utf-8");
  const quotes = JSON.parse(raw);

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  return randomQuote.quote; // Only return the quote, not author
};

const postVideoToFacebook = async (
  message,
  videoPath,
  PAGE_ID,
  PAGE_ACCESS_TOKEN
) => {
  const form = new FormData();

  form.append("description", message);
  form.append("access_token", PAGE_ACCESS_TOKEN);
  form.append("source", fs.createReadStream(videoPath));

  const res = await axios.post(
    `https://graph.facebook.com/${PAGE_ID}/videos`,
    form,
    {
      headers: {
        ...form.getHeaders(),
      },
    }
  );

  return res.data.id;
};

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
            "nudity, worst quality, low quality, lowres, normal quality, bad anatomy, bad hands, text, watermark, error, nsfw, nude, topless, naked, see-through, sheer, mesh clothing, thong, bikini, underwear, exposed nipples, nipple covers, erotic, lingerie, bed, pose with no top, open shirt with no bra, fully exposed chest, open robe, straddling, sex toy, censored, mosaic, extreme cleavage, pornographic",
          ratio: "9:16",
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
Write a short Facebook post caption written in the voice of a confident plus-size woman (or two women), shown in a photo wearing casual, revealing clothing. The tone can be bold, soft, emotional, or flirty — but it should feel like her own words, not a third-party narrator.

Make it sound personal, like something she’d post to her own page or story — a message to her followers, the world, or herself.

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

const getCallToAction = () => {
  const ctas = [
    "Do I deserve a like? 👍",
    "Drop a ❤️ if you love curves",
    "Send a 💋 and I’ll send one back",
  ];
  return ctas[Math.floor(Math.random() * ctas.length)];
};

const getPostType = () => {
  const roll = Math.random();

  return roll < 0.7 ? "video" : "image";
};

module.exports = {
  generateImageWithGoEnhancePrompt,
  generateCurvyWomanCaption,
  getCallToAction,
  postPhotoToFacebook,
  postVideoToFacebook,
  getRandomQuote,
  getPostType,
};
