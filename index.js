const fs = require('fs');
const path = require('path');
const { generateQuiz, shlokas } = require('./src/quizGenerator');
const { generateHTML } = require('./src/htmlGenerator');

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

// Generate quiz with questions for shlokas 1-20
function createQuiz(options = {}) {
  const config = loadConfig();
  const {
    outputFile = 'shloka-quiz.html',
    difficulty = 'all',
    maxQuestions = 35
  } = options;

  console.log('Generating Shloka Quiz...');
  console.log(`Difficulty: ${difficulty}`);
  console.log(`Max questions: ${maxQuestions}`);

  // Generate questions
  const questions = generateQuiz({
    shlokaIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    difficulty: difficulty,
    questionsPerShloka: 3,
    maxQuestions: maxQuestions
  });

  console.log(`Generated ${questions.length} questions`);

  // Prepare HTML generation options
  const htmlOptions = { shlokas: shlokas.slice(0, 20) };
  if (config.googleForm && config.googleForm.enabled && config.googleForm.url) {
    htmlOptions.googleFormUrl = config.googleForm.url;
    htmlOptions.googleFormFields = config.googleForm.fields;
    console.log('Google Form score tracking: ENABLED');
  } else {
    console.log('Google Form score tracking: disabled (configure in config.json)');
  }

  // Generate HTML
  const html = generateHTML(questions, 'Shloka Class Quiz', htmlOptions);

  // Write to file
  const outputPath = path.join(__dirname, 'output', outputFile);

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, html);
  console.log(`Quiz saved to: ${outputPath}`);

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
Shloka Quiz Generator
=====================

Usage: node index.js [options]

Options:
  -d, --difficulty <level>  Set difficulty (simple, intermediate, difficult, all)
  -o, --output <file>       Output filename (default: shloka-quiz.html)
  -m, --max <number>        Maximum number of questions (default: 30)
  -h, --help               Show this help message

Examples:
  node index.js                           # Generate quiz with all difficulties
  node index.js -d simple                 # Generate simple quiz only
  node index.js -d difficult -m 15        # Generate 15 difficult questions
  node index.js -o my-quiz.html           # Custom output filename
`);
    process.exit(0);
  }
}

// Run the generator
createQuiz(options);
