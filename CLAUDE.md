# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Shloka Quiz Generator - A Node.js tool that generates interactive HTML quizzes for elementary school students (under 11 years) learning Sanskrit shlokas. The quizzes cover meanings, deities, and occasions for chanting.

## Commands

```bash
# Generate Level 1 quiz
npm run generate
# or
node index.js

# Generate Level 2 quiz
npm run generate:level2
# or
node index-level2.js

# CLI options
node index.js -d simple -m 15 -o my-quiz.html
# -d, --difficulty: simple | intermediate | difficult | all
# -m, --max: max number of questions
# -o, --output: output filename (index.js default: shloka-quiz.html, index-level2.js default: shloka-quiz-level2.html)
```

## Architecture

```
shloka-quiz-generator/
├── data/
│   ├── shlokas.json          # Level 1 database
│   └── shlokas-level2.json   # Level 2 database
├── src/
│   ├── quizGenerator.js      # Level 1 logic
│   ├── htmlGenerator.js      # Level 1 HTML template
│   ├── quizGeneratorLevel2.js # Level 2 logic
│   └── htmlGeneratorLevel2.js # Level 2 HTML template
├── output/
│   ├── shloka-quiz.html      # Level 1 output
│   └── shloka-quiz-level2.html # Level 2 output
├── index.js                  # Level 1 entry point
└── index-level2.js           # Level 2 entry point
```

## Key Design Decisions

- **Three difficulty levels**: Simple (deity/occasion), Intermediate (meanings/keywords), Difficult (sanskrit recognition/sources)
- **Question types**: Multiple choice (4 options), True/False, Fill-in-the-blank
- **Self-contained HTML**: Quiz works offline, no server needed - just open in browser
- **Level 1 covers shlokas 1-20**
- **Level 2 covers 5 advanced shlokas** (Ganesha Stavah, Saraswati Vandana, Mantra Pushpam, Shanti Mantra, Mahalakshmi Ashtakam)

## Teacher Score Tracking (Google Forms)

To see student scores in a spreadsheet:

### Step 1: Create a Google Form
1. Go to [Google Forms](https://forms.google.com)
2. Create a new form with these **5 Short Answer** questions:
   - "Student Name"
   - "Score (Correct)"
   - "Total Questions"
   - "Percentage"
   - "Difficulty Level"

### Step 2: Get the Form URL and Field IDs
1. Click the 3-dot menu → "Get pre-filled link"
2. Fill in dummy values and click "Get link"
3. The URL will look like: `https://docs.google.com/forms/d/e/FORM_ID/formResponse?entry.123=value1&entry.456=value2...`
4. Note down:
   - The base URL (up to `/formResponse`)
   - Each `entry.XXXXXXX` ID for each field

### Step 3: Update config.json
```json
{
  "googleForm": {
    "enabled": true,
    "url": "https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse",
    "fields": {
      "name": "entry.123456789",
      "score": "entry.234567890",
      "total": "entry.345678901",
      "percentage": "entry.456789012",
      "difficulty": "entry.567890123"
    }
  }
}
```

### Step 4: Regenerate the quiz
```bash
npm run generate
```

Now when students complete the quiz, their scores automatically appear in your linked Google Sheet!

## Adding New Shlokas

Add entries to `data/shlokas.json` with this structure:
```json
{
  "id": 32,
  "name": "Shloka Name",
  "sanskrit": "sanskrit text in IAST",
  "meaning": "English translation",
  "deity": "Associated deity",
  "occasion": "When to chant",
  "keywords": ["key", "words", "from", "meaning"]
}
```

Then update `src/quizGenerator.js` arrays: `allDeities`, `allOccasions`, and the meaning/blessing/quality lookup objects.
