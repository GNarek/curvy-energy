const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateDallePrompt = () => {
  const nationalities = [
    'Armenian',
    'Brazilian',
    'Latina',
    'Korean',
    'Indian',
    'Middle Eastern',
    'Eastern European',
    'Caribbean',
    'Thai',
    'Filipina',
    'Afro-French',
    'Italian',
    'Ethiopian',
    'Native American',
  ];

  const poses = [
    'walking confidently and adjusting her top while biting her lip',
    'sitting somewhere, stretching her arms with a seductive smile',
    'sitting somewhere, sipping a drink and lifting her shirt slightly',
    'tying her hair while smirking at the camera',
    'checking her phone,  sitting somewhere legs open slightly, with confidence',
    'pulling her shirt down suggestively mid-walk',
    'brushing hair from her chest and holding eye contact',
    'biting her lip while leaning on a wall playfully',
    'looking over sunglasses with a teasing expression',
    'dancing with curves swinging, lost in the moment',
    'standing with her back turned, looking over her shoulder seductively',
    'standing with her back turned, looking over her shoulder seductively',
    'standing with her back turned, looking over her shoulder seductively',
    'leaning back on a luxury car hood with one leg up, smirking confidently',
    'posing next to a sleek convertible with hand on hip and playful smile',
    'sitting in the driver’s seat of a sports car with legs out, flipping hair',
    'walking away from a luxury SUV, looking back over shoulder seductively',
    'opening a car door while glancing at the camera with intensity',
    'posing next to a Rolls Royce with sunglasses and arms crossed, exuding confidence',
  ];

  const groupPoses = [
    'standing with backs turned, looking over shoulders at the viewer',
    'laughing together, one fixing the other’s top',
    'posing with matching tight tops and opposite skirts',
    'taking a cheeky selfie while bending slightly',
    'clinking drinks while one winks and the other bites her lip',
    // eslint-disable-next-line quotes
    "whispering while one adjusts her friend's skirt",
    'dancing in sync with playful hip bumps',
    'posing like models with exaggerated hourglass stances',
    // eslint-disable-next-line quotes
    "helping adjust each other's clothes while flirting",
    'laughing while posing in mirrored seductive stances',
    'showing off outfits while giving over-the-shoulder looks',
    'leaning against a luxury car together, one blowing a kiss and the other adjusting glasses',
    'posing with arms around each other beside a black SUV, laughing',
    'sitting on the hood of a convertible, showing off their outfits confidently',
    'walking side by side in heels, passing by a sports car, glancing at the viewer',
    'fixing each other’s hair in the reflection of a luxury car window',
  ];

  const locations = [
    'on a vibrant city street',
    'in a sunny park with flowers',
    'on a rooftop patio at golden hour',
    'by a graffiti wall in an urban alley',
    'on outdoor steps in front of a café',
    'in a vintage-looking courtyard',
    'under soft dappled tree light',
    'next to a food truck on a warm day',
    'in front of a luxury sports car in a private driveway',
    'by a sleek black SUV in an upscale neighborhood',
    'near a parked Rolls Royce in a valet zone',
    'beside a Lamborghini on a sunlit boulevard',
    'on a quiet palm-lined street with a luxury car behind her',
    'next to a shiny convertible at a beachside parking lot',
  ];

  const colors = [
    'black',
    'white',
    'red',
    'dark red',
    'burgundy',
    'pink',
    'hot pink',
    'baby pink',
    'fuchsia',
    'rose gold',
    'purple',
    'lavender',
    'deep violet',
    'midnight blue',
    'teal',
    'turquoise',
    'emerald green',
    'lime green',
    'gold',
    'silver',
    'metallic',
    'denim blue',
  ];

  const outfits = [
    'in ultra-short [bottomColor] denim shorts and a tight [topColor] crop top showing underboob',
    'wearing a plunging [topColor] tank top with [bottomColor] mini skirt that hugs every curve',
    'in a tied-up [topColor] halter top revealing cleavage and micro [bottomColor] shorts',
    'wearing a strapless [topColor] tube top and low-rise [bottomColor] ripped jeans',
    'in a [topColor] crop top that barely contains her curves and a thigh-slit [bottomColor] skirt',
    'wearing a see-through [topColor] mesh tank over a bikini bra and [bottomColor] daisy dukes',
    'in a side-tied [topColor] wrap top with underboob and tight [bottomColor] ruched mini skirt',
    'in a tied [topColor] scarf top revealing lots of skin and a low-cut [bottomColor] mini skirt',
    'wearing an off-shoulder [topColor] blouse and unbuttoned [bottomColor] shorts',
    'in a [topColor] lace top under a half-open [bottomColor] jacket with short shorts',
  ];

  const moods = [
    'overtly sexy and confident',
    'bold, flirtatious, and powerful',
    'seductive and playful without shame',
    'hot, curvy, and carefree',
    'radiating body pride and self-love',
    'innocent expression with sexy outfit',
  ];

  const lighting = [
    'soft golden hour glow',
    'sunlight filtering through trees',
    'reflected light on glowing skin',
    'streetlight casting warm shadows',
    'late afternoon sun kissing curves',
    'early morning light on full body',
  ];

  const isGroup = false;

  const mainAction = isGroup ? random(groupPoses) : random(poses);
  const location = random(locations);
  const mood = random(moods);
  const light = random(lighting);

  const nationality1 = 'African American';
  let nationality2 = nationality1;
  while (nationality2 === nationality1) nationality2 = random(nationalities);

  const getRandomColor = () => random(colors);

  const getOutfit = () => {
    const outfitTemplate = random(outfits);
    const topColor = getRandomColor();
    let bottomColor = getRandomColor();
    while (bottomColor === topColor) bottomColor = getRandomColor();

    return outfitTemplate
      .replace('[topColor]', topColor)
      .replace('[bottomColor]', bottomColor);
  };

  let subject;
  let outfit;

  if (isGroup) {
    const outfit1 = getOutfit();
    const outfit2 = getOutfit();
    outfit = `${outfit1}. The other is ${outfit2}. Be sure they aren't wearing the same clothes and totally different.`;
    subject = `a ${nationality1} and a ${nationality2} extra plus-size woman (each approximately 160kg, curvy and clearly overweight)`;
  } else {
    outfit = getOutfit();
    subject = `a confident, beautiful ${nationality1} extra plus-size woman (approximately 160kg, curvy and clearly overweight)`;
  }

  const prompt = `Ultra-realistic cinematic photo of ${subject}. Extra big size ass. ${mainAction} ${location}, ${outfit}. Lighting is ${light}. Mood is ${mood}. Focus on glowing skin, bold curves, sensual body language, eye contact, and strong confident posture. Full body visible. Clothing must be casual and outdoors — no nudity, no lingerie, no beds. Woman must be clearly extra plus-size (approximately 120kg), seductive but clothed, sexy not NSFW. Important instruction to AI: the woman must be super extra plus-size fat`;

  return prompt;
};

module.exports = {
  generateDallePrompt,
};
