const path = require("path");

const ORIGINAL_IMAGE_PATH = path.resolve(
  __dirname,
  "../assets/temp/reel-image.jpg"
);
const PREPARED_IMAGE_PATH = path.resolve(
  __dirname,
  "../assets/temp/prepared-image.jpg"
);

module.exports = {
  ORIGINAL_IMAGE_PATH,
  PREPARED_IMAGE_PATH,
};
