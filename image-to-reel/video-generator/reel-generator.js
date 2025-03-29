const { exec } = require("child_process");

const {
  generateNoise,
  generateVignette,
  generateBlurFadeOut,
} = require("./effects");
const { generateCaptions } = require("./generate-captions");

/**
 * Creates a 12s reel with text overlays (with fade-out animation)
 * and optional audio.
 *
 * @param {string} imagePath - Prepared 1080x1920 image.
 * @param {string|string[]} captionLines - Up to 3 lines total.
 * @param {string} outputPath - MP4 output path.
 * @param {string|null} audioPath - Optional MP3 audio.
 */
const buildReelVideo = async (
  imagePath,
  captionLines,
  outputPath,
  audioPath = null
) => {
  const videoDuration = 12; // Duration of video in seconds
  const frameRate = 60;
  const totalFrames = videoDuration * frameRate;

  // Generate separate caption images, one per line
  const linePaths = generateCaptions(captionLines);

  // Build main video effect filters
  const effectFilters = [
    ...generateNoise(30, "0.0,9.0", [0.3, 0.0]),
    ...generateVignette("0.0,9.0", [0.3, 0.0]),
    ...generateVignette("9,12.0", [3, 0.0]),
    ...generateBlurFadeOut("0.0,7.0", 6),
  ].join(",");

  // Zoom & Shake settings (same as before)
  const zoomDuration = 3;
  const zoomFrames = zoomDuration * frameRate;
  const shakeDuration = 5;
  const shakeFrames = shakeDuration * frameRate;
  const shakeFrequency = 5;
  const zoomIncrement = ((1.15 - 1) / zoomFrames).toFixed(6);
  const zoomExpr = `zoom='if(lte(on\\,${zoomFrames})\\,1+on*${zoomIncrement}\\,1.15)'`;
  const shakeX = `x='if(lte(on\\,${shakeFrames})\\,(iw - iw/zoom)/2 + 5*sin(2*PI*${shakeFrequency}*on/${frameRate})\\,(iw - iw/zoom)/2)'`;
  const shakeY = `y='if(lte(on\\,${shakeFrames})\\,(ih - ih/zoom)/2 + 5*cos(2*PI*${shakeFrequency}*on/${frameRate})\\,(ih - ih/zoom)/2)'`;

  // Process the base image: apply fps, zoompan, effects, etc.
  const mainFilter = `[0:v]fps=${frameRate},zoompan=${zoomExpr}:${shakeX}:${shakeY}:s=1080x1920:d=${totalFrames}:fps=${frameRate}${
    effectFilters ? `,${effectFilters}` : ""
  }[base]`;

  // Define filter chains
  let filterChains = [];
  const fadeInDur = 0.5;
  const fadeOutDur = 0.5;
  const overlayX = "(W-w)/2";
  const overlayY = "(H-h)*0.75";

  const captionDuration = Math.floor(videoDuration / linePaths.length);

  // Prepare each caption as a separate input
  const inputs = linePaths
    .map((path, i) => `-loop 1 -t ${videoDuration} -i ${path}`)
    .join(" ");

  // First, filter for the base video
  filterChains.push(mainFilter);

  // Then add each caption with its timing
  for (let i = 0; i < linePaths.length; i++) {
    const inputIndex = i + 1;

    // Apply fade-in and fade-out effects to each caption
    const isLast = i === linePaths.length - 1;
    const startTime = i * captionDuration;
    const displayDuration = isLast
      ? videoDuration - startTime // last caption: stay until end
      : captionDuration;
    const fadeOut = isLast
      ? "" // don't fade last
      : `,fade=t=out:st=${displayDuration - fadeOutDur}:d=${fadeOutDur}`;

    filterChains.push(
      `[${inputIndex}:v]format=rgba,fade=t=in:st=0:d=${fadeInDur}${fadeOut},setpts=PTS-STARTPTS+${startTime}/TB[caption${i}]`
    );

    // Overlay caption onto video at the right time
    if (i === 0) {
      filterChains.push(
        `[base][caption${i}]overlay=${overlayX}:${overlayY}:enable='between(t,${startTime},${
          startTime + displayDuration
        })'[out${i}]`
      );
    } else {
      filterChains.push(
        `[out${
          i - 1
        }][caption${i}]overlay=${overlayX}:${overlayY}:enable='between(t,${startTime},${
          startTime + displayDuration
        })'[out${i}]`
      );
    }
  }

  // Set the final output to v
  filterChains.push(`[out${linePaths.length - 1}]copy[v]`);

  // Combine all filter chains with semicolons
  const filters = filterChains.join(";");

  // Build the full FFmpeg command
  let command = `ffmpeg -y -loop 1 -t ${videoDuration} -i ${imagePath} ${inputs}`;

  // Add audio input if provided
  if (audioPath) {
    command += ` -i ${audioPath}`;
  }

  // Add filter complex and output mapping
  command += ` -filter_complex "${filters}" -map "[v]"`;

  // Add audio mapping if provided
  if (audioPath) {
    command += ` -map ${linePaths.length + 1}:a`;
  }

  // Add final output options
  command += ` -t ${videoDuration} -r ${frameRate} -pix_fmt yuv420p ${outputPath}`;

  console.log("Running FFmpeg command...");

  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error("❌ FFmpeg error:", stderr);
        return reject(err);
      }
      resolve(outputPath);
    });
  });
};

module.exports = { buildReelVideo };
