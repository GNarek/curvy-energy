require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const { OPENAI_API_KEY } = process.env;

const getRandomQuote = () => {
  const quotesPath = path.resolve(__dirname, '../assets/quotes/quotes.json');
  console.log('quotesPath', quotesPath);
  const raw = fs.readFileSync(quotesPath, 'utf-8');
  const quotes = JSON.parse(raw);

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  return randomQuote.quote; // Only return the quote, not author
};

const postVideoToFacebook = async (
  message,
  videoPath,
  PAGE_ID,
  PAGE_ACCESS_TOKEN,
) => {
  const form = new FormData();

  form.append('description', message);
  form.append('access_token', PAGE_ACCESS_TOKEN);
  form.append('source', fs.createReadStream(videoPath));

  const res = await axios.post(
    `https://graph.facebook.com/${PAGE_ID}/videos`,
    form,
    {
      headers: {
        ...form.getHeaders(),
      },
    },
  );

  return res.data.id;
};

const postPhotoToFacebook = async (
  message,
  imageUrl,
  PAGE_ID,
  PAGE_ACCESS_TOKEN,
) => {
  const res = await axios.post(`https://graph.facebook.com/${PAGE_ID}/photos`, {
    caption: message,
    url: imageUrl,
    access_token: PAGE_ACCESS_TOKEN,
  });
  return res.data.post_id;
};

const generateCurvyWomanCaption = async (prompt) => {
  const res = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `
Write a short, powerful body-positive motivational caption (under 30 words) that sounds confident, emotional, and uplifting. It should celebrate curvy, plus-size women and promote self-love. The tone should be feminine, empowering, and Instagram-friendly. Make it reel-caption ready.

Return your response in **strict JSON format** like this:

{
  "caption": "Your poetic caption here.",
  "hashtags": "#hashtag1 #hashtag2 #hashtag3"
}

Avoid any explanation. No photo description. No generic affirmations. The caption should feel personal, real, and a little bold. Like something someone might write in their journal or post when they’re finally done shrinking.

Do not include any extra text or formatting.`.trim(),
        },
      ],
      max_tokens: 300,
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    },
  );

  const raw = res.data.choices[0].message.content.trim();

  try {
    const parsed = JSON.parse(raw);
    return {
      caption: parsed.caption.trim(),
      hashtags: parsed.hashtags.trim(),
    };
  } catch (err) {
    console.error('❌ Failed to parse caption JSON:', raw);
    throw err;
  }
};

const getCallToAction = () => {
  const ctas = [
    'Follow me for more... ❤️',
    'Drop a ❤️ if you love curves',
    'Send a ❤️ and I’ll send one back',
  ];
  return ctas[Math.floor(Math.random() * ctas.length)];
};

const getPostType = () => {
  const roll = Math.random();

  return roll < 0.7 ? 'video' : 'image';
};

module.exports = {
  generateCurvyWomanCaption,
  getCallToAction,
  postPhotoToFacebook,
  postVideoToFacebook,
  getRandomQuote,
  getPostType,
};
