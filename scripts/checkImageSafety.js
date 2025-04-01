require("dotenv").config();
const axios = require("axios");

/**
 * Uses Sightengine API to check if image contains nudity.
 * Only flags image if there is clear nudity or too much exposure.
 *
 * @param {string} imageUrl - Publicly accessible image URL
 * @returns {Promise<{ flagged: boolean, issues: string[] }>}
 */
const checkImageSafety = async (imageUrl) => {
  try {
    const res = await axios.get("https://api.sightengine.com/1.0/check.json", {
      params: {
        url: imageUrl,
        models: "nudity-2.1",
        api_user: process.env.SIGHTENGINE_USER,
        api_secret: process.env.SIGHTENGINE_SECRET,
      },
    });

    const { nudity } = res.data;
    console.log("🔎 Sightengine result:", nudity);

    const flagged =
      nudity.raw > 0.01 ||
      nudity.partial > 0.2 ||
      nudity.erotica > 0.7 || // High erotic energy
      nudity.very_suggestive > 0.98 || // Might contain open parts
      nudity.sexual_display > 0.1 || // just in case it triggers
      nudity.suggestive_classes.cleavage_categories?.very_revealing > 0.3;

    const issues = [];
    if (flagged) {
      if (nudity?.raw > 0.01) issues.push(`Raw nudity: ${nudity.raw}`);
      if (nudity?.partial > 0.2)
        issues.push(`Partial nudity: ${nudity.partial}`);
    }

    return { flagged, issues };
  } catch (err) {
    console.warn(
      "⚠️ Sightengine API error:",
      err?.response?.data || err.message
    );
    return { flagged: false, issues: ["Sightengine API failed"] };
  }
};

module.exports = { checkImageSafety };
