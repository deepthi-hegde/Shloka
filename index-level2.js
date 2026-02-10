const fs = require('fs');
const path = require('path');
const { generateQuiz, shlokas } = require('./src/quizGeneratorLevel2');
const { generateHTML } = require('./src/htmlGeneratorLevel2');

// Load configuration
function loadConfig() {
  const configPath = path.join(__dirname, 'config.json');
  try {
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
  } catch (err) {
    console.log('Note: config.json not found or invalid, using defaults');
  }
  return {};
}

// Generate quiz for Level 2
function createQuiz(options = {}) {
  const config = loadConfig();
  const {
    outputFile = 'shloka-quiz-level2.html',
    difficulty = 'all',
    maxQuestions = 25
  } = options;

  console.log('Generating Shloka Quiz Level 2...');
  console.log(`Difficulty: ${difficulty}`);
  console.log(`Max questions: ${maxQuestions}`);

  // Generate questions
  // We use all shlokas in the Level 2 JSON
  const shlokaIds = shlokas.map(s => s.id);

  const questions = generateQuiz({
    shlokaIds: shlokaIds,
    difficulty: difficulty,
    questionsPerShloka: 4, // More questions per shloka since there are fewer shlokas
    maxQuestions: maxQuestions
  });

  console.log(`Generated ${questions.length} questions`);

  // Prepare HTML generation options
  const htmlOptions = {
    shlokas: shlokas,
    googleFormUrl: '',
    googleFormFields: {},
    quizEnabled: config.quizEnabled !== false
  };

  if (config.googleForm && config.googleForm.enabled && config.googleForm.url) {
    htmlOptions.googleFormUrl = config.googleForm.url;
    htmlOptions.googleFormFields = config.googleForm.fields;
    console.log('Google Form score tracking: ENABLED');
  } else {
    console.log('Google Form score tracking: disabled (configure in config.json)');
  }

  // Generate HTML
  const html = generateHTML(questions, 'Shloka Quiz - Level 2', htmlOptions);

  // Write to file
  const outputPath = path.join(__dirname, 'output', outputFile);

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, html);
  console.log(`Level 2 Quiz saved to: ${outputPath}`);

  return outputPath;
}

// CLI interface
const args = process.argv.slice(2);
const options = {};

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--difficulty' || args[i] === '-d') {
    options.difficulty = args[++i];
  } else if (args[i] === '--output' || args[i] === '-o') {
    options.outputFile = args[++i];
  } else if (args[i] === '--max' || args[i] === '-m') {
    options.maxQuestions = parseInt(args[++i]);
  } else if (args[i] === '--help' || args[i] === '-h') {
    console.log(`
Shloka Quiz Generator - Level 2
==============================

Usage: node index-level2.js [options]

Options:
  -d, --difficulty <level>  Set difficulty (simple, intermediate, difficult, all)
  -o, --output <file>       Output filename (default: shloka-quiz-level2.html)
  -m, --max <number>        Maximum number of questions (default: 25)
  -h, --help               Show this help message

Examples:
  node index-level2.js                    # Generate quiz with all difficulties
  node index-level2.js -d simple          # Generate simple quiz only
`);
    process.exit(0);
  }
}

// Run the generator
createQuiz(options);
