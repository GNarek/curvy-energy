/**
 * Generate repeated noise effect filter strings.
 * @param {number} noise - noise level (0-100)
 * @param {string} between - time range string, e.g., "1.5,3.0"
 * @param {[number, number]} interval - [onDuration, offDuration]
 * @returns {string[]} - array of noise filter strings
 */
function generateNoise(noise, between, interval) {
  const [start, end] = between.split(",").map(Number);
  const [on, off] = interval;
  const filters = [];

  let t = start;
  while (t + on <= end) {
    const enable = `enable='between(t,${t.toFixed(2)},${(t + on).toFixed(2)})'`;
    filters.push(`noise=alls=${noise}:allf=t:${enable}`);
    t += on + off;
  }

  return filters;
}

/**
 * Generate repeated vignette effect filter strings.
 * @param {string} between - time range string, e.g., "1.5,3.0"
 * @param {[number, number]} interval - [onDuration, offDuration]
 * @returns {string[]} - array of vignette filter strings
 */
function generateVignette(between, interval) {
  const [start, end] = between.split(",").map(Number);
  const [on, off] = interval;
  const filters = [];

  let t = start;
  while (t + on <= end) {
    const enable = `enable='between(t,${t.toFixed(2)},${(t + on).toFixed(2)})'`;
    filters.push(`vignette=${enable}`);
    t += on + off;
  }

  return filters;
}

/**
 * Generate repeated blur filter strings using the 'boxblur' filter.
 * @param {string} between - time range string, e.g., "2.0,4.0"
 * @param {[number, number]} interval - [onDuration, offDuration]
 * @returns {string[]} - array of blur filter strings
 */
function generateBlur(between, interval) {
  const [start, end] = between.split(",").map(Number);
  const [on, off] = interval;
  const filters = [];

  let t = start;
  while (t + on <= end) {
    const enable = `enable='between(t,${t.toFixed(2)},${(t + on).toFixed(2)})'`;
    filters.push(`boxblur=10:5:${enable}`);
    t += on + off;
  }

  return filters;
}

/**
 * Generate repeated shake effect using random crop offsets.
 * @param {string} between - time range string, e.g., "4.0,6.0"
 * @param {[number, number]} interval - [onDuration, offDuration]
 * @returns {string[]} - array of shake filter strings
 */
function generateShake(between, interval, _angle = 1) {
  const [start, end] = between.split(",").map(Number);
  const [on, off] = interval;
  const filters = [];

  let t = start;
  let angle = _angle;

  while (t + on <= end) {
    const enable = `enable='between(t,${t.toFixed(2)},${(t + on).toFixed(2)})'`;
    const radians = ((angle * Math.PI) / 180).toFixed(4); // convert degrees to radians
    filters.push(`rotate=${radians}:${enable}`);
    angle = -angle; // alternate direction
    t += on + off;
  }

  return filters;
}

/**
 * Generate a fast-shaking effect using jittered crop positions.
 * @param {string} between - Time range like "0.0,4.0"
 * @param {[number, number]} interval - [onDuration, offDuration]
 * @param {number} intensity - Pixels to jitter (e.g. 5 or 10)
 * @returns {string[]} - FFmpeg filter strings
 */
function generateShakeOverlay(
  between,
  interval = [0.05, 0.05],
  intensity = 10
) {
  const [start, end] = between.split(",").map(Number);
  const [on, off] = interval;
  const filters = [];

  let t = start;
  let direction = 1;

  while (t + on <= end) {
    const tStart = t.toFixed(2);
    const tEnd = (t + on).toFixed(2);
    const offsetX = direction * intensity;
    const offsetY = direction * intensity;

    const enable = `between(t,${tStart},${tEnd})`;
    filters.push(`overlay=x='${offsetX}':y='${offsetY}':enable='${enable}'`);

    direction *= -1;
    t += on + off;
  }

  return filters;
}

/**
 * Generate blur with a fade-in effect over time.
 * @param {string} between - Time range, e.g., "1.0,3.0"
 * @param {number} steps - Number of blur levels (smoothness)
 * @returns {string[]} - Array of blur filters
 */
function generateBlurFadeIn(between, steps = 10) {
  const [start, end] = between.split(",").map(Number);
  const duration = end - start;
  const interval = duration / steps;
  const filters = [];

  for (let i = 0; i < steps; i++) {
    const tStart = (start + i * interval).toFixed(2);
    const tEnd = (start + (i + 1) * interval).toFixed(2);
    const blur = (1 + i).toFixed(1); // slowly increases from 1 to steps

    const enable = `enable='between(t,${tStart},${tEnd})'`;
    filters.push(`boxblur=${blur}:1:${enable}`);
  }

  return filters;
}

/**
 * Generate blur that fades out (from blurry to clear).
 * @param {string} between - Time range, e.g., "1.0,4.0"
 * @param {number} steps - Number of blur levels (smoothness)
 * @returns {string[]} - Array of blur filters
 */
function generateBlurFadeOut(between, steps = 10) {
  const [start, end] = between.split(",").map(Number);
  const duration = end - start;
  const interval = duration / steps;
  const filters = [];

  for (let i = 0; i < steps; i++) {
    const tStart = (start + i * interval).toFixed(2);
    const tEnd = (start + (i + 1) * interval).toFixed(2);
    const blur = (steps - i).toFixed(1); // start high, end at 1

    const enable = `enable='between(t,${tStart},${tEnd})'`;
    filters.push(`boxblur=${blur}:1:${enable}`);
  }

  return filters;
}

module.exports = {
  generateNoise,
  generateVignette,
  generateBlur,
  generateShake,
  generateBlurFadeIn,
  generateBlurFadeOut,
  generateShakeOverlay,
};
