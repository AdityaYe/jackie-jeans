// Jackie Jeans Fit Quiz — Question Data

export const BRAND_OPTIONS = [
  { name: "Levi's", logo: "/brand-logos/levis-logo.svg" },
  { name: "Madewell", logo: "/brand-logos/madewell-logo.svg" },
  { name: "Gap", logo: "/brand-logos/gap-logo.svg" },
  { name: "H&M", logo: "/brand-logos/handm-logo.svg" },
  { name: "Zara", logo: "/brand-logos/zara-logo.svg" },
  { name: "Topshop", logo: "/brand-logos/topshop-logo.svg" },
  { name: "American Eagle", logo: "/brand-logos/americaneagle-logo.svg" },
  { name: "7 For All Mankind", logo: "/brand-logos/sevenforallmankind-logo.svg" },
  { name: "AG Jeans", logo: "/brand-logos/agjeans-logo.svg" },
  { name: "Citizens of Humanity", logo: "/brand-logos/citizensofhumanity-logo.png" },
  { name: "Frame", logo: "/brand-logos/frame-logo.svg" },
  { name: "Paige", logo: "/brand-logos/paige-logo.svg" },
  { name: "Good American", logo: "/brand-logos/goodamerican-logo.svg" },
  { name: "Reformation", logo: "/brand-logos/reformation-logo.svg" },
  { name: "Everlane", logo: "/brand-logos/everlane-logo.svg" },
  { name: "Lucky Brand", logo: "/brand-logos/luckybrand-logo.svg" },
];

export const BRANDS = BRAND_OPTIONS.map(brand => brand.name);

export const REDIRECT_URL = "https://jackie-jeans.vercel.app/";

export const MANUAL_STEP_GROUPS = [
  ["height", "weight"],
  ["waist", "hip"],
  ["waistFit", "rise", "thighFit"],
  ["brands", "brandSizes"],
  ["frustration"],
];

export const JEAN_SIZES = [
  "23", "24", "25", "26", "27", "28", "29", "30",
  "31", "32", "33", "34", "36", "38", "40",
  "XS", "S", "M", "L", "XL", "XXL",
  "0", "2", "4", "6", "8", "10", "12", "14", "16",
];

function heightOptions() {
  const heights = [];
  const inches = [
    [4, 10], [4, 11],
    [5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5],
    [5, 6], [5, 7], [5, 8], [5, 9], [5, 10], [5, 11],
    [6, 0], [6, 1], [6, 2],
  ];
  for (const [ft, inch] of inches) {
    heights.push(`${ft}'${inch}"`);
  }
  return heights;
}

function waistOptions() {
  const opts = [];
  for (let i = 24; i <= 52; i++) opts.push(`${i}"`);
  return opts;
}

function hipOptions() {
  const opts = [];
  for (let i = 32; i <= 60; i++) opts.push(`${i}"`);
  return opts;
}

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    key: "height",
    question: "What is your height?",
    voicePrompt: "Let's start! What's your height? For example, five foot four, or five six.",
    type: "dropdown",
    options: heightOptions(),
    required: true,
    hint: "This helps us get your inseam and length just right.",
  },
  {
    id: 2,
    key: "weight",
    question: "What is your weight?",
    voicePrompt: "What's your weight in pounds? You can say 'skip' if you'd prefer not to share - totally fine either way.",
    type: "number",
    unit: "lbs",
    required: false,
    skippable: true,
    skipLabel: "Skip - I'd rather not say",
    hint: "Optional. Helps us calibrate proportional fit.",
  },
  {
    id: 3,
    key: "waist",
    question: "What's your waist measurement?",
    voicePrompt: "What's your waist measurement at the narrowest point, in inches? Something like twenty-eight or thirty.",
    type: "dropdown",
    options: waistOptions(),
    required: true,
    hint: "Measure at your narrowest point - usually just above your belly button.",
  },
  {
    id: 4,
    key: "hip",
    question: "What's your hip measurement?",
    voicePrompt: "And your hips - the fullest part? For example, thirty-eight or forty.",
    type: "dropdown",
    options: hipOptions(),
    required: true,
    hint: "Measure at the fullest point of your hips and seat.",
  },
  {
    id: 5,
    key: "waistFit",
    question: "How do you like jeans to fit at the waist?",
    voicePrompt: "How do you like your jeans to fit at the waist? Snug, slightly relaxed, or relaxed?",
    type: "single-select",
    options: ["Snug", "Slightly relaxed", "Relaxed"],
    required: true,
    hint: "Same measurements, very different feel.",
  },
  {
    id: 6,
    key: "rise",
    question: "Where should the waistband sit?",
    voicePrompt: "Where do you like the waistband to sit? High rise, mid rise, or low rise?",
    type: "single-select",
    options: ["High rise", "Mid rise", "Low rise"],
    required: true,
    hint: "This narrows the style to your preference.",
  },
  {
    id: 7,
    key: "thighFit",
    question: "How should jeans fit through the thighs?",
    voicePrompt: "And through the thighs - fitted, relaxed, or loose?",
    type: "single-select",
    options: ["Fitted", "Relaxed", "Loose"],
    required: true,
    hint: "The second most common fit issue after waist.",
  },
  {
    id: 8,
    key: "brands",
    question: "Which denim brands have you bought before?",
    voicePrompt: "Which denim brands have you bought before? You can name a few - like Levi's, Madewell, or Gap. Say 'done' when you're finished.",
    type: "multi-select",
    options: BRANDS,
    required: false,
    hint: "Select all that apply. Helps us calibrate against real sizing you know.",
  },
  {
    id: 9,
    key: "brandSizes",
    question: "What size did you buy in each of those brands?",
    voicePrompt: "Great. For each brand you mentioned, what size did you usually buy?",
    type: "brand-sizes",
    required: false,
    dependsOn: "brands",
    hint: "Just your best guess is fine.",
  },
  {
    id: 10,
    key: "frustration",
    question: "What's your biggest fit frustration when buying jeans?",
    voicePrompt: "Last one! What's your biggest fit frustration when buying jeans? Waist gap, hip tightness, wrong length, thigh fit, rise issues, or something else?",
    type: "single-select",
    options: [
      "Waist gap at the back",
      "Hip tightness",
      "Wrong length",
      "Thigh fit",
      "Rise doesn't work",
      "Other",
    ],
    required: true,
    hint: "This personalises your recommendation explanation.",
  },
];

export const QUESTION_BY_KEY = Object.fromEntries(QUIZ_QUESTIONS.map(question => [question.key, question]));
export const TOTAL_QUESTIONS = QUIZ_QUESTIONS.length;
