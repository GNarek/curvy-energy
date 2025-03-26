const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateDallePrompt = () => {
  const actions = [
    "arching her back while stretching",
    "lying on her side with relaxed confidence",
    "sitting cross-legged, looking over her shoulder",
    "leaning back with arms behind her",
    "standing barefoot with hips slightly tilted",
    "reaching up with both arms playfully",
    "lounging on a bed, propped on one arm",
    "posing with one leg slightly raised",
    "twisting gently at the waist with a soft smile",
    "playing with her hair while reclining",
  ];

  const locations = [
    "on a sun-drenched balcony",
    "in a softly lit bedroom with white sheets",
    "on a warm wooden deck at sunset",
    "in front of sheer curtains with sunlight filtering in",
    "on a velvet couch with ambient natural light",
    "at a quiet garden terrace",
    "in a breezy open-window room",
  ];

  const outfits = [
    "in a sheer robe over a matching bralette and briefs",
    "wearing an off-shoulder crop top and fitted shorts",
    "in a flowing wrap dress loosely tied at the waist",
    "wearing a two-piece loungewear set with bare midriff",
    "in a silk slip dress with a low back",
    "in a high-slit skirt and open-front blouse",
    "wearing an oversized button-up shirt that falls off one shoulder",
  ];

  const vibes = [
    "confident and curvaceous",
    "elegantly sensual",
    "soft, bold, and body-celebrating",
    "natural and unapologetic",
    "warm, feminine, and intimate",
    "effortlessly seductive",
  ];

  const lighting = [
    "soft golden hour glow",
    "diffused natural window light",
    "sunlight filtered through sheer curtains",
    "moody sunset reflections",
    "morning light pouring across the bed",
    "twilight glow with soft shadows",
  ];

  const action = random(actions);
  const location = random(locations);
  const outfit = random(outfits);
  const mood = random(vibes);
  const light = random(lighting);

  const prompt = `Ultra-realistic photo of a confident extra plus-size woman ${action} ${location}, ${outfit}. The lighting is ${light}. The mood is ${mood}. Emphasize open posture, soft glowing skin, sensual curves, and body visibility. Avoid studio settings. No nudity.`;

  return prompt;
};

module.exports = {
  generateDallePrompt,
};
