const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

/**
 * Splits the input text into multiple lines such that each line
 * fits within a max pixel width on the canvas.
 *
 * @param {string} text - The full caption text
 * @param {number} maxWidth - Maximum width (e.g., 1000px)
 * @param {string} font - The font to measure against (e.g., "64px Arial Bold")
 * @returns {string[]} array of lines
 */
function splitIntoFittingLines(
  text,
  maxWidth = 1000,
  font = "64px Arial Bold",
  minLines = 2
) {
  const canvas = createCanvas(10, 10);
  const ctx = canvas.getContext("2d");
  ctx.font = font;

  // Utility: measure if a line fits
  const fits = (line) => ctx.measureText(line).width <= maxWidth;

  // Recursively split a line if it doesn't fit
  function recursiveSplit(line) {
    const words = line.trim().split(/\s+/);
    if (words.length <= 1) return [line]; // Can't split further

    const chunkSize = Math.ceil(words.length / 3);
    const chunks = [];
    for (let i = 0; i < words.length; i += chunkSize) {
      const chunk = words.slice(i, i + chunkSize).join(" ");
      chunks.push(chunk);
    }

    const result = [];
    for (let chunk of chunks) {
      if (!fits(chunk)) {
        // Keep splitting recursively
        result.push(...recursiveSplit(chunk));
      } else {
        result.push(chunk);
      }
    }
    return result;
  }

  // Step 1: split original text into 3 chunks
  const initialWords = text.trim().split(/\s+/);
  const chunkSize = Math.ceil(initialWords.length / 3);
  const initialChunks = [];
  for (let i = 0; i < initialWords.length; i += chunkSize) {
    const chunk = initialWords.slice(i, i + chunkSize).join(" ");
    initialChunks.push(chunk);
  }

  // Step 2: recursively validate/split each chunk
  let lines = [];
  for (let chunk of initialChunks) {
    if (!fits(chunk)) {
      lines.push(...recursiveSplit(chunk));
    } else {
      lines.push(chunk);
    }
  }

  // Step 3: pad if too few lines
  while (lines.length < minLines) {
    lines.push("");
  }

  return lines;
}
/**
 * Draws a rounded rectangle on the provided canvas context.
 */
function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Generate a single-line image in "Pornhub style":
 *  - The first word is drawn in white on a black background.
 *  - The remaining words are drawn with black text over an orange rounded rectangle.
 *  - The black box uses overall horizontal and vertical padding.
 *  - The gap (space) between left and right text is part of the black box.
 *
 * @param {string} line - The text for this line.
 * @param {string} fileName - The file name to save (e.g., "caption-line1.png").
 * @returns {string} The file path of the generated image.
 */
function generateSingleLineImage(line, fileName) {
  const fontSize = 64;
  const font = `${fontSize}px Arial Bold`;
  const overallHPad = 20; // horizontal padding for the black box
  const overallVPad = 20; // vertical padding for the black box
  const orangeHPad = 10; // horizontal padding inside the orange box
  const orangeVPad = 5; // vertical padding for the orange box (independent)
  const cornerRadius = 10;

  // Split the line into the first word and the rest.
  const words = line.trim().split(" ");
  const leftText = words[0] || "";
  const rightText = words.slice(1).join(" ");

  // Create a temporary canvas to measure text widths.
  const tempCanvas = createCanvas(800, 200);
  const tempCtx = tempCanvas.getContext("2d");
  tempCtx.font = font;

  const leftWidth = tempCtx.measureText(leftText).width;
  const spaceWidth = tempCtx.measureText(" ").width; // gap that we want to keep in black box
  const rightWidth = rightText ? tempCtx.measureText(rightText).width : 0;

  // Total text width: left text + gap + orange box width (orange box width = orangeHPad*2 + rightWidth)
  let totalTextWidth = leftWidth;
  if (rightText) {
    totalTextWidth += spaceWidth + (orangeHPad * 2 + rightWidth);
  }

  // Black box dimensions.
  const blackBoxWidth = totalTextWidth + 2 * overallHPad;
  const blackBoxHeight = fontSize + 2 * overallVPad;

  // Calculate the orange box height independently.
  const orangeBoxHeight = fontSize + 2 * orangeVPad;
  // Center the orange box vertically within the black box.
  const orangeY = (blackBoxHeight - orangeBoxHeight) / 2;

  // Create the final canvas.
  const canvas = createCanvas(blackBoxWidth, blackBoxHeight);
  const ctx = canvas.getContext("2d");
  ctx.font = font;

  // Draw the full black background.
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, blackBoxWidth, blackBoxHeight);

  // Compute text baseline.
  const textY = overallVPad + fontSize * 0.8;

  // Draw left text in white.
  ctx.fillStyle = "white";
  ctx.fillText(leftText, overallHPad, textY);

  // If there is right text, draw the orange box and then the right text.
  if (rightText) {
    // The gap is drawn as part of the black box. So the orange box starts after the gap.
    const gap = spaceWidth;
    const orangeX = overallHPad + leftWidth + gap;
    // Orange box width: just the horizontal padding inside the orange box plus right text width.
    const orangeWidth = orangeHPad * 2 + rightWidth;

    ctx.fillStyle = "orange";
    drawRoundedRect(
      ctx,
      orangeX,
      orangeY,
      orangeWidth,
      orangeBoxHeight,
      cornerRadius
    );
    ctx.fill();

    // Draw the right text in black over the orange box.
    ctx.fillStyle = "black";
    const rightTextX = orangeX + orangeHPad;
    ctx.fillText(rightText, rightTextX, textY);
  }

  // Save the image.
  const outputPath = path.join(__dirname, fileName);
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(outputPath, buffer);

  return outputPath;
}

/**
 * Generate up to three images, one for each line.
 * If given a single string, forcibly split it into 3 parts (lines).
 * Return an array of file paths (e.g. [".../caption-line1.png", "..."])
 *
 * @param {string} caption - A single string (which we forcibly break into 3 lines).
 * @returns {string[]} array of file paths
 */
function generateCaptions(caption) {
  const font = "64px Arial Bold";
  const maxWidth = 1000; // adjust as needed based on screen limits
  const lines = splitIntoFittingLines(caption, maxWidth, font);
  const filePaths = [];

  lines.forEach((line, idx) => {
    const fileName = `caption-line${idx + 1}.png`;
    const p = generateSingleLineImage(line, fileName);
    filePaths.push(p);
  });

  return filePaths;
}

module.exports = { generateCaptions };
