const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateDallePrompt = () => {
  const nationalities = [
    "Armenian",
    "Brazilian",
    "African American",
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
    "walking confidently and adjusting her top",
    "stretching her arms while smiling at something off-camera",
    "sipping a cold drink and leaning against a wall",
    "tying her hair up while walking down a sunny street",
    "checking her phone while seated with legs crossed",
    "pulling her shirt down slightly as she adjusts it mid-walk",
    "brushing hair out of her face while laughing",
    "holding a shopping bag and biting her lip playfully",
    "looking over her sunglasses while leaning on a railing",
    "dancing to music with earbuds in, unaware of the camera",
  ];

  const groupPoses = [
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

  const outfits = [
    "in ultra-short denim shorts and a fitted crop top",
    "wearing a low-cut tank top with high-waisted shorts",
    "in a tight t-shirt tied at the waist and short athletic shorts",
    "in a backless halter top with ripped low-rise jeans",
    "wearing a loose off-shoulder tee with nothing underneath and tiny shorts",
    "in a low-rise miniskirt and a tucked-in ribbed tank",
    "wearing an unzipped hoodie showing bare midriff and jean shorts",
    "in a spaghetti-strap top and barely-buttoned shorts",
    "wearing a button-up shirt that falls open over short cotton shorts",
    "in a sleeveless crop top and micro shorts hugging her hips",
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

  const isGroup = Math.random() < 0.3;
  // const isGroup = true;

  const mainAction = isGroup ? random(groupPoses) : random(poses);
  const location = random(locations);

  const mood = random(moods);
  const light = random(lighting);

  let subject;
  let outfit;

  const nationality1 = random(nationalities);
  let nationality2 = nationality1;

  while (nationality2 === nationality1) {
    nationality2 = random(nationalities);
  }

  if (isGroup) {
    const outfit1 = random(outfits);
    const outfit2 = random(outfits.filter((o) => o !== outfit1));
    outfit = `${outfit1}. The other is ${outfit2}. Be sure they aren't wearing the same clothes and totally different.`;
    subject = `a ${nationality1} and a ${nationality2} extra plus-size woman`;
  } else {
    outfit = random(outfits);
    subject = `a confident, seductive ${nationality1} extra plus-size woman`;
  }

  const prompt = `Ultra-realistic cinematic photo of ${subject} ${mainAction} ${location}, ${outfit}. Lighting is ${light}. Mood is ${mood}. Focus on glowing skin, natural curves, strong eye contact, soft lips, and captivating posture. Full body visible. Clothing must be casual, real-world, and worn outdoors — no lingerie, no nudity, no beds, no NSFW setting. Highly detailed, no studio backdrop, strictly no nudity, women strictly must be extra plus-size (fat) about 120kg.`;

  return prompt;
};

module.exports = {
  generateDallePrompt,
};
