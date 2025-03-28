const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateDallePrompt = () => {
  const nationalities = [
    "Armenian",
    "Brazilian",
    "Latina",
    "Korean",
    "Indian",
    "Middle Eastern",
    "Eastern European",
    "Caribbean",
    "Thai",
    "Filipina",
    "Afro-French",
    "Italian",
    "Ethiopian",
    "Native American",
  ];

  const poses = [
    "walking confidently and adjusting her top while laughing",
    "stretching her arms while smiling at something off-camera",
    "sipping a cold drink and leaning against a wall while laughing",
    "tying her hair up while walking down a sunny street while laughing",
    "checking her phone while seated with legs crossed while laughing",
    "pulling her shirt down slightly as she adjusts it mid-walk while laughing",
    "brushing hair out of her face while laughing while laughing",
    "holding a shopping bag and biting her lip playfully while laughing",
    "looking over her sunglasses while leaning on a railing while laughing",
    "dancing to music with earbuds in, unaware of the camera while laughing",
    "standing with her back but looking at you over her shoulder while laughing",
  ];

  const groupPoses = [
    "on standing with her back but looking at you over her shoulder the other one looking at her",
    "laughing together while walking side-by-side, one flipping her hair",
    "adjusting each other's crop tops while chatting",
    "taking a selfie together while leaning close",
    "clinking iced drinks together in celebration",
    "sharing a secret while one bites her lip",
    "dancing in the street together in sync",
    "playfully bumping hips while posing for fun",
    "one helping the other fix her shorts mid-conversation",
    "laughing loudly while holding hands and spinning",
    "posing in sync while pretending to model for fun",
  ];

  const locations = [
    "on a vibrant city street",
    "in a sunny park with flowers",
    "on a rooftop patio at golden hour",
    "by a graffiti wall in an urban alley",
    "on outdoor steps in front of a café",
    "in a vintage-looking courtyard",
    "under soft dappled tree light",
    "next to a food truck on a warm day",
  ];

  const colors = [
    "black",
    "white",
    "red",
    "dark red",
    "burgundy",
    "pink",
    "hot pink",
    "baby pink",
    "fuchsia",
    "rose gold",
    "purple",
    "lavender",
    "deep violet",
    "midnight blue",
    "teal",
    "turquoise",
    "emerald green",
    "lime green",
    "gold",
    "silver",
    "metallic",
    "denim blue",
  ];

  const outfits = [
    "in ultra-short [bottomColor] denim shorts and a fitted [topColor] crop top",
    "wearing a low-cut [topColor] tank top with [bottomColor] high-waisted shorts",
    "in a tight [topColor] t-shirt tied at the waist and short [bottomColor] athletic shorts",
    "in a backless [topColor] halter top with ripped [bottomColor] low-rise jeans",
    "wearing a loose off-shoulder [topColor] tee with nothing underneath and tiny [bottomColor] shorts",
    "in a low-rise [bottomColor] miniskirt and a tucked-in [topColor] ribbed tank",
    "wearing an unzipped [topColor] hoodie showing bare midriff and [bottomColor] jean shorts",
    "in a [topColor] spaghetti-strap top and barely-buttoned [bottomColor] shorts",
    "wearing a button-up [topColor] shirt that falls open over short [bottomColor] cotton shorts",
    "in a sleeveless [topColor] crop top and micro [bottomColor] shorts hugging her hips",

    // NEW colorized sexy variants:
    "in a barely-there [topColor] bikini top and a [bottomColor] plaid mini skirt riding low",
    "wearing a sheer [topColor] mesh crop top that just covers her nipples and a tight [bottomColor] leather mini skirt",
    "in a micro [topColor] top that clings to her curves and a frilly [bottomColor] miniskirt swaying with every step",
    "wearing a strapless [topColor] tube top with underboob peeking and a tight [bottomColor] ruched mini skirt",
    "in a tied-up [topColor] scarf top barely covering her chest and a low-cut [bottomColor] pleated skirt",
    "in a plunging [topColor] V-neck bralette and a [bottomColor] short skirt with a thigh-high slit",
    "wearing [topColor] tank top under a sheer [bottomColor] lace shrug and distressed denim shorts",
    "in a [topColor] bikini top under a half-buttoned [bottomColor] blouse and a mini wrap skirt",
    "in a lace-up [topColor] crop top revealing sideboob and a skin-tight [bottomColor] micro mini",
    "wearing a [topColor] crop bikini top and an oversized [bottomColor] belt-styled skirt",
  ];

  const moods = [
    "effortlessly sexy and confident",
    "bold, flirtatious, and unbothered",
    "naturally seductive in her own skin",
    "casually hot and playful",
    "radiating curves and charisma",
    "innocent on the surface, seductive in energy",
  ];

  const lighting = [
    "soft golden hour glow from behind",
    "sunlight filtering through urban trees",
    "reflected late afternoon light on skin",
    "evening streetlight casting soft shadows",
    "sunlight bouncing off surrounding buildings",
    "early morning city light with long shadows",
  ];

  // const isGroup = Math.random() < 0.3;
  const isGroup = false;

  const mainAction = isGroup ? random(groupPoses) : random(poses);
  const location = random(locations);

  const mood = random(moods);
  const light = random(lighting);

  const nationality1 = "African American";
  let nationality2 = nationality1;

  while (nationality2 === nationality1) {
    nationality2 = random(nationalities);
  }

  const getRandomColor = () =>
    colors[Math.floor(Math.random() * colors.length)];

  const getOutfit = () => {
    const outfitTemplate = outfits[Math.floor(Math.random() * outfits.length)];
    let topColor = getRandomColor();
    let bottomColor = getRandomColor();

    // Optional: avoid same top and bottom color
    while (bottomColor === topColor) {
      bottomColor = getRandomColor();
    }

    return outfitTemplate
      .replace("[topColor]", topColor)
      .replace("[bottomColor]", bottomColor);
  };

  let subject;
  let outfit;

  if (isGroup) {
    const outfit1 = getOutfit();
    const outfit2 = getOutfit();
    outfit = `${outfit1}. The other is ${outfit2}. Be sure they aren't wearing the same clothes and totally different.`;
    subject = `a ${nationality1} and a ${nationality2} extra plus-size woman`;
  } else {
    outfit = getOutfit();
    subject = `a confident, beautiful ${nationality1} extra plus-size woman`;
  }

  const prompt = `Ultra-realistic cinematic photo of ${subject} ${mainAction} ${location}, ${outfit}. Lighting is ${light}. Mood is ${mood}. Focus on glowing skin, natural curves, strong eye contact, soft lips, and captivating posture. Full body visible. Clothing must be casual, real-world, and worn outdoors — no lingerie, no nudity, no beds, no NSFW setting. Highly detailed, no studio backdrop, strictly no nudity and strictly no NSFW setting, women strictly must be extra plus-size (fat) about 120kg. Not naked`;

  return prompt;
};

module.exports = {
  generateDallePrompt,
};
