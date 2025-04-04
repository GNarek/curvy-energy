require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const videoPath = path.resolve(__dirname, 'assets/output/final-reel.mp4');

const { TIKTOK_ACCESS_TOKEN, TIKTOK_OPEN_ID } = process.env;

const videoPosterTikTok = async (caption) => {
  try {
    console.log('📦 Initializing TikTok upload...');

    // Step 1: Initialize video upload session
    const initRes = await axios.post(
      'https://open.tiktokapis.com/v2/post/publish/video/init/',
      {
        source_info: {
          source: 'FILE_UPLOAD',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${TIKTOK_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const { upload_url, video_id } = initRes.data.data;
    console.log('✅ Upload session initialized:', video_id);

    // Step 2: Upload the actual video file to TikTok's pre-signed URL
    console.log('⬆️ Uploading video to TikTok...');
    const videoBuffer = fs.readFileSync(videoPath);
    await axios.put(upload_url, videoBuffer, {
      headers: {
        'Content-Type': 'video/mp4',
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    console.log('✅ Video uploaded to TikTok!');

    // Step 3: Publish the video
    console.log('🚀 Publishing video on TikTok...');
    const publishRes = await axios.post(
      'https://open.tiktokapis.com/v2/post/publish/video/',
      {
        video_id,
        text: caption,
      },
      {
        headers: {
          Authorization: `Bearer ${TIKTOK_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('🎉 TikTok video posted!', publishRes.data);
    return publishRes.data;
  } catch (error) {
    console.error(
      '❌ TikTok video upload failed:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

module.exports = {
  videoPosterTikTok,
};
