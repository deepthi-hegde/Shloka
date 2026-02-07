const shlokas = require('../data/shlokas-level2.json');

// Question templates for Level 2 shlokas (deeper, longer shlokas)
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
            ? `True or False: "${s.name}" is chanted during ${s.occasion.toLowerCase()}.`
            : `True or False: "${s.name}" is chanted during ${wrongOccasion.toLowerCase()}.`,
          options: ['True', 'False'],
          answer: isTrue ? 'True' : 'False',
          shloka: s.name
        };
      }
    },
    {
      type: 'multiple_choice',
      template: (s) => {
        if (!shlokaNameContainsDeity(s.name, s.deity)) {
          return {
            question: `Which deity is worshipped in "${s.name}"?`,
            options: generateDeityOptions(s.deity),
            answer: s.deity,
            shloka: s.name
          };
        }
        return {
          question: `"${s.name}" is a prayer for what?`,
          options: generatePurposeOptions(s),
          answer: getPurpose(s),
          shloka: s.name
        };
      }
    },
    {
      type: 'multiple_choice',
      template: (s) => {
        if (s.verses) {
          return {
            question: `How many verses does "${s.name}" have?`,
            options: generateVerseCountOptions(s.verses),
            answer: s.verses.toString(),
            shloka: s.name
          };
        }
        return {
          question: `Which of these keywords is related to "${s.name}"?`,
          options: generateKeywordOptions(s.keywords),
          answer: s.keywords[0],
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
            question: `What is the symbolism behind "${s.name}"?`,
            options: generateSymbolismOptions(s.deepMeaning.symbolism),
            answer: getShortText(s.deepMeaning.symbolism),
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
            question: `Which fact about "${s.name}" is true?`,
            options: generateTriviaOptions(s.trivia),
            answer: s.trivia,
            shloka: s.name
          };
        }
        return {
          question: `What is special about "${s.name}"?`,
          options: generateMeaningOptions(s),
          answer: getMeaningSummary(s),
          shloka: s.name
        };
      }
    },
    {
      type: 'multiple_choice',
      template: (s) => generateIntermediateSpecific(s)
    },
    {
      type: 'multiple_choice',
      template: (s) => generateIntermediateSpecific2(s)
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
      template: (s) => generateDifficultQuestion2(s)
    }
  ]
};

// ---- Specific question banks for Level 2 shlokas ----

function generateIntermediateSpecific(s) {
  const questions = {
    1: {
      question: `What does "ajam" mean in Ganesha Stavah?`,
      options: ['Unborn', 'Powerful', 'Wise', 'Beautiful'],
      answer: 'Unborn'
    },
    2: {
      question: `What musical instrument does Saraswati hold in the Saraswati Vandana?`,
      options: ['Veena', 'Flute', 'Mridangam', 'Sitar'],
      answer: 'Veena'
    },
    3: {
      question: `In Mantra Pushpam, what is called the "flower of water"?`,
      options: ['The Moon (Chandrama)', 'The Lotus', 'Rain', 'A River'],
      answer: 'The Moon (Chandrama)'
    },
    4: {
      question: `How many deities are invoked for "Svasti" (blessings) in the Shanti Mantra?`,
      options: ['Four', 'Three', 'Five', 'Seven'],
      answer: 'Four'
    },
    5: {
      question: `What vehicle (vahana) does Mahalakshmi ride according to the Ashtakam?`,
      options: ['Garuda', 'Lion', 'Owl', 'Swan'],
      answer: 'Garuda'
    }
  };

  if (questions[s.id]) {
    return { ...questions[s.id], shloka: s.name };
  }
  return {
    question: `What is the main teaching of "${s.name}"?`,
    options: generateMeaningOptions(s),
    answer: getMeaningSummary(s),
    shloka: s.name
  };
}

function generateIntermediateSpecific2(s) {
  const questions = {
    1: {
      question: `What philosophy does the Ganesha Stavah follow?`,
      options: ['Advaita Vedanta', 'Dvaita Vedanta', 'Yoga Philosophy', 'Samkhya'],
      answer: 'Advaita Vedanta'
    },
    2: {
      question: `Which three gods worship Saraswati according to the Saraswati Vandana?`,
      options: [
        'Brahma, Vishnu (Achyuta), and Shiva (Shankara)',
        'Indra, Agni, and Vayu',
        'Rama, Krishna, and Hanuman',
        'Surya, Chandra, and Agni'
      ],
      answer: 'Brahma, Vishnu (Achyuta), and Shiva (Shankara)'
    },
    3: {
      question: `What refrain ends each section of Mantra Pushpam?`,
      options: [
        'Āyatanavān bhavati (one becomes established)',
        'Om Shanti Shanti Shanti',
        'Svaha (so be it)',
        'Namah (I bow)'
      ],
      answer: 'Āyatanavān bhavati (one becomes established)'
    },
    4: {
      question: `Who is "Tarkshya" mentioned in the Shanti Mantra?`,
      options: ['Garuda (the divine eagle)', 'A sage', 'The sun', 'An ancestor'],
      answer: 'Garuda (the divine eagle)'
    },
    5: {
      question: `Which demon did Mahalakshmi terrify according to the Ashtakam?`,
      options: ['Kolasura', 'Mahishasura', 'Ravana', 'Hiranyakashipu'],
      answer: 'Kolasura'
    }
  };

  if (questions[s.id]) {
    return { ...questions[s.id], shloka: s.name };
  }
  return {
    question: `What quality is celebrated in "${s.name}"?`,
    options: generateMeaningOptions(s),
    answer: getMeaningSummary(s),
    shloka: s.name
  };
}

function generateDifficultQuestion(s) {
  const questions = {
    1: {
      question: `How does the Ganesha Stavah describe Ganesha differently from typical descriptions?`,
      options: [
        'As the formless Supreme Reality (Parabrahman), not a physical deity',
        'As a child playing with toys',
        'As a warrior fighting demons',
        'As a king ruling a kingdom'
      ],
      answer: 'As the formless Supreme Reality (Parabrahman), not a physical deity'
    },
    2: {
      question: `What does "nisḥśheṣa jāḍyāpahā" mean in the Saraswati Vandana?`,
      options: [
        'Complete remover of all ignorance and dullness',
        'Giver of all wealth and prosperity',
        'Destroyer of all enemies',
        'Creator of all knowledge'
      ],
      answer: 'Complete remover of all ignorance and dullness'
    },
    3: {
      question: `Why is Mantra Pushpam called "Mantra Pushpam" (flower of mantras)?`,
      options: [
        'The mantras themselves become flowers offered to God',
        'It describes beautiful flowers in gardens',
        'It is chanted while holding flowers',
        'It was written on flower petals'
      ],
      answer: 'The mantras themselves become flowers offered to God'
    },
    4: {
      question: `What does "Vruddha-Shravah" mean — an epithet of Indra in the Shanti Mantra?`,
      options: ['Of great fame', 'Very old', 'Very loud', 'Of great strength'],
      answer: 'Of great fame'
    },
    5: {
      question: `According to the Mahalakshmi Ashtakam's phala shruti, what happens if you read it thrice daily?`,
      options: [
        'Great enemies are destroyed (mahashatru vinashanam)',
        'Great wealth arrives',
        'All diseases are cured',
        'You gain immortality'
      ],
      answer: 'Great enemies are destroyed (mahashatru vinashanam)'
    }
  };

  if (questions[s.id]) {
    return { ...questions[s.id], shloka: s.name };
  }
  return {
    question: `What is the deeper meaning of "${s.name}"?`,
    options: generateMeaningOptions(s),
    answer: getMeaningSummary(s),
    shloka: s.name
  };
}

function generateDifficultQuestion2(s) {
  const questions = {
    1: {
      question: `What does "advaitapUrNam" mean in the Ganesha Stavah?`,
      options: ['Full of non-dual bliss', 'Full of power', 'Full of knowledge', 'Full of beauty'],
      answer: 'Full of non-dual bliss'
    },
    2: {
      question: `What does "kundendu" refer to in the Saraswati Vandana?`,
      options: [
        'Jasmine flower and moon',
        'Two types of silk',
        'Two sacred rivers',
        'Gold and silver'
      ],
      answer: 'Jasmine flower and moon'
    },
    3: {
      question: `How many cosmic connections does Mantra Pushpam trace for water?`,
      options: ['Seven (fire, wind, sun, moon, stars, rain, year)', 'Three', 'Five', 'Ten'],
      answer: 'Seven (fire, wind, sun, moon, stars, rain, year)'
    },
    4: {
      question: `Who is Brihaspati, one of the deities invoked in the Shanti Mantra?`,
      options: ['Guru (teacher) of the gods', 'King of demons', 'God of fire', 'God of rain'],
      answer: 'Guru (teacher) of the gods'
    },
    5: {
      question: `Who is said to have composed the Mahalakshmi Ashtakam?`,
      options: ['Indra', 'Vyasa', 'Valmiki', 'Adi Shankaracharya'],
      answer: 'Indra'
    }
  };

  if (questions[s.id]) {
    return { ...questions[s.id], shloka: s.name };
  }
  return {
    question: `What is the source of "${s.name}"?`,
    options: generateSourceOptions(s.source || 'Unknown'),
    answer: s.source || 'Unknown',
    shloka: s.name
  };
}

// ---- Helper functions ----

function shlokaNameContainsDeity(name, deity) {
  const nameLower = name.toLowerCase();
  const deityLower = deity.toLowerCase();
  const deityNames = ['vishnu', 'shiva', 'ganesha', 'hanuman', 'rama', 'krishna', 'lakshmi', 'saraswati', 'durga', 'devi'];
  for (const d of deityNames) {
    if (nameLower.includes(d) && deityLower.includes(d)) return true;
  }
  return false;
}

const allDeities = [
  'Ganesha', 'Saraswati', 'Vedic Universal Prayer', 'Mahalakshmi',
  'Indra, Pusha, Tarkshya, Brihaspati', 'Vishnu', 'Shiva', 'Hanuman',
  'Rama', 'Krishna', 'Durga', 'Brahman (Supreme Reality)'
];

const allOccasions = [
  'Ganesha worship / Beginning of study',
  'Before study / Saraswati Puja / Vasant Panchami',
  'End of puja / Offering of mantras to deity',
  'Beginning and end of Vedic study / Puja',
  'Lakshmi Puja / Diwali / Friday worship',
  'Morning prayer', 'Evening prayer', 'Before eating',
  'Before bathing', 'Lighting the lamp'
];

function getRandomOccasion(exclude) {
  const others = allOccasions.filter(o => o !== exclude);
  return others[Math.floor(Math.random() * others.length)];
}

function generateDeityOptions(correct) {
  const options = [correct];
  const others = allDeities.filter(d => d !== correct);
  while (options.length < 4) {
    const random = others[Math.floor(Math.random() * others.length)];
    if (!options.includes(random)) options.push(random);
  }
  return shuffleArray(options);
}

function generateOccasionOptions(correct) {
  const options = [correct];
  const others = allOccasions.filter(o => o !== correct);
  while (options.length < 4) {
    const random = others[Math.floor(Math.random() * others.length)];
    if (!options.includes(random)) options.push(random);
  }
  return shuffleArray(options);
}

function generateVerseCountOptions(correct) {
  const counts = ['3', '5', '8', '10', '4', '6', '12', '7'];
  const options = [correct.toString()];
  const others = counts.filter(c => c !== correct.toString());
  while (options.length < 4) {
    const random = others[Math.floor(Math.random() * others.length)];
    if (!options.includes(random)) options.push(random);
  }
  return shuffleArray(options);
}

function generateKeywordOptions(correctKeywords) {
  const correct = correctKeywords[0];
  const allKeywords = [
    'peace', 'money', 'sky', 'fire', 'moon', 'stars', 'birds', 'trees',
    'ocean', 'flower', 'fruit', 'gold', 'silver', 'diamond', 'rivers',
    'weapons', 'dance', 'thunder', 'clouds', 'mountains'
  ];
  const options = [correct];
  const others = allKeywords.filter(k => !correctKeywords.includes(k));
  while (options.length < 4) {
    const random = others[Math.floor(Math.random() * others.length)];
    if (!options.includes(random)) options.push(random);
  }
  return shuffleArray(options);
}

function getMeaningSummary(shloka) {
  const summaries = {
    1: 'Ganesha as the formless Parabrahman',
    2: 'Saraswati removes all ignorance and dullness',
    3: 'Everything in nature is connected through water',
    4: 'Prayer for good hearing, seeing, and a full life',
    5: 'Mahalakshmi gives both worldly joy and liberation'
  };
  return summaries[shloka.id] || 'Spiritual wisdom';
}

function generateMeaningOptions(shloka) {
  const allMeanings = [
    'Ganesha as the formless Parabrahman',
    'Saraswati removes all ignorance and dullness',
    'Everything in nature is connected through water',
    'Prayer for good hearing, seeing, and a full life',
    'Mahalakshmi gives both worldly joy and liberation',
    'Removing obstacles and achieving success',
    'Power of light over darkness',
    'Complete surrender to God'
  ];
  const correct = getMeaningSummary(shloka);
  const options = [correct];
  const others = allMeanings.filter(m => m !== correct);
  while (options.length < 4) {
    const random = others[Math.floor(Math.random() * others.length)];
    if (!options.includes(random)) options.push(random);
  }
  return shuffleArray(options);
}

function getPurpose(s) {
  const purposes = {
    1: 'Worshipping Ganesha as Supreme Reality',
    2: 'Seeking knowledge and removal of ignorance',
    3: 'Offering mantras as flowers to the deity',
    4: 'Peace and well-being through all senses',
    5: 'Seeking blessings of wealth and liberation'
  };
  return purposes[s.id] || 'Spiritual blessing';
}

function generatePurposeOptions(s) {
  const allPurposes = [
    'Worshipping Ganesha as Supreme Reality',
    'Seeking knowledge and removal of ignorance',
    'Offering mantras as flowers to the deity',
    'Peace and well-being through all senses',
    'Seeking blessings of wealth and liberation',
    'Honoring teachers', 'Blessing food with gratitude',
    'Protection from evil'
  ];
  const correct = getPurpose(s);
  const options = [correct];
  const others = allPurposes.filter(p => p !== correct);
  while (options.length < 4) {
    const random = others[Math.floor(Math.random() * others.length)];
    if (!options.includes(random)) options.push(random);
  }
  return shuffleArray(options);
}

function getShortText(text) {
  if (text.length > 80) return text.substring(0, 77) + '...';
  return text;
}

function generateSymbolismOptions(correct) {
  const shortCorrect = getShortText(correct);
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
    if (!options.includes(random) && random !== shortCorrect) options.push(random);
  }
  return shuffleArray(options);
}

function generateTriviaOptions(correct) {
  const allTrivia = [
    'This is an Advaita Vedanta hymn describing Ganesha as the formless Supreme Reality',
    'This shloka is recited across India before exams and at the start of educational events',
    'Mantra Pushpam is chanted at the end of all Vedic pujas while offering flowers',
    'This is one of the most widely used shanti mantras in Vedic recitations',
    'Ashtakam means eight verses and this is one of the most popular Lakshmi stotras',
    'This hymn was composed by Adi Shankaracharya',
    'This prayer is from the Rig Veda',
    'This stotra is attributed to the sage Vyasa'
  ];
  const options = [correct];
  const others = allTrivia.filter(t => t !== correct);
  while (options.length < 4) {
    const random = others[Math.floor(Math.random() * others.length)];
    if (!options.includes(random)) options.push(random);
  }
  return shuffleArray(options);
}

function generateSourceOptions(correct) {
  const sources = [
    'Ganpati Upanishad / Ganesha Stavam by Adi Shankaracharya',
    'Taittiriya Aranyaka (Yajur Veda)',
    'Rig Veda / Atharva Veda',
    'Padma Purana (attributed to Indra)',
    'Bhagavad Gita',
    'Vishnu Sahasranama',
    'Isha Upanishad',
    'Brihadaranyaka Upanishad'
  ];
  const options = [correct];
  const others = sources.filter(s => s !== correct);
  while (options.length < 4) {
    const random = others[Math.floor(Math.random() * others.length)];
    if (!options.includes(random)) options.push(random);
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

// Generate matching questions
function generateMatchingQuestions(selectedShlokas, difficulty) {
  const matchConfigs = [
    { type: 'name_meaning', question: 'Match each shloka with its meaning:', rightLabel: 'Meaning', getRight: s => getMeaningSummary(s) },
    { type: 'name_deity', question: 'Match each shloka with its deity:', rightLabel: 'Deity', getRight: s => s.deity },
    { type: 'name_occasion', question: 'Match each shloka with its occasion:', rightLabel: 'Occasion', getRight: s => s.occasion },
    { type: 'name_source', question: 'Match each shloka with its source scripture:', rightLabel: 'Source', getRight: s => s.source || 'Unknown' }
  ];

  const questions = [];

  for (const config of matchConfigs) {
    const shuffled = shuffleArray([...selectedShlokas]);
    // Use 4 of 5 shlokas, ensure unique right-side values
    const group = shuffled.slice(0, 4);
    if (group.length < 4) continue;

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
  }

  return questions;
}

// Main quiz generation function
function generateQuiz(options = {}) {
  const {
    shlokaIds = null,
    difficulty = 'all',
    questionsPerShloka = 3,
    maxQuestions = 25
  } = options;

  let selectedShlokas = [...shlokas];
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

  return shuffleArray(questions).slice(0, maxQuestions);
}

module.exports = { generateQuiz, shlokas };
