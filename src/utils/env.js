// Helper to get env variables with fallbacks
export const getEnvVar = (key, fallback = "") => {
  return import.meta.env[key] || fallback;
};

// Auth answers
export const AUTH_ANSWERS = {
  1: getEnvVar("VITE_AUTH_ANSWER_1", "Hrošíka"),
  2: getEnvVar("VITE_AUTH_ANSWER_2", "Tatarák"),
  3: getEnvVar("VITE_AUTH_ANSWER_3", "Mix tygra a vlka"),
  4: getEnvVar("VITE_AUTH_ANSWER_4", "Ovládání blesků"),
};

// Slideshow texts (dynamic count based on defined env vars)
export const getSlideTexts = () => {
  const texts = [];
  let i = 1;
  while (true) {
    const text = import.meta.env[`VITE_SLIDE_${i}_TEXT`];
    if (!text) break;
    texts.push(text);
    i++;
  }
  return texts.length > 0
    ? texts
    : [
        "Všechno nejlepší k narozeninám, Aničko! 🎉",
        "Tento rok bude úžasný! 🌟",
        "Připravila jsem pro tebe něco speciálního... 🎁",
        "Společné chvíle jsou ty nejcennější 💖",
        "A Barney s námi! 🐕",
        "Pojďme si užít úžasný výlet! ✨",
      ];
};

// Gift text
export const GIFT_TEXT = getEnvVar("VITE_GIFT_TEXT", "Tvůj dáreček je solo trip spolu a Barni");

// Destinations
export const getDestinations = () => {
  const destinations = [];
  let i = 1;
  while (true) {
    const name = import.meta.env[`VITE_DESTINATION_${i}_NAME`];
    if (!name) break;
    destinations.push({
      id: i,
      name,
      description: import.meta.env[`VITE_DESTINATION_${i}_DESC`] || "",
      image: import.meta.env[`VITE_DESTINATION_${i}_IMAGE`] || "",
      airbnbUrl: import.meta.env[`VITE_DESTINATION_${i}_AIRBNB_URL`] || "#",
    });
    i++;
  }
  return destinations.length > 0
    ? destinations
    : [
        {
          id: 1,
          name: "Romantická chalupa",
          description: "Útulná chaloupka uprostřed přírody",
          image: "/images/destination-1.jpg",
          airbnbUrl: "#",
        },
        {
          id: 2,
          name: "Lakeside Retreat",
          description: "Dům u jezera s výhledem na hory",
          image: "/images/destination-2.jpg",
          airbnbUrl: "#",
        },
        {
          id: 3,
          name: "Horská chata",
          description: "Chata s panoramatickým výhledem",
          image: "/images/destination-3.jpg",
          airbnbUrl: "#",
        },
      ];
};

// Audio
export const BIRTHDAY_SONG_URL = getEnvVar("VITE_BIRTHDAY_SONG_URL", "/audio/happy-birthday.mp3");

// Discord webhook
export const DISCORD_WEBHOOK_URL = getEnvVar("VITE_DISCORD_WEBHOOK_URL", "");

// AuthFlow - Initial Screen
export const AUTH_INITIAL_EMOJI = getEnvVar("VITE_AUTH_INITIAL_EMOJI", "👸");
export const AUTH_INITIAL_QUESTION = getEnvVar("VITE_AUTH_INITIAL_QUESTION", "Jsi Anička?");
export const AUTH_BUTTON_NO = getEnvVar("VITE_AUTH_BUTTON_NO", "Ne");
export const AUTH_BUTTON_YES = getEnvVar("VITE_AUTH_BUTTON_YES", "Ano");

// AuthFlow - Questions
export const AUTH_QUESTION_LABEL = getEnvVar("VITE_AUTH_QUESTION_LABEL", "Otázka");

// Get all questions from environment
export const getAuthQuestions = () => {
  const questions = [];
  let i = 1;
  while (true) {
    const text = import.meta.env[`VITE_AUTH_Q${i}_TEXT`];
    if (!text) break;

    questions.push({
      id: i,
      question: text,
      options: [
        import.meta.env[`VITE_AUTH_Q${i}_OPT1`] || "",
        import.meta.env[`VITE_AUTH_Q${i}_OPT2`] || "",
        import.meta.env[`VITE_AUTH_Q${i}_OPT3`] || "",
        import.meta.env[`VITE_AUTH_Q${i}_OPT4`] || "",
      ].filter(opt => opt !== ""),
    });
    i++;
  }

  // Fallback to default questions if none configured
  if (questions.length === 0) {
    return [
      {
        id: 1,
        question: "Jakou hračku dostal Barney k Vánocům 2025?",
        options: ["Sloníka", "Hrošíka", "Pejska", "Žirafu"],
      },
      {
        id: 2,
        question: "Jaký předkrm si spolu objednáváme v hospodě?",
        options: ["Cibulové kroužky", "Salát", "Tatarák", "Křídla"],
      },
      {
        id: 3,
        question: "Do jakého zvířete se shape-shiftuje Tamlin?",
        options: ["Mix draka a netopýra", "Mix tygra a vlka", "Mix jelena a hrocha", "Mix orla a plameňáka"],
      },
      {
        id: 4,
        question: "Jaký byl Violetin první signet?",
        options: ["Ovládání ohně", "Ovládání mlhy", "Ovládání blesků", "Ovládání mraků"],
      },
    ];
  }

  return questions;
};

// AuthFlow - Hacker Animation
export const AUTH_HACKER_LINES = [
  getEnvVar("VITE_AUTH_HACKER_LINE1", "> ACCESS GRANTED"),
  getEnvVar("VITE_AUTH_HACKER_LINE2", "> LOADING BIRTHDAY SURPRISE..."),
  getEnvVar("VITE_AUTH_HACKER_LINE3", "> AUTHENTICATION: ✓ VERIFIED"),
  getEnvVar("VITE_AUTH_HACKER_LINE4", "> WELCOME, ANIČKA! 🎉"),
];

// FuckYouPage - Error Messages
export const getErrorMessages = () => {
  const messages = [];
  let i = 1;
  while (true) {
    const emoji = import.meta.env[`VITE_ERROR_MSG${i}_EMOJI`];
    const text = import.meta.env[`VITE_ERROR_MSG${i}_TEXT`];
    if (!emoji || !text) break;

    messages.push({ emoji, text });
    i++;
  }

  // Fallback to default messages if none configured
  if (messages.length === 0) {
    return [
      { emoji: "🙅‍♀️", text: "Ou nou!" },
      { emoji: "🚫", text: "To není správně!" },
      { emoji: "🎭", text: "Nice try, ale ne!" },
      { emoji: "💔", text: "Bohužel, tohle není pro tebe!" },
    ];
  }

  return messages;
};

export const ERROR_PAGE_MESSAGE = getEnvVar("VITE_ERROR_PAGE_MESSAGE", "Tato stránka je pouze pro Aničku! 🎂");
export const ERROR_RETRY_BUTTON = getEnvVar("VITE_ERROR_RETRY_BUTTON", "Zkusit znovu");

// GiftSection
export const GIFT_SUBTITLE = getEnvVar("VITE_GIFT_SUBTITLE", "Vyber si místo, kam se chceš vydat!");
export const GIFT_DATE_TITLE = getEnvVar("VITE_GIFT_DATE_TITLE", "Moje volné víkendy 📅");
export const GIFT_OPEN_CALENDAR = getEnvVar("VITE_GIFT_OPEN_CALENDAR", "Otevřít kalendář");
export const GIFT_SELECTED_DATE_LABEL = getEnvVar("VITE_GIFT_SELECTED_DATE_LABEL", "Vybraný termín:");
export const GIFT_CANCEL_BUTTON = getEnvVar("VITE_GIFT_CANCEL_BUTTON", "Zrušit");
export const GIFT_CONFIRM_BUTTON = getEnvVar("VITE_GIFT_CONFIRM_BUTTON", "Potvrdit termín");

// Slideshow
export const SLIDESHOW_REVEAL_BUTTON = getEnvVar("VITE_SLIDESHOW_REVEAL_BUTTON", "Ukaž dáreček 🎁");

// Calendar - Weekdays
export const CALENDAR_WEEKDAYS = [
  getEnvVar("VITE_CALENDAR_DAY_SUN", "Ne"),
  getEnvVar("VITE_CALENDAR_DAY_MON", "Po"),
  getEnvVar("VITE_CALENDAR_DAY_TUE", "Út"),
  getEnvVar("VITE_CALENDAR_DAY_WED", "St"),
  getEnvVar("VITE_CALENDAR_DAY_THU", "Čt"),
  getEnvVar("VITE_CALENDAR_DAY_FRI", "Pá"),
  getEnvVar("VITE_CALENDAR_DAY_SAT", "So"),
];
