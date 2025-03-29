// prepare-vertical-image.js
const { exec } = require("child_process");

/**
 * Crops image to centered 9:16 and resizes to 1080x1920
 * @param {string} inputPath
 * @param {string} outputPath
 * @returns {Promise<string>}
 */
const prepareImageForReel = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    const command =
      `ffmpeg -y -i ${inputPath} ` +
      `-vf "crop='min(in_w, in_h*9/16)':'min(in_h, in_w*16/9)':(in_w-out_w)/2:(in_h-out_h)/2,scale=1080:1920" ` +
      `${outputPath}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("❌ Image preparation failed:", stderr);
        return reject(error);
      }
      resolve(outputPath);
    });
  });
};

module.exports = { prepareImageForReel };
