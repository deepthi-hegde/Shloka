const fs = require('fs');
const path = require('path');
const { generateQuiz } = require('./src/quizGenerator');
const { generateQuiz: generateQuizL2, shlokas: shlokasL2 } = require('./src/quizGeneratorLevel2');
const shlokasL1 = require('./data/shlokas.json');

function exportToCSV() {
    console.log('Generating questions for CSV export...');

    const allRows = [];
    allRows.push(['Level', 'Shloka Name', 'Type', 'Question', 'Options', 'Correct Answer']);

    // Level 1
    const l1Ids = shlokasL1.map(s => s.id);
    // Generate complex set of questions for L1
    const l1Questions = generateQuiz({
        shlokaIds: l1Ids,
        difficulty: 'all',
        questionsPerShloka: 10, // Get a variety
        maxQuestions: 500
    });

    l1Questions.forEach(q => {
        if (q.type === 'matching') {
            q.pairs.forEach(p => {
                allRows.push(['Level 1', q.shloka, 'Matching', `${q.question} (${p.left})`, '', p.right]);
            });
        } else {
            const options = q.options ? q.options.join('; ') : '';
            allRows.push(['Level 1', q.shloka, q.type, q.question, options, q.answer || q.correctSanskrit || '']);
        }
    });

    // Level 2
    const l2Ids = shlokasL2.map(s => s.id);
    const l2Questions = generateQuizL2({
        shlokaIds: l2Ids,
        difficulty: 'all',
        questionsPerShloka: 10,
        maxQuestions: 500
    });

    l2Questions.forEach(q => {
        if (q.type === 'matching') {
            q.pairs.forEach(p => {
                allRows.push(['Level 2', q.shloka, 'Matching', `${q.question} (${p.left})`, '', p.right]);
            });
        } else {
            const options = q.options ? q.options.join('; ') : '';
            allRows.push(['Level 2', q.shloka, q.type, q.question, options, q.answer || q.correctSanskrit || '']);
        }
    });

    // Filter duplicates based on Question + Answer
    const uniqueRows = [];
    const seen = new Set();

    // Keep header
    uniqueRows.push(allRows[0]);

    for (let i = 1; i < allRows.length; i++) {
        const row = allRows[i];
        const key = `${row[0]}|${row[3]}|${row[5]}`;
        if (!seen.has(key)) {
            uniqueRows.push(row);
            seen.add(key);
        }
    }

    const csvContent = uniqueRows.map(row =>
        row.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    const outputPath = path.join(__dirname, 'output', 'shloka-questions-review.csv');
    fs.writeFileSync(outputPath, csvContent);
    console.log(`Successfully exported ${uniqueRows.length - 1} questions to ${outputPath}`);
}

exportToCSV();
