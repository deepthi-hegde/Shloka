const shlokas = require('../data/shlokas.json');

// Question templates for different difficulty levels
const questionTemplates = {
  simple: [
    {
      type: 'multiple_choice',
      template: (s) => ({
        question: `When should we chant "${s.name}"?`,
        options: generateOccasionOptions(s.occasion),
        answer: s.occasion,
        shloka: s.name
      })
    },
    {
      type: 'true_false',
      template: (s) => {
        const isTrue = Math.random() > 0.5;
        const wrongOccasion = getRandomOccasion(s.occasion);
        return {
          question: isTrue
            ? `True or False: "${s.name}" is chanted ${s.occasion.toLowerCase()}.`
            : `True or False: "${s.name}" is chanted ${wrongOccasion.toLowerCase()}.`,
          options: ['True', 'False'],
          answer: isTrue ? 'True' : 'False',
          shloka: s.name
        };
      }
    },
    {
      type: 'multiple_choice',
      template: (s) => {
        if (s.deepMeaning && s.deepMeaning.blessing) {
          return {
            question: `What blessing do we ask for in "${s.name}"?`,
            options: generateBlessingOptionsSimple(s.deepMeaning.blessing),
            answer: s.deepMeaning.blessing,
            shloka: s.name
          };
        }
        return {
          question: `Which of these is mentioned in "${s.name}"?`,
          options: generateKeywordOptions(s.keywords),
          answer: s.keywords[0],
          shloka: s.name
        };
      }
    },
    {
      type: 'multiple_choice',
      template: (s) => {
        // Only ask deity question if deity name is NOT in shloka name
        if (!shlokaNameContainsDeity(s.name, s.deity)) {
          return {
            question: `Which deity do we pray to in "${s.name}"?`,
            options: generateDeityOptions(s.deity),
            answer: s.deity,
            shloka: s.name
          };
        }
        // Fallback to occasion question
        return {
          question: `"${s.name}" is a prayer for what?`,
          options: generatePurposeOptions(s),
          answer: getPurpose(s),
          shloka: s.name
        };
      }
    }
  ],

  intermediate: [
    {
      type: 'multiple_choice',
      template: (s) => {
        if (s.deepMeaning && s.deepMeaning.symbolism) {
          return {
            question: `What does "${s.name}" teach us about?`,
            options: generateSymbolismOptions(s.deepMeaning.symbolism),
            answer: getShortSymbolism(s.deepMeaning.symbolism),
            shloka: s.name
          };
        }
        return {
          question: `What is the main message of "${s.name}"?`,
          options: generateMeaningOptions(s),
          answer: getMeaningSummary(s),
          shloka: s.name
        };
      }
    },
    {
      type: 'multiple_choice',
      template: (s) => {
        if (s.trivia) {
          return {
            question: `Which of these facts about "${s.name}" is true?`,
            options: generateTriviaOptions(s.trivia),
            answer: s.trivia,
            shloka: s.name
          };
        }
        return {
          question: `What virtue or quality is praised in "${s.name}"?`,
          options: generateQualityOptions(s),
          answer: getQualityFromMeaning(s),
          shloka: s.name
        };
      }
    },
    {
      type: 'fill_blank',
      template: (s) => {
        if (s.id === 3) { // Karagre Vasate
          return {
            question: `In "Karagre Vasate", which goddess resides at the fingertips?`,
            options: ['Lakshmi', 'Saraswati', 'Durga', 'Parvati'],
            answer: 'Lakshmi',
            shloka: s.name
          };
        }
        if (s.id === 5) { // Ganga Shloka
          return {
            question: `How many sacred rivers are mentioned in "Ganga Shloka"?`,
            options: ['Five', 'Seven', 'Nine', 'Three'],
            answer: 'Seven',
            shloka: s.name
          };
        }
        if (s.id === 17) { // Hanuman shloka
          return {
            question: `How many blessings does the "Buddhir Balam" shloka mention?`,
            options: ['Five', 'Six', 'Eight', 'Ten'],
            answer: 'Eight',
            shloka: s.name
          };
        }
        return {
          question: `The word "Guru" is made of two parts: "Gu" means darkness, "Ru" means _______.`,
          options: ['Remover', 'Light', 'Teacher', 'God'],
          answer: 'Remover',
          shloka: 'Guru Brahma'
        };
      }
    },
    {
      type: 'multiple_choice',
      template: (s) => {
        if (s.deepMeaning && s.deepMeaning.lesson) {
          return {
            question: `What life lesson does "${s.name}" teach?`,
            options: generateLessonOptions(s.deepMeaning.lesson),
            answer: s.deepMeaning.lesson,
            shloka: s.name
          };
        }
        return generateIntermediateSpecific(s);
      }
    }
  ],

  difficult: [
    {
      type: 'multiple_choice',
      template: (s) => {
        if (s.source) {
          return {
            question: `"${s.name}" comes from which scripture?`,
            options: generateSourceOptions(s.source),
            answer: s.source,
            shloka: s.name
          };
        }
        return generateDifficultQuestion(s);
      }
    },
    {
      type: 'multiple_choice',
      template: (s) => generateDifficultQuestion(s)
    },
    {
      type: 'multiple_choice',
      template: (s) => {
        // Deep meaning questions
        if (s.id === 2) { // Guru Brahma
          return {
            question: `In "Guru Brahma", why is the teacher compared to Brahma, Vishnu, and Shiva?`,
            options: [
              'Guru creates knowledge, preserves it, and destroys ignorance',
              'Guru is as powerful as all three gods',
              'Guru should be worshipped like gods',
              'Guru lives as long as gods'
            ],
            answer: 'Guru creates knowledge, preserves it, and destroys ignorance',
            shloka: s.name
          };
        }
        if (s.id === 3) { // Karagre
          return {
            question: `What does "Karagre Vasate" teach about achievement?`,
            options: [
              'Achievement comes through our own hands and honest actions',
              'We should always pray before working',
              'Only God can give us success',
              'Hands are the most sacred body part'
            ],
            answer: 'Achievement comes through our own hands and honest actions',
            shloka: s.name
          };
        }
        if (s.id === 6) { // Shubham Karoti
          return {
            question: `In "Shubham Karoti", what kind of "enemies" does the lamp destroy?`,
            options: [
              'Negative thoughts (inner enemies)',
              'Evil spirits',
              'External enemies',
              'Darkness in the room'
            ],
            answer: 'Negative thoughts (inner enemies)',
            shloka: s.name
          };
        }
        if (s.id === 13) { // Asato Ma
          return {
            question: `"Asato Ma Sadgamaya" mentions three journeys. Which is NOT one of them?`,
            options: [
              'From poverty to wealth',
              'From untruth to truth',
              'From darkness to light',
              'From death to immortality'
            ],
            answer: 'From poverty to wealth',
            shloka: s.name
          };
        }
        if (s.id === 11) { // Shanti Mantra
          return {
            question: `Why is "Shanti" (peace) chanted three times at the end of mantras?`,
            options: [
              'To cleanse body, mind, and soul',
              'Because three is a lucky number',
              'To honor three gods',
              'It sounds more musical'
            ],
            answer: 'To cleanse body, mind, and soul',
            shloka: s.name
          };
        }
        return generateDifficultQuestion(s);
      }
    }
  ]
};

// Helper: Check if deity name appears in shloka name
function shlokaNameContainsDeity(name, deity) {
  const nameLower = name.toLowerCase();
  const deityLower = deity.toLowerCase();

  // Check for common deity names
  const deityNames = ['vishnu', 'shiva', 'ganesha', 'hanuman', 'rama', 'krishna', 'lakshmi', 'saraswati', 'durga', 'devi'];
  for (const d of deityNames) {
    if (nameLower.includes(d) && deityLower.includes(d)) {
      return true;
    }
  }
  return false;
}

// Generate difficult questions based on shloka content
function generateDifficultQuestion(s) {
  const difficultQuestions = {
    1: {
      question: `In "Vakratunda Mahakaya", what does the curved trunk symbolize?`,
      options: [
        'The cosmic sound Om and wisdom to navigate complex situations',
        'Ganesha\'s love for sweets',
        'The shape of the moon',
        'A snake wrapped around'
      ],
      answer: 'The cosmic sound Om and wisdom to navigate complex situations'
    },
    4: {
      question: `Why do we ask Mother Earth for forgiveness in "Samudra Vasane"?`,
      options: [
        'For stepping on her with our feet',
        'For polluting the environment',
        'For not praying daily',
        'For eating her plants'
      ],
      answer: 'For stepping on her with our feet'
    },
    7: {
      question: `In the story behind "Annapurna Shloka", why did Shiva beg for food from Annapurna?`,
      options: [
        'To teach that even gods depend on food',
        'Because he was very hungry',
        'To test Annapurna\'s cooking',
        'Because Parvati asked him to'
      ],
      answer: 'To teach that even gods depend on food'
    },
    8: {
      question: `According to "Aham Vaishvanaro", how many types of food does God help us digest?`,
      options: ['Four', 'Three', 'Five', 'Seven'],
      answer: 'Four'
    },
    9: {
      question: `"Brahmarpanam" is one of the most philosophical shlokas. What does it teach?`,
      options: [
        'Everything is Brahman - the food, eater, eating, and digestion',
        'We should only eat vegetarian food',
        'Brahma created all food',
        'Food should be offered to Brahma first'
      ],
      answer: 'Everything is Brahman - the food, eater, eating, and digestion'
    },
    10: {
      question: `In "Rama Skandham", who is "Vrikodara" (wolf-bellied)?`,
      options: ['Bhima', 'Hanuman', 'Garuda', 'Skanda'],
      answer: 'Bhima'
    },
    14: {
      question: `According to "Rama Taraka Mantra", chanting "Rama" three times equals what?`,
      options: [
        'Chanting 1000 names of Vishnu',
        'Visiting a temple',
        'Reading the entire Ramayana',
        'Doing 100 good deeds'
      ],
      answer: 'Chanting 1000 names of Vishnu'
    },
    15: {
      question: `What makes "Sarve Bhavantu Sukhinah" special compared to other prayers?`,
      options: [
        'It wishes happiness for ALL beings, not just self or family',
        'It is the longest shloka',
        'It was written by Valmiki',
        'It can only be chanted at temples'
      ],
      answer: 'It wishes happiness for ALL beings, not just self or family'
    },
    18: {
      question: `In "Shantakaram", what does "padma-naabham" (lotus-naveled) refer to?`,
      options: [
        'Brahma emerged from a lotus at Vishnu\'s navel',
        'Vishnu loves lotus flowers',
        'Vishnu\'s navel is shaped like a lotus',
        'Lakshmi sits on a lotus'
      ],
      answer: 'Brahma emerged from a lotus at Vishnu\'s navel'
    },
    19: {
      question: `In which direction do we walk during Pradakshina?`,
      options: ['Clockwise', 'Counter-clockwise', 'Any direction', 'North to South'],
      answer: 'Clockwise'
    },
    20: {
      question: `What psychological wisdom does "Papoham" teach?`,
      options: [
        'Accepting our flaws is the first step to transformation',
        'We should feel guilty forever',
        'Only sinners should pray',
        'God punishes all sinners'
      ],
      answer: 'Accepting our flaws is the first step to transformation'
    }
  };

  if (difficultQuestions[s.id]) {
    return { ...difficultQuestions[s.id], shloka: s.name };
  }

  // Fallback
  return {
    question: `What is the deeper meaning of "${s.name}"?`,
    options: generateMeaningOptions(s),
    answer: getMeaningSummary(s),
    shloka: s.name
  };
}

function generateIntermediateSpecific(s) {
  const questions = {
    1: {
      question: `What does "Vighnaharta" mean - a name for Ganesha from the Vakratunda shloka's context?`,
      options: ['Remover of obstacles', 'Big-bellied one', 'Son of Shiva', 'Elephant god'],
      answer: 'Remover of obstacles'
    },
    5: {
      question: `The rivers in "Ganga Shloka" are called "Sapta Sindhus". What does this mean?`,
      options: ['Seven sacred rivers', 'Holy waters', 'Divine streams', 'Purifying rivers'],
      answer: 'Seven sacred rivers'
    },
    10: {
      question: `Who is "Vinateya" mentioned in "Rama Skandham"?`,
      options: ['Garuda - the divine eagle', 'Hanuman', 'A sage', 'Vishnu'],
      answer: 'Garuda - the divine eagle'
    },
    12: {
      question: `"Tryambike" in the Devi Shloka means the goddess with how many eyes?`,
      options: ['Three', 'Two', 'Four', 'One'],
      answer: 'Three'
    },
    16: {
      question: `What does "Tvameva Mata" express about devotion?`,
      options: [
        'Complete dependence on the divine',
        'Respecting our parents',
        'Learning from teachers',
        'Loving our friends'
      ],
      answer: 'Complete dependence on the divine'
    }
  };

  if (questions[s.id]) {
    return { ...questions[s.id], shloka: s.name };
  }

  return {
    question: `What quality is celebrated in "${s.name}"?`,
    options: generateQualityOptions(s),
    answer: getQualityFromMeaning(s),
    shloka: s.name
  };
}

// Helper functions
const allDeities = ['Ganesha', 'Vishnu', 'Shiva', 'Lakshmi', 'Saraswati', 'Hanuman', 'Rama', 'Krishna', 'Durga/Narayani/Parvati', 'Guru (Teacher)', 'Sacred Rivers', 'Bhumi Devi (Mother Earth)', 'Deepa (Sacred Lamp)', 'Annapurna (Parvati)', 'Brahman (Supreme Reality)'];

const allOccasions = ['Beginning of any task', 'Honoring teachers / Guru Purnima', 'Morning - upon waking', 'Morning - before stepping on ground', 'Before bathing', 'Lighting the lamp', 'Before eating', 'Bedtime', 'Beginning of study', 'Devi worship / Navaratri', 'Prayer for guidance / Meditation', 'Daily chanting', 'Blessing for all beings', 'Complete surrender to God', 'For strength and intelligence', 'Vishnu worship / Meditation', 'Circumambulation (Pradakshina)', 'Prayer for forgiveness / Complete surrender'];

function getRandomOccasion(exclude) {
  const others = allOccasions.filter(o => o !== exclude);
  return others[Math.floor(Math.random() * others.length)];
}

function generateDeityOptions(correct) {
  const options = [correct];
  const others = allDeities.filter(d => d !== correct);
  while (options.length < 4) {
    const random = others[Math.floor(Math.random() * others.length)];
    if (!options.includes(random)) {
      options.push(random);
    }
  }
  return shuffleArray(options);
}

function generateOccasionOptions(correct) {
  const options = [correct];
  const others = allOccasions.filter(o => o !== correct);
  while (options.length < 4) {
    const random = others[Math.floor(Math.random() * others.length)];
    if (!options.includes(random)) {
      options.push(random);
    }
  }
  return shuffleArray(options);
}

function generateKeywordOptions(correctKeywords) {
  const correct = correctKeywords[0];
  const allKeywords = ['peace', 'money', 'sky', 'fire', 'moon', 'stars', 'birds', 'trees', 'ocean', 'flower', 'fruit', 'gold', 'silver', 'diamond'];
  const options = [correct];
  const others = allKeywords.filter(k => !correctKeywords.includes(k));
  while (options.length < 4) {
    const random = others[Math.floor(Math.random() * others.length)];
    if (!options.includes(random)) {
      options.push(random);
    }
  }
  return shuffleArray(options);
}

function getMeaningSummary(shloka) {
  const summaries = {
    1: 'Removing obstacles and achieving success',
    2: 'Respecting teachers as divine',
    3: 'Divine presence in our hands for action',
    4: 'Respecting and asking forgiveness from Mother Earth',
    5: 'Gratitude for sacred rivers and water',
    6: 'Power of light over darkness and negativity',
    7: 'Gratitude for food and seeking knowledge',
    8: 'God as the digestive fire within us',
    9: 'Everything is Brahman (Supreme Reality)',
    10: 'Protection from bad dreams',
    11: 'Peace, protection, and learning together',
    12: 'Seeking blessings from the Divine Mother',
    13: 'Journey from ignorance to enlightenment',
    14: 'Power of chanting God\'s name',
    15: 'Wishing happiness for all beings',
    16: 'God is everything to us',
    17: 'Gaining eight blessings from Hanuman',
    18: 'Describing and meditating on Vishnu\'s form',
    19: 'Washing away sins through circumambulation',
    20: 'Complete surrender and seeking refuge'
  };
  return summaries[shloka.id] || 'Spiritual wisdom';
}

function generateMeaningOptions(shloka) {
  const allMeanings = [
    'Removing obstacles and achieving success', 'Respecting teachers as divine',
    'Divine presence in our hands for action', 'Respecting Mother Earth',
    'Gratitude for sacred rivers', 'Power of light over darkness',
    'Gratitude for food', 'God as the digestive fire',
    'Everything is Brahman', 'Protection from bad dreams',
    'Peace and learning together', 'Seeking blessings from Divine Mother',
    'Journey from ignorance to enlightenment', 'Power of chanting God\'s name',
    'Wishing happiness for all', 'God is everything to us',
    'Gaining blessings from Hanuman', 'Meditating on Vishnu\'s form',
    'Washing away sins', 'Complete surrender'
  ];
  const correct = getMeaningSummary(shloka);
  const options = [correct];
  const others = allMeanings.filter(m => m !== correct);
  while (options.length < 4) {
    const random = others[Math.floor(Math.random() * others.length)];
    if (!options.includes(random)) {
      options.push(random);
    }
  }
  return shuffleArray(options);
}

function getPurpose(s) {
  const purposes = {
    1: 'Success and obstacle removal',
    2: 'Honoring teachers',
    3: 'Starting the day with gratitude',
    4: 'Respecting nature',
    5: 'Purifying water for bathing',
    6: 'Dispelling negativity with light',
    7: 'Blessing food with gratitude',
    8: 'Remembering God while eating',
    9: 'Spiritual offering of food',
    10: 'Peaceful sleep',
    11: 'Harmony in learning',
    12: 'Divine blessings',
    13: 'Spiritual guidance',
    14: 'Easy devotion through chanting',
    15: 'Universal welfare',
    16: 'Total surrender',
    17: 'Strength and wisdom',
    18: 'Meditation on Vishnu',
    19: 'Purification from sins',
    20: 'Seeking divine refuge'
  };
  return purposes[s.id] || 'Spiritual blessing';
}

function generatePurposeOptions(s) {
  const allPurposes = ['Success and obstacle removal', 'Honoring teachers', 'Starting the day with gratitude',
    'Respecting nature', 'Purifying water', 'Dispelling negativity', 'Blessing food', 'Peaceful sleep',
    'Harmony in learning', 'Divine blessings', 'Spiritual guidance', 'Universal welfare', 'Strength and wisdom'];
  const correct = getPurpose(s);
  const options = [correct];
  const others = allPurposes.filter(p => p !== correct);
  while (options.length < 4) {
    const random = others[Math.floor(Math.random() * others.length)];
    if (!options.includes(random)) {
      options.push(random);
    }
  }
  return shuffleArray(options);
}

function generateBlessingOptionsSimple(correct) {
  const allBlessings = [
    'Removal of obstacles and success in all endeavors',
    'Liberation from ignorance',
    'Prosperity and knowledge',
    'Forgiveness for walking on Mother Earth',
    'Purity through sacred waters',
    'Health, wealth, and removal of negative thoughts',
    'Knowledge and detachment',
    'Healthy digestion',
    'Spiritual awakening',
    'Peaceful sleep without nightmares',
    'Peace and successful learning',
    'Fulfillment of all wishes',
    'Truth, light, and immortality',
    'Merit of thousand names',
    'Happiness for all beings',
    'Complete divine protection',
    'Intelligence and fearlessness',
    'Freedom from worldly fears',
    'Removal of past sins',
    'Divine refuge'
  ];
  const options = [correct];
  const others = allBlessings.filter(b => b !== correct);
  while (options.length < 4) {
    const random = others[Math.floor(Math.random() * others.length)];
    if (!options.includes(random)) {
      options.push(random);
    }
  }
  return shuffleArray(options);
}

function getShortSymbolism(symbolism) {
  if (symbolism.length > 60) {
    return symbolism.substring(0, 57) + '...';
  }
  return symbolism;
}

function generateSymbolismOptions(correct) {
  const shortCorrect = getShortSymbolism(correct);
  const allSymbolisms = [
    'Light dispelling darkness of ignorance',
    'Divine energy in human actions',
    'Nature as a manifestation of God',
    'Food as sacred offering',
    'Teacher as the path to liberation',
    'Rivers as purifying forces',
    'Sound as cosmic vibration',
    'Surrender as the highest devotion'
  ];
  const options = [shortCorrect];
  while (options.length < 4) {
    const random = allSymbolisms[Math.floor(Math.random() * allSymbolisms.length)];
    if (!options.includes(random) && random !== shortCorrect) {
      options.push(random);
    }
  }
  return shuffleArray(options);
}

function generateTriviaOptions(correct) {
  const allTrivia = [
    'Very popular in Maharashtra during Ganesh Chaturthi',
    'Recited on Teacher\'s Day and Guru Purnima',
    'Also called Karadarshanam - looking at hands',
    'Also called Bhumi Vandana',
    'These are the Sapta Sindhus - seven sacred rivers',
    'Recited during Deepavali',
    'Annapurna temple in Varanasi is very famous',
    'From Chapter 15 of Bhagavad Gita',
    'Often chanted at the start of yoga classes',
    'Popular during Navaratri festival',
    'Also called Pavamana Mantra',
    'Shiva is said to constantly chant Rama',
    'One of the most universal Hindu prayers',
    'Hanuman is considered the 11th Rudra'
  ];
  const options = [correct];
  const others = allTrivia.filter(t => t !== correct);
  while (options.length < 4) {
    const random = others[Math.floor(Math.random() * others.length)];
    if (!options.includes(random)) {
      options.push(random);
    }
  }
  return shuffleArray(options);
}

function generateLessonOptions(correct) {
  const allLessons = [
    'Achievement comes through our own hands and honest actions',
    'Food is sacred and divine',
    'Eating is a sacred act',
    'Learning happens best in harmony and cooperation',
    'True spirituality includes wishing well for everyone',
    'When you have God, you have everything',
    'Light within removes negativity',
    'Teachers are divine guides'
  ];
  const options = [correct];
  const others = allLessons.filter(l => l !== correct);
  while (options.length < 4) {
    const random = others[Math.floor(Math.random() * others.length)];
    if (!options.includes(random)) {
      options.push(random);
    }
  }
  return shuffleArray(options);
}

function getQualityFromMeaning(shloka) {
  const qualities = {
    1: 'Divine radiance and obstacle removal',
    2: 'Supreme wisdom of the teacher',
    3: 'Divine energy in human hands',
    4: 'Nurturing nature of Mother Earth',
    5: 'Purity of sacred rivers',
    6: 'Power of light to bring auspiciousness',
    7: 'Abundance and nourishment',
    8: 'God\'s presence within all beings',
    9: 'Unity of all existence in Brahman',
    10: 'Protective power of divine beings',
    11: 'Harmony and peaceful learning',
    12: 'All-fulfilling nature of the Divine Mother',
    13: 'Guiding power toward truth',
    14: 'Transformative power of divine names',
    15: 'Universal compassion',
    16: 'All-encompassing divine love',
    17: 'Multiple blessings of strength and wisdom',
    18: 'Peaceful and protective nature of Vishnu',
    19: 'Purifying power of devotion',
    20: 'Merciful nature of the divine'
  };
  return qualities[shloka.id] || 'Divine qualities';
}

function generateQualityOptions(shloka) {
  const allQualities = [
    'Divine radiance and obstacle removal', 'Supreme wisdom of the teacher',
    'Divine energy in human hands', 'Nurturing nature of Mother Earth',
    'Purity of sacred rivers', 'Power of light',
    'Abundance and nourishment', 'God\'s presence within all',
    'Unity of all existence', 'Protective power',
    'Harmony and peaceful learning', 'All-fulfilling divine nature',
    'Guiding power toward truth', 'Transformative power of names',
    'Universal compassion', 'All-encompassing love',
    'Blessings of strength and wisdom', 'Peaceful and protective nature',
    'Purifying power', 'Merciful divine nature'
  ];
  const correct = getQualityFromMeaning(shloka);
  const options = [correct];
  const others = allQualities.filter(q => q !== correct);
  while (options.length < 4) {
    const random = others[Math.floor(Math.random() * others.length)];
    if (!options.includes(random)) {
      options.push(random);
    }
  }
  return shuffleArray(options);
}

function generateSourceOptions(correct) {
  const sources = ['Bhagavad Gita', 'Vishnu Sahasranama', 'Isha Upanishad', 'Brihadaranyaka Upanishad (1.3.28)',
    'Rig Veda', 'Yajur Veda', 'Taittiriya, Katha, Mandukya Upanishads', 'Mudgala Purana', 'Vishnu Purana',
    'Bhagavad Gita (15.14)', 'Bhagavad Gita (4.24)', 'Vishnu Sahasranama (Phala Shruti)'];
  const options = [correct];
  const others = sources.filter(s => s !== correct);
  while (options.length < 4) {
    const random = others[Math.floor(Math.random() * others.length)];
    if (!options.includes(random)) {
      options.push(random);
    }
  }
  return shuffleArray(options);
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generate matching questions (shloka name ↔ meaning/deity/occasion)
function generateMatchingQuestions(selectedShlokas, difficulty) {
  const matchConfigs = [
    { type: 'name_meaning', question: 'Match each shloka with its meaning:', rightLabel: 'Meaning', getRight: s => getMeaningSummary(s) },
    { type: 'name_deity', question: 'Match each shloka with its deity:', rightLabel: 'Deity', getRight: s => s.deity },
    { type: 'name_occasion', question: 'Match each shloka with its occasion:', rightLabel: 'Occasion', getRight: s => s.occasion }
  ];

  const questions = [];

  for (const config of matchConfigs) {
    const shuffled = shuffleArray([...selectedShlokas]);
    // Try groups of 4, ensure unique right-side values
    for (let attempt = 0; attempt < 3; attempt++) {
      const group = shuffled.slice(attempt * 4, attempt * 4 + 4);
      if (group.length < 4) break;

      const pairs = group.map(s => ({ left: s.name, right: config.getRight(s) }));
      const rightValues = pairs.map(p => p.right);
      if (new Set(rightValues).size !== rightValues.length) continue;

      questions.push({
        type: 'matching',
        question: config.question,
        pairs: pairs,
        matchType: config.type,
        rightLabel: config.rightLabel,
        shloka: 'Multiple',
        difficulty: difficulty === 'simple' ? 'simple' : 'intermediate'
      });
      break;
    }
  }

  return questions;
}

// Generate audio recording questions (fill-in-blank + recite)
function generateAudioQuestions(selectedShlokas) {
  const questions = [];

  // Audio fill-in-the-blank: pick shlokas with sanskritParts
  const partsShlokas = selectedShlokas.filter(s => s.sanskritParts && s.sanskritParts.length >= 2);
  const shuffledParts = shuffleArray([...partsShlokas]);

  for (let i = 0; i < Math.min(2, shuffledParts.length); i++) {
    const s = shuffledParts[i];
    const blankIndex = Math.floor(Math.random() * s.sanskritParts.length);
    const correctPart = s.sanskritParts[blankIndex];
    const withBlank = s.sanskritParts.map((part, idx) =>
      idx === blankIndex ? '________' : part
    ).join(' ');

    questions.push({
      type: 'audio_fill',
      question: `Say the missing part of "${s.name}":`,
      sanskritWithBlank: withBlank,
      correctPart: correctPart,
      fullSanskrit: s.sanskrit,
      shloka: s.name,
      difficulty: 'intermediate'
    });
  }

  // Audio recite: ask to recite a shloka by deity/topic
  const reciteShlokas = shuffleArray([...selectedShlokas]).slice(0, 2);
  for (const s of reciteShlokas) {
    questions.push({
      type: 'audio_recite',
      question: `Recite a shloka about ${s.deity}`,
      hint: s.name,
      correctSanskrit: s.sanskrit,
      shloka: s.name,
      difficulty: 'difficult'
    });
  }

  return questions;
}

// Main quiz generation function
function generateQuiz(options = {}) {
  const {
    shlokaIds = null,
    difficulty = 'all',
    questionsPerShloka = 2,
    maxQuestions = 30
  } = options;

  let selectedShlokas = shlokas.slice(0, 20);
  if (shlokaIds) {
    selectedShlokas = selectedShlokas.filter(s => shlokaIds.includes(s.id));
  }

  const questions = [];

  let difficulties = [];
  if (difficulty === 'all') {
    difficulties = ['simple', 'intermediate', 'difficult'];
  } else {
    difficulties = [difficulty];
  }

  for (const shloka of selectedShlokas) {
    let count = 0;
    for (const diff of difficulties) {
      const templates = questionTemplates[diff];
      for (const template of templates) {
        if (count >= questionsPerShloka) break;
        try {
          const question = template.template(shloka);
          if (question && question.question) {
            questions.push({
              ...question,
              type: question.type || 'multiple_choice',
              difficulty: diff,
              id: questions.length + 1
            });
            count++;
          }
        } catch (e) {
          // Skip if template fails
        }
      }
    }
  }

  // Add matching questions
  const matchDiff = difficulty === 'all' ? 'intermediate' : difficulty;
  const matchingQs = generateMatchingQuestions(selectedShlokas, matchDiff);
  matchingQs.forEach(mq => {
    mq.id = questions.length + 1;
    questions.push(mq);
  });

  // Add audio questions
  const audioQs = generateAudioQuestions(selectedShlokas);
  audioQs.forEach(aq => {
    aq.id = questions.length + 1;
    questions.push(aq);
  });

  return shuffleArray(questions).slice(0, maxQuestions);
}

module.exports = { generateQuiz, shlokas };
