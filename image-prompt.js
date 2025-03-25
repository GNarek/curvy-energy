const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateDallePrompt = () => {
  const actions = [
    "reading a book",
    "stretching after a nap",
    "dancing in the kitchen",
    "lying in the grass",
    "walking through a quiet park",
    "gazing out the window",
    "sitting at a café",
    "washing dishes while humming",
    "playing with a pet",
    "writing in a journal",
    "watering plants",
    "cooking breakfast",
    "folding laundry",
    "doing yoga",
    "painting on a canvas",
    "drinking coffee slowly",
  ];

  const locations = [
    "in a sunlit living room",
    "on a balcony during sunset",
    "in a cozy kitchen",
    "on a forest path",
    "by a calm lake",
    "in an artist's studio",
    "on a picnic blanket",
    "in a warm cafe corner",
    "under string lights in a backyard",
    "on a rooftop at twilight",
    "beside a window with rain falling",
  ];

  const outfits = [
    "wearing a soft sweater and leggings",
    "in a flowing summer dress",
    "wearing high-waisted jeans and a crop top",
    "in a casual tank top and joggers",
    "in an oversized hoodie",
    "in a loose shirt with comfy pants",
    "in a relaxed home outfit",
    "in a cozy robe",
  ];

  const moods = [
    "candid and natural",
    "gently elegant",
    "dreamy and real",
    "thoughtful and expressive",
    "quiet and emotional",
    "peaceful and relaxed",
    "realistic and unposed",
  ];

  const lightings = [
    "soft natural light",
    "golden hour glow",
    "early morning sunlight",
    "warm indoor lighting",
    "twilight shadows",
    "diffused rainy light",
  ];

  const action = random(actions);
  const location = random(locations);
  const outfit = random(outfits);
  const mood = random(moods);
  const lighting = random(lightings);

  const prompt = `A confident plus-size woman ${action} ${location}, ${outfit}. The lighting is ${lighting}. The scene feels ${mood}. Avoid studio or posed settings — make it feel like a real-life moment. She should have a visibly fuller figure to reflect realistic body diversity.`;

  return prompt;
};

module.exports = {
  generateDallePrompt,
};
