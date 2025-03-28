const axios = require("axios");
require("dotenv").config();

const { generateDallePrompt } = require("./image-prompt");

const GOENHANCE_API_KEY = process.env.GOENHANCE_API_KEY;

// Step 2: Poll the image result
async function getImageResult(img_uuid) {
  const MAX_RETRIES = 100;
  const DELAY_MS = 10000;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const res = await axios.get(
        // `https://api.goenhance.ai/api/v1/image/result?img_uuid=${img_uuid}`,
        `https://api.goenhance.ai/api/v1/jobs/detail?img_uuid=${img_uuid}`,
        {
          headers: {
            Authorization: `Bearer ${GOENHANCE_API_KEY}`,
          },
        }
      );

      const { status, images } = res.data.data;

      if (status === "success") {
        console.log("Image is ready:", res.data.data.json[0].value);
        return res.data.data.json[0].value; // URL of the image
      } else {
        console.log(
          `Attempt ${attempt + 1}: Image not ready, status: ${status}`
        );
      }
    } catch (err) {
      console.error("Error checking image status:", err.message);
    }

    await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
  }

  throw new Error("Image generation timed out.");
}

// Combine steps
(async () => {
  try {
    // const img_uuid = await generateImage();
    const imageUrl = await getImageResult(
      "682cc8e2-2fe6-472f-af87-622aa01a781f"
    );
    console.log("✅ Image ready to use:", imageUrl);

    // You can now post `imageUrl` to Facebook or anywhere else.
  } catch (err) {
    console.error("❌ Failed to generate image:", err.message);
  }
})();
