require('dotenv').config();
const path = require('path');
const axios = require('axios');
const cloudinary = require('cloudinary').v2;

const videoOutputPath = path.resolve(__dirname, 'assets/output/final-reel.mp4');
const {
  IG_USER_ID,
  IG_ACCESS_TOKEN,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

// 🔧 Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

// ⬆️ Upload video to Cloudinary
const uploadVideoToCloudinary = async (localPath) => {
  try {
    const result = await cloudinary.uploader.upload(localPath, {
      resource_type: 'video',
      folder: 'instagram_reels',
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      eager_async: true,
      eager: [
        {
          format: 'mp4',
          audio_codec: 'aac',
          video_codec: 'h264',
        },
      ],
    });

    const publicId = result.public_id;

    // ⏳ Poll for eager transformation to complete
    const waitForEager = async (attempt = 1) => {
      const info = await cloudinary.api.resource(publicId, {
        resource_type: 'video',
      });

      console.log(`ℹ️ Retry ${attempt} — checking for transcoded video...`);
      const derivedUrl = info.derived?.[0]?.secure_url;

      if (!derivedUrl) {
        if (attempt > 20) {
          throw new Error('Cloudinary eager transformation took too long.');
        }
        // eslint-disable-next-line no-promise-executor-return
        await new Promise((r) => setTimeout(r, 5000));
        // eslint-disable-next-line no-return-await
        return await waitForEager(attempt + 1);
      }

      return { url: derivedUrl, public_id: publicId };
    };

    return await waitForEager();
  } catch (err) {
    console.error('❌ Failed to upload to Cloudinary:', err.message || err);
    throw err;
  }
};

const createInstagramVideoContainer = async (videoUrl, caption) => {
  const endpoint = `https://graph.facebook.com/v19.0/${IG_USER_ID}/media`;
  const params = {
    video_url: videoUrl,
    caption,
    media_type: 'REELS',
    access_token: IG_ACCESS_TOKEN,
  };

  const res = await axios.post(endpoint, null, { params });
  const creationId = res.data.id;

  // 🔄 Poll container status until it's ready
  const checkStatus = async (attempt = 1) => {
    const statusUrl = `https://graph.facebook.com/v19.0/${creationId}?fields=status_code&access_token=${IG_ACCESS_TOKEN}`;

    const statusRes = await axios.get(statusUrl);
    const status = statusRes.data?.status_code;

    if (status === 'FINISHED') {
      console.log('✅ IG container is ready');
      return creationId;
    }

    if (status === 'ERROR' || attempt >= 30) {
      throw new Error(
        `❌ IG container failed or took too long (status: ${status})`,
      );
    }

    console.log(
      `⏳ Waiting for IG container to be ready... (attempt ${attempt})`,
    );
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((r) => setTimeout(r, 5000)); // wait 3s
    return checkStatus(attempt + 1);
  };

  // eslint-disable-next-line no-return-await
  return await checkStatus();
};

// 🚀 Publish video to Instagram
const publishInstagramMedia = async (creationId, attempt = 1) => {
  const endpoint = `https://graph.facebook.com/v19.0/${IG_USER_ID}/media_publish`;
  const params = {
    creation_id: creationId,
    access_token: IG_ACCESS_TOKEN,
  };

  try {
    const res = await axios.post(endpoint, null, { params });
    return res.data.id;
  } catch (err) {
    const error = err?.response?.data?.error;

    if (error) {
      console.log(
        `🚫 Attempt ${attempt}: [${error.code}/${error.error_subcode}] ${error.error_user_msg || error.message}`,
      );
    } else {
      console.log(`❌ Unexpected error at attempt ${attempt}:`, err.message);
    }

    const isMediaNotReady =
      error?.code === 9007 ||
      error?.error_subcode === 2207027 ||
      error?.message?.includes('Media ID is not available');

    if (isMediaNotReady) {
      if (attempt > 20)
        throw new Error('Instagram media publish took too long.');
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((r) => setTimeout(r, 5000)); // wait 5s
      // eslint-disable-next-line no-return-await
      return await publishInstagramMedia(creationId, attempt + 1);
    }

    throw err;
  }
};

// 🗑️ Delete video from Cloudinary
const deleteVideoFromCloudinary = async (publicId) => {
  await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
};

// 💬 Comment under the IG post
const postCommentToInstagram = async (igMediaId, text) => {
  // eslint-disable-next-line no-constant-condition
  const endpoint = `https://graph.facebook.com/v19.0/${igMediaId}/comments`;
  const params = {
    message: text,
    access_token: IG_ACCESS_TOKEN,
  };

  const res = await axios.post(endpoint, null, { params });
  return res.data.id;
};

// 🧠 Main function
const videoPosterInstagram = async (message, quote) => {
  console.log('📤 Uploading video to Cloudinary...');
  const { url, public_id: publicId } =
    await uploadVideoToCloudinary(videoOutputPath);
  console.log('✅ Video uploaded!');

  console.log('📦 Creating Instagram video container...');
  const creationId = await createInstagramVideoContainer(url, message);

  console.log('⏳ Waiting 10 seconds for Instagram to process the media...');
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((resolve) => setTimeout(resolve, 15000)); // wait 15s

  console.log('🚀 Publishing video to Instagram...');

  const igPostId = await publishInstagramMedia(creationId);
  console.log('✅ Video posted to Instagram:', igPostId);

  console.log('🧹 Deleting Cloudinary video...');
  await deleteVideoFromCloudinary(publicId);
  console.log('🗑️ Cloudinary cleanup complete.');

  console.log('💬 Posting quote under the Reel...');
  await postCommentToInstagram(igPostId, quote);
  console.log('✅ Quote commented under Reel!');
};

module.exports = {
  videoPosterInstagram,
  postCommentToInstagram,
};
