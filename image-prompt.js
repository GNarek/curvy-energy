const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateDallePrompt = () => {
  const indoorActions = [
    "reading a book",
    "stretching after a nap",
    "dancing in the kitchen",
    "writing in a journal",
    "watering plants",
    "cooking breakfast",
    "folding laundry",
    "doing yoga",
    "painting on a canvas",
    "drinking tea by the window",
  ];

  const outdoorActions = [
    "lying in the grass",
    "walking through a park",
    "sitting at a café",
    "enjoying a picnic",
    "watching the sunset",
    "standing on a balcony",
    "walking a dog",
    "browsing a street market",
    "resting on a bench under trees",
    "strolling by a lake",
  ];

  const indoorLocations = [
    "in a cozy kitchen",
    "in a sunlit living room",
    "on a balcony during sunset",
    "in an artist's studio",
    "in a warmly lit bedroom",
    "in a plant-filled reading nook",
    "in a home with soft ambient light",
  ];

  const outdoorLocations = [
    "in a quiet park",
    "on a forest path",
    "by a calm lake",
    "on a rooftop at twilight",
    "in a garden with flowers",
    "under string lights",
    "at an open-air café",
  ];

  const outfits = [
    "in denim short shorts and a loose t-shirt",
    "in soft cotton shorts and a tank top",
    "wearing high-waisted short shorts with a crop top",
    "in sporty short shorts and a relaxed tee",
    "in flowy short shorts and a tucked-in blouse",
    "in casual short shorts and an open button-up shirt",
    "in linen short shorts and a relaxed summer top",
  ];

  const moods = [
    "natural and relaxed",
    "warm and thoughtful",
    "peaceful and candid",
    "gentle and expressive",
    "soft and introspective",
    "realistic and uplifting",
  ];

  const lightings = [
    "soft daylight",
    "golden hour light",
    "early morning glow",
    "diffused indoor lighting",
    "twilight ambiance",
    "cozy warm-toned light",
  ];

  const isOutdoor = Math.random() > 0.5;
  const action = isOutdoor ? random(outdoorActions) : random(indoorActions);
  const location = isOutdoor
    ? random(outdoorLocations)
    : random(indoorLocations);
  const outfit = random(outfits);
  const mood = random(moods);
  const lighting = random(lightings);

  const prompt = `A confident plus-size woman ${action} ${location}, ${outfit}. The lighting is ${lighting}. The scene feels ${mood}. Avoid studio or posed settings — make it feel like a real-life moment. Her appearance should represent natural body diversity.`;

  return prompt;
};
module.exports = {
  generateDallePrompt,
};
