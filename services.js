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

const generateImageWithDallePrompt = async (prompt) => {
  const res = await axios.post(
    "https://api.openai.com/v1/images/generations",
    {
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data.data[0]?.url;
};

const generateCurvyWomanCaption = async () => {
  const prompt = `Generate a short, emotionally engaging question that encourages empathy or admiration for a plus-size woman without making conclusions. Avoid generic phrases. It should feel personal, real, and slightly vulnerable — like something someone might post as a caption. Example: ‘Is confidence still confidence when it doesn’t fit the mold?’ or ‘Would you still think she’s beautiful if she didn’t hide?’ Each question must be unique, slightly poetic, and subtle.`;

  const res = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data.choices[0].message.content.trim();
};

module.exports = {
  // generateDallePrompt,
  generateImageWithDallePrompt,
  generateCurvyWomanCaption,
  postPhotoToFacebook,
};
