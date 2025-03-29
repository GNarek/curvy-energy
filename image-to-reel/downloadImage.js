const axios = require("axios");
const fs = require("fs");
const path = require("path");

const downloadImage = async (url, outputPath) => {
  const response = await axios.get(url, { responseType: "stream" });

  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(outputPath);
    response.data.pipe(stream);
    stream.on("finish", () => resolve(outputPath));
    stream.on("error", reject);
  });
};

module.exports = { downloadImage };
