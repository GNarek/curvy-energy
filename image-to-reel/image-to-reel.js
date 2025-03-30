const fs = require("fs");
const path = require("path");

const {
  prepareImageForReel,
} = require("./video-generator/prepare-vertical-image");
const { buildReelVideo } = require("./video-generator/reel-generator");
const { downloadImage } = require("./downloadImage");
const { ORIGINAL_IMAGE_PATH, PREPARED_IMAGE_PATH } = require("./paths");

const imageToReel = async (imageUrl, text, outputPath) => {
  /**
   * Returns the full path to a random .mp3 file from the audio folder
   */
  const getRandomAudioPath = () => {
    const audioDir = path.resolve(__dirname, "../assets/audio");
    const files = fs.readdirSync(audioDir).filter((f) => f.endsWith(".mp3"));

    if (files.length === 0) {
      throw new Error("No audio files found in assets/audio/");
    }

    const randomFile = files[Math.floor(Math.random() * files.length)];
    return path.join(audioDir, randomFile);
  };

  const audioPath = getRandomAudioPath();

  await downloadImage(imageUrl, ORIGINAL_IMAGE_PATH);

  console.log("📥 Preparing image...");
  await prepareImageForReel(ORIGINAL_IMAGE_PATH, PREPARED_IMAGE_PATH);

  console.log("🎬 Building reel...");
  await buildReelVideo(PREPARED_IMAGE_PATH, text, outputPath, audioPath);

  console.log("✅ Done:", outputPath);
};

module.exports = {
  imageToReel,
};
