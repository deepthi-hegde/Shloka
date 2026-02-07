function generateHTML(questions, title = 'Shloka Quiz - Level 2', options = {}) {
  const questionsJSON = JSON.stringify(questions);
  const googleFormUrl = options.googleFormUrl || '';
  const googleFormFields = options.googleFormFields || {
    name: 'entry.1234567890',
    score: 'entry.1234567891',
    total: 'entry.1234567892',
    percentage: 'entry.1234567893'
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #e65100 0%, #ff8f00 100%);
      min-height: 100vh;
      padding: 20px;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
    }

    .header {
      text-align: center;
      color: white;
      padding: 30px;
      margin-bottom: 20px;
    }

    .header h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }

    .header .subtitle {
      font-size: 1.2em;
      opacity: 0.9;
    }

    .score-bar {
      background: white;
      border-radius: 15px;
      padding: 15px 25px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }

    .score-item {
      text-align: center;
    }

    .score-item .label {
      font-size: 0.9em;
      color: #666;
      margin-bottom: 5px;
    }

    .score-item .value {
      font-size: 1.5em;
      font-weight: bold;
      color: #333;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: #e0e0e0;
      border-radius: 4px;
      margin-top: 10px;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #e65100, #ff8f00);
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .question-card {
      background: white;
      border-radius: 20px;
      padding: 30px;
      margin-bottom: 20px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .question-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .question-number {
      background: linear-gradient(135deg, #e65100, #ff8f00);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: bold;
    }

    .difficulty-badge {
      padding: 5px 12px;
      border-radius: 15px;
      font-size: 0.85em;
      font-weight: 500;
    }

    .difficulty-simple { background: #e8f5e9; color: #2e7d32; }
    .difficulty-intermediate { background: #fff3e0; color: #f57c00; }
    .difficulty-difficult { background: #fce4ec; color: #c2185b; }

    .question-text {
      font-size: 1.3em;
      color: #333;
      margin-bottom: 25px;
      line-height: 1.5;
    }

    .options {
      display: grid;
      gap: 12px;
    }

    .option {
      padding: 18px 25px;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 1.1em;
      display: flex;
      align-items: center;
    }

    .option:hover { border-color: #e65100; background: #fff8f0; }
    .option.selected { border-color: #e65100; background: #fff3e0; }
    .option.correct { border-color: #4caf50; background: #e8f5e9; }
    .option.incorrect { border-color: #f44336; background: #ffebee; }
    .option.show-correct { border-color: #4caf50; background: #e8f5e9; }

    .option-letter {
      width: 35px; height: 35px; border-radius: 50%; background: #f0f0f0;
      display: flex; align-items: center; justify-content: center;
      margin-right: 15px; font-weight: bold; color: #666;
      flex-shrink: 0;
    }

    .option.selected .option-letter { background: #e65100; color: white; }
    .option.correct .option-letter { background: #4caf50; color: white; }
    .option.incorrect .option-letter { background: #f44336; color: white; }

    .feedback {
      margin-top: 20px; padding: 15px; border-radius: 10px;
      text-align: center; font-weight: 500; animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .feedback.correct { background: #e8f5e9; color: #2e7d32; }
    .feedback.incorrect { background: #ffebee; color: #c62828; }

    .btn {
      padding: 15px 40px; border: none; border-radius: 25px;
      font-size: 1.1em; font-weight: 600; cursor: pointer;
      transition: all 0.2s ease; margin-top: 20px;
    }

    .btn-primary {
      background: linear-gradient(135deg, #e65100, #ff8f00); color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(230, 81, 0, 0.4);
    }

    .btn-secondary { background: #f5f5f5; color: #333; }
    .btn-center { display: block; margin: 20px auto; }

    .results { text-align: center; padding: 40px; }
    .results h2 { font-size: 2em; margin-bottom: 20px; color: #333; }

    .results .score-circle {
      width: 150px; height: 150px; border-radius: 50%;
      background: linear-gradient(135deg, #e65100, #ff8f00);
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; margin: 30px auto; color: white;
    }

    .results .score-circle .percentage { font-size: 2.5em; font-weight: bold; }
    .results .score-circle .label { font-size: 0.9em; opacity: 0.9; }
    .results .message { font-size: 1.3em; color: #666; margin-bottom: 30px; }
    .results .stats { display: flex; justify-content: center; gap: 40px; margin-bottom: 30px; }
    .results .stat { text-align: center; }
    .results .stat .value { font-size: 2em; font-weight: bold; color: #333; }
    .results .stat .label { color: #666; }

    .hidden { display: none !important; }

    .start-screen { text-align: center; padding: 40px; }
    .start-screen h2 { font-size: 1.8em; margin-bottom: 15px; color: #333; }
    .start-screen p { color: #666; margin-bottom: 30px; font-size: 1.1em; }

    .difficulty-select {
      display: flex; gap: 15px; justify-content: center;
      margin-bottom: 30px; flex-wrap: wrap;
    }

    .difficulty-btn {
      padding: 15px 30px; border: 2px solid #e0e0e0; border-radius: 10px;
      cursor: pointer; transition: all 0.2s ease; background: white;
    }

    .difficulty-btn:hover { border-color: #e65100; }
    .difficulty-btn.active { border-color: #e65100; background: #fff3e0; }
    .difficulty-btn .emoji { font-size: 2em; margin-bottom: 8px; }
    .difficulty-btn .text { font-weight: 600; color: #333; }

    /* Matching question styles */
    .matching-container {
      display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;
    }

    .matching-column {
      display: flex; flex-direction: column; gap: 10px; flex: 1; min-width: 180px;
    }

    .matching-column-header {
      font-weight: 600; color: #e65100; text-align: center;
      padding: 8px; border-bottom: 2px solid #e65100; margin-bottom: 5px;
    }

    .matching-item {
      padding: 14px 16px; border: 2px solid #e0e0e0; border-radius: 10px;
      cursor: pointer; transition: all 0.2s ease; text-align: center;
      font-size: 0.95em; user-select: none;
    }

    .matching-item:hover { border-color: #e65100; background: #fff8f0; }
    .matching-item.selected { border-color: #e65100; background: #fff3e0; box-shadow: 0 0 0 3px rgba(230,81,0,0.3); }
    .matching-item.matched { border-color: #4caf50; background: #e8f5e9; cursor: default; opacity: 0.85; }
    .matching-item.wrong { animation: shake 0.5s ease; border-color: #f44336; }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-8px); }
      40%, 80% { transform: translateX(8px); }
    }

    .level-badge {
      display: inline-block;
      background: rgba(255,255,255,0.2);
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.85em;
      margin-bottom: 8px;
    }

    /* Flashcard styles */
    .flashcard-controls {
      display: flex; justify-content: space-between; align-items: center;
      background: white; border-radius: 15px; padding: 12px 20px;
      margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }

    .flashcard-counter { font-weight: 600; color: #333; font-size: 1.1em; }

    .flashcard-wrapper { perspective: 1000px; margin-bottom: 20px; }

    .flashcard {
      width: 100%; min-height: 350px; position: relative; cursor: pointer;
      transform-style: preserve-3d; transition: transform 0.6s cubic-bezier(0.4,0.0,0.2,1);
    }

    .flashcard.flipped { transform: rotateY(180deg); }

    .flashcard-front, .flashcard-back {
      position: absolute; top: 0; left: 0; width: 100%; min-height: 350px;
      backface-visibility: hidden; border-radius: 20px; padding: 30px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15); display: flex;
      flex-direction: column; justify-content: center;
    }

    .flashcard-front {
      background: linear-gradient(135deg, #e65100 0%, #ff8f00 100%);
      color: white; text-align: center;
    }

    .flashcard-front h3 { font-size: 1.8em; margin-bottom: 20px; }
    .flashcard-front .flashcard-sanskrit { font-size: 1.05em; font-style: italic; opacity: 0.9; line-height: 1.6; }
    .flashcard-front .flip-hint { font-size: 0.85em; opacity: 0.6; margin-top: 20px; }

    .flashcard-back {
      background: white; transform: rotateY(180deg); text-align: left;
    }

    .fc-section { margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid #eee; }
    .fc-section:last-child { border-bottom: none; }
    .fc-label { font-weight: 600; color: #e65100; display: block; margin-bottom: 4px; font-size: 0.9em; }

    .flashcard-nav { display: flex; justify-content: center; gap: 20px; }

    /* Mode selector */
    .mode-select {
      display: flex; gap: 20px; justify-content: center;
      margin-bottom: 25px; flex-wrap: wrap;
    }

    .mode-btn {
      padding: 20px 30px; border: 2px solid #e0e0e0; border-radius: 15px;
      cursor: pointer; transition: all 0.2s ease; background: white;
      text-align: center; min-width: 160px;
    }

    .mode-btn:hover { border-color: #e65100; }
    .mode-btn.active { border-color: #e65100; background: #fff3e0; }
    .mode-btn .emoji { font-size: 2.2em; margin-bottom: 8px; }
    .mode-btn .text { font-weight: 600; color: #333; font-size: 1.05em; }
    .mode-btn .desc { font-size: 0.8em; color: #888; margin-top: 4px; }

    @media (max-width: 600px) {
      .header h1 { font-size: 1.8em; }
      .question-text { font-size: 1.1em; }
      .option { padding: 14px 18px; font-size: 1em; }
      .score-bar { flex-wrap: wrap; gap: 15px; }
      .matching-container { flex-direction: column; gap: 15px; }
      .mode-select { gap: 10px; }
      .mode-btn { min-width: 140px; padding: 15px 20px; }
      .flashcard-front h3 { font-size: 1.4em; }
      .flashcard { min-height: 300px; }
      .flashcard-front, .flashcard-back { min-height: 300px; padding: 20px; }
      .flashcard-controls { flex-wrap: wrap; gap: 10px; justify-content: center; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="level-badge">Level 2</span>
      <h1>Shloka Quiz</h1>
      <p class="subtitle">Test your knowledge of sacred verses</p>
    </div>

    <div id="start-screen" class="question-card start-screen">
      <h2>Welcome to Shloka Quiz - Level 2!</h2>
      <p>These are deeper shlokas with rich meanings. Enter your name and pick a difficulty to begin.</p>

      <div class="name-input" style="margin-bottom: 25px;">
        <input type="text" id="student-name" placeholder="Enter your name"
               style="padding: 15px 20px; font-size: 1.1em; border: 2px solid #e0e0e0; border-radius: 10px; width: 100%; max-width: 300px; text-align: center;">
      </div>

      <div class="mode-select">
        <div class="mode-btn active" data-mode="quiz" onclick="selectMode('quiz', this)">
          <div class="emoji">&#x1F4DD;</div>
          <div class="text">Quiz Mode</div>
          <div class="desc">Test your knowledge</div>
        </div>
        <div class="mode-btn" data-mode="flashcard" onclick="selectMode('flashcard', this)">
          <div class="emoji">&#x1F4DA;</div>
          <div class="text">Flashcard Mode</div>
          <div class="desc">Study and review</div>
        </div>
      </div>

      <div id="quiz-options">
        <div class="difficulty-label" style="color: white; margin-bottom: 10px; font-weight: 500;">Select Difficulty:</div>
        <select id="difficulty-dropdown" style="padding: 12px 20px; font-size: 1.1em; border: 2px solid #e0e0e0; border-radius: 10px; background: white; margin-bottom: 25px; width: 100%; max-width: 200px;">
          <option value="all">🌟 All Levels</option>
          <option value="simple">🌱 Simple</option>
          <option value="intermediate">🌿 Intermediate</option>
          <option value="difficult">🌳 Difficult</option>
        </select>
      </div>

      <button class="btn btn-primary" onclick="startSelected()">Start</button>
    </div>

    <div id="quiz-screen" class="hidden">
      <div class="score-bar">
        <div class="score-item">
          <div class="label">Score</div>
          <div class="value" id="current-score">0</div>
        </div>
        <div class="score-item">
          <div class="label">Question</div>
          <div class="value"><span id="current-question">1</span>/<span id="total-questions">10</span></div>
        </div>
        <div class="score-item">
          <div class="label">Correct</div>
          <div class="value" id="correct-count">0</div>
        </div>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" id="progress-fill" style="width: 0%"></div>
      </div>

      <div class="question-card" id="question-card"></div>
    </div>

    <div id="results-screen" class="question-card results hidden">
      <h2>Quiz Complete!</h2>
      <p style="color: #e65100; font-size: 1.1em; margin-bottom: 10px;">Well done, <span id="result-name"></span>!</p>
      <div class="score-circle">
        <div class="percentage" id="final-percentage">0%</div>
        <div class="label">Score</div>
      </div>
      <p class="message" id="result-message"></p>
      <div class="stats">
        <div class="stat">
          <div class="value" id="final-correct">0</div>
          <div class="label">Correct</div>
        </div>
        <div class="stat">
          <div class="value" id="final-wrong">0</div>
          <div class="label">Wrong</div>
        </div>
        <div class="stat">
          <div class="value" id="final-total">0</div>
          <div class="label">Total</div>
        </div>
      </div>
      <p id="score-submitted" class="hidden" style="color: #4caf50; font-size: 0.9em; margin-top: 15px;">Your score has been sent to your teacher!</p>
      <div style="display: flex; flex-direction: column; gap: 10px; max-width: 300px; margin: 20px auto;">
        <button class="btn btn-primary" id="submit-score-btn" onclick="submitScoreToGoogleFormManual()" style="margin-top:0;">Submit Score</button>
        <button class="btn btn-secondary" id="study-wrong-btn" onclick="studyWrongAnswers()" style="display: none; margin-top:0;">Review Mistakes</button>
        <div style="display: flex; gap: 10px;">
          <button class="btn btn-secondary" onclick="restartQuiz()" style="flex: 1; margin-top:0;">Try Again</button>
          <button class="btn btn-secondary" onclick="goHome()" style="flex: 1; margin-top:0;">Home</button>
        </div>
      </div>
    </div>

    <div id="flashcard-screen" class="hidden">
      <div class="flashcard-controls">
        <button class="btn btn-secondary" onclick="shuffleFlashcards()" style="margin-top:0; padding: 10px 20px; font-size: 0.9em;">Shuffle</button>
        <span class="flashcard-counter" id="flashcard-counter">1 / 5</span>
        <button class="btn btn-secondary" onclick="goHome()" style="margin-top:0; padding: 10px 20px; font-size: 0.9em;">Home</button>
      </div>

      <div class="flashcard-wrapper" id="flashcard-wrapper">
        <div class="flashcard" id="flashcard" onclick="flipCard()">
          <div class="flashcard-front">
            <h3 id="fc-name"></h3>
            <p class="flashcard-sanskrit" id="fc-sanskrit"></p>
            <p class="flip-hint">Tap to flip</p>
          </div>
          <div class="flashcard-back">
            <div class="fc-section">
              <span class="fc-label">Meaning:</span>
              <span id="fc-meaning"></span>
            </div>
            <div class="fc-section">
              <span class="fc-label">Deity:</span>
              <span id="fc-deity"></span>
            </div>
            <div class="fc-section">
              <span class="fc-label">Occasion:</span>
              <span id="fc-occasion"></span>
            </div>
            <div class="fc-section">
              <span class="fc-label">Deep Meaning:</span>
              <span id="fc-deep"></span>
            </div>
          </div>
        </div>
      </div>

      <div class="flashcard-nav">
        <button class="btn btn-secondary" onclick="prevCard()" style="margin-top: 0;">Previous</button>
        <button class="btn btn-primary" onclick="nextCard()" style="margin-top: 0;">Next</button>
      </div>
    </div>
  </div>

  <script>
    var allQuestions = ${questionsJSON};
    var allShlokas = ${JSON.stringify(options.shlokas || [])};

    // Google Form configuration
    var GOOGLE_FORM_URL = '${googleFormUrl}';
    var FORM_FIELDS = ${JSON.stringify(googleFormFields)};

    var questions = [];
    var currentQuestionIndex = 0;
    var score = 0;
    var correctCount = 0;
    var selectedDifficulty = 'all';
    var selectedMode = 'quiz';
    var answered = false;
    var studentName = '';
    var wrongShlokaNames = [];

    // Matching state
    var matchingState = { selectedLeft: null, matched: [], pairs: [] };

    // Flashcard state
    var flashcardShlokas = [];
    var currentCardIndex = 0;

    /* ---- Mode & Difficulty Selection ---- */

    function selectMode(mode, btn) {
      document.querySelectorAll('.mode-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      selectedMode = mode;
      document.getElementById('quiz-options').style.display = mode === 'quiz' ? 'block' : 'none';
    }

    function selectDifficulty(diff, btn) {
      // Keep for compatibility but use dropdown value
      selectedDifficulty = diff;
    }

    function startSelected() {
      studentName = document.getElementById('student-name').value.trim();
      if (!studentName) {
        alert('Please enter your name!');
        document.getElementById('student-name').focus();
        return;
      }
      
      const dropdown = document.getElementById('difficulty-dropdown');
      if (dropdown) selectedDifficulty = dropdown.value;

      if (selectedMode === 'quiz') {
        startQuiz();
      } else {
        startFlashcards();
      }
    }

    /* ---- Quiz Mode ---- */

    function filterQuestions() {
      if (selectedDifficulty === 'all') {
        questions = allQuestions.slice();
      } else {
        questions = allQuestions.filter(function(q) { return q.difficulty === selectedDifficulty; });
      }
      questions = questions.sort(function() { return Math.random() - 0.5; });
      questions = questions.slice(0, Math.min(15, questions.length));
    }

    function startQuiz() {
      studentName = document.getElementById('student-name').value.trim();
      if (!studentName) {
        alert('Please enter your name!');
        document.getElementById('student-name').focus();
        return;
      }

      filterQuestions();
      if (questions.length === 0) {
        alert('No questions available for this difficulty. Try another level!');
        return;
      }
      currentQuestionIndex = 0;
      score = 0;
      correctCount = 0;
      answered = false;
      wrongShlokaNames = [];

      document.getElementById('start-screen').classList.add('hidden');
      document.getElementById('quiz-screen').classList.remove('hidden');
      document.getElementById('results-screen').classList.add('hidden');
      document.getElementById('flashcard-screen').classList.add('hidden');

      document.getElementById('total-questions').textContent = questions.length;
      updateScore();
      showQuestion();
    }

    function showQuestion() {
      var q = questions[currentQuestionIndex];
      answered = false;

      document.getElementById('current-question').textContent = currentQuestionIndex + 1;
      document.getElementById('progress-fill').style.width = ((currentQuestionIndex) / questions.length * 100) + '%';

      if (q.type === 'matching') {
        showMatchingQuestion(q);
        return;
      }

      // Standard multiple choice / true-false / fill-blank
      var optionLetters = ['A', 'B', 'C', 'D'];
      var optionsHTML = '';
      q.options.forEach(function(opt, i) {
        optionsHTML += '<div class="option" data-index="' + i + '" onclick="selectOption(this, ' + i + ')">' +
          '<span class="option-letter">' + optionLetters[i] + '</span>' +
          '<span class="option-text">' + opt + '</span></div>';
      });

      var difficultyClass = 'difficulty-' + q.difficulty;
      var difficultyLabel = q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1);

      document.getElementById('question-card').innerHTML =
        '<div class="question-header">' +
          '<span class="question-number">Question ' + (currentQuestionIndex + 1) + '</span>' +
          '<span class="difficulty-badge ' + difficultyClass + '">' + difficultyLabel + '</span>' +
        '</div>' +
        '<p class="question-text">' + q.question + '</p>' +
        '<div class="options">' + optionsHTML + '</div>' +
        '<div id="feedback" class="feedback hidden"></div>' +
        '<button id="next-btn" class="btn btn-primary btn-center hidden" onclick="nextQuestion()">' +
          (currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results') +
        '</button>';
    }

    function selectOption(element, index) {
      if (answered) return;
      answered = true;

      var q = questions[currentQuestionIndex];
      var selectedAnswer = q.options[index];
      var isCorrect = selectedAnswer === q.answer;

      document.querySelectorAll('.option').forEach(function(opt, i) {
        if (q.options[i] === q.answer) {
          opt.classList.add('correct');
          if (!isCorrect) opt.classList.add('show-correct');
        }
      });

      if (isCorrect) {
        element.classList.add('correct');
        score += 10;
        correctCount++;
        showFeedback(true, 'Correct! Great job!');
      } else {
        element.classList.add('incorrect');
        showFeedback(false, 'Incorrect. The answer is: ' + q.answer);
        if (q.shloka && !wrongShlokaNames.includes(q.shloka)) {
          wrongShlokaNames.push(q.shloka);
        }
      }

      updateScore();
      document.getElementById('next-btn').classList.remove('hidden');
    }

    /* ---- Matching Questions ---- */

    function showMatchingQuestion(q) {
      var leftItems = q.pairs.map(function(p, i) { return { text: p.left, index: i }; });
      var rightItems = q.pairs.map(function(p, i) { return { text: p.right, index: i }; });
      leftItems.sort(function() { return Math.random() - 0.5; });
      rightItems.sort(function() { return Math.random() - 0.5; });

      matchingState = { selectedLeft: null, matched: [], pairs: q.pairs };

      var difficultyClass = 'difficulty-' + q.difficulty;
      var difficultyLabel = q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1);

      var leftHTML = leftItems.map(function(item) {
        return '<div class="matching-item matching-left" data-index="' + item.index +
               '" onclick="selectMatchLeft(this, ' + item.index + ')">' + item.text + '</div>';
      }).join('');

      var rightHTML = rightItems.map(function(item) {
        return '<div class="matching-item matching-right" data-index="' + item.index +
               '" onclick="selectMatchRight(this, ' + item.index + ')">' + item.text + '</div>';
      }).join('');

      var rightLabel = q.rightLabel || 'Answer';

      document.getElementById('question-card').innerHTML =
        '<div class="question-header">' +
          '<span class="question-number">Question ' + (currentQuestionIndex + 1) + '</span>' +
          '<span class="difficulty-badge ' + difficultyClass + '">' + difficultyLabel + '</span>' +
        '</div>' +
        '<p class="question-text">' + q.question + '</p>' +
        '<div class="matching-container">' +
          '<div class="matching-column">' +
            '<div class="matching-column-header">Shloka</div>' + leftHTML +
          '</div>' +
          '<div class="matching-column">' +
            '<div class="matching-column-header">' + rightLabel + '</div>' + rightHTML +
          '</div>' +
        '</div>' +
        '<div id="feedback" class="feedback hidden"></div>' +
        '<button class="btn btn-secondary btn-center" onclick="giveUpMatching()" id="giveup-btn">Show Answers</button>' +
        '<button id="next-btn" class="btn btn-primary btn-center hidden" onclick="nextQuestion()">' +
          (currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results') +
        '</button>';
    }

    function selectMatchLeft(el, index) {
      if (answered) return;
      if (matchingState.matched.some(function(m) { return m.left === index; })) return;

      document.querySelectorAll('.matching-left').forEach(function(e) { e.classList.remove('selected'); });
      el.classList.add('selected');
      matchingState.selectedLeft = index;
    }

    function selectMatchRight(el, rightIndex) {
      if (answered) return;
      if (matchingState.selectedLeft === null) return;
      if (matchingState.matched.some(function(m) { return m.right === rightIndex; })) return;

      var leftIndex = matchingState.selectedLeft;

      if (leftIndex === rightIndex) {
        matchingState.matched.push({ left: leftIndex, right: rightIndex });
        document.querySelector('.matching-left[data-index="' + leftIndex + '"]').classList.add('matched');
        document.querySelector('.matching-left[data-index="' + leftIndex + '"]').classList.remove('selected');
        el.classList.add('matched');
        matchingState.selectedLeft = null;

        if (matchingState.matched.length === matchingState.pairs.length) {
          answered = true;
          score += 10;
          correctCount++;
          showFeedback(true, 'All matched correctly! Great job!');
          updateScore();
          document.getElementById('giveup-btn').classList.add('hidden');
          document.getElementById('next-btn').classList.remove('hidden');
        }
      } else {
        el.classList.add('wrong');
        setTimeout(function() { el.classList.remove('wrong'); }, 500);
        document.querySelector('.matching-left[data-index="' + leftIndex + '"]').classList.remove('selected');
        matchingState.selectedLeft = null;
      }
    }

    function giveUpMatching() {
      if (answered) return;
      answered = true;

      matchingState.pairs.forEach(function(pair, i) {
        var leftEl = document.querySelector('.matching-left[data-index="' + i + '"]');
        var rightEl = document.querySelector('.matching-right[data-index="' + i + '"]');
        if (leftEl) leftEl.classList.add('matched');
        if (rightEl) rightEl.classList.add('matched');
      });

      showFeedback(false, 'Here are the correct matches.');
      document.getElementById('giveup-btn').classList.add('hidden');
      document.getElementById('next-btn').classList.remove('hidden');
    }

    /* ---- Common Functions ---- */

    function showFeedback(isCorrect, message) {
      var feedback = document.getElementById('feedback');
      feedback.textContent = message;
      feedback.className = 'feedback ' + (isCorrect ? 'correct' : 'incorrect');
      feedback.classList.remove('hidden');
    }

    function updateScore() {
      document.getElementById('current-score').textContent = score;
      document.getElementById('correct-count').textContent = correctCount;
    }

    function nextQuestion() {
      currentQuestionIndex++;
      if (currentQuestionIndex < questions.length) {
        showQuestion();
      } else {
        showResults();
      }
    }

    function showResults() {
      document.getElementById('quiz-screen').classList.add('hidden');
      document.getElementById('results-screen').classList.remove('hidden');

      var percentage = Math.round((correctCount / questions.length) * 100);
      document.getElementById('final-percentage').textContent = percentage + '%';
      document.getElementById('final-correct').textContent = correctCount;
      document.getElementById('final-wrong').textContent = questions.length - correctCount;
      document.getElementById('final-total').textContent = questions.length;

      var message = '';
      if (percentage >= 90) message = 'Outstanding! You are a Shloka master!';
      else if (percentage >= 70) message = 'Great job! Keep practicing!';
      else if (percentage >= 50) message = 'Good effort! Review the shlokas and try again!';
      else message = 'Keep learning! Practice makes perfect!';

      document.getElementById('result-message').textContent = message;
      document.getElementById('result-name').textContent = studentName;

      // Show study wrong button if there are mistakes
      const studyBtn = document.getElementById('study-wrong-btn');
      if (studyBtn && wrongShlokaNames.length > 0) {
        studyBtn.style.display = 'block';
      } else if (studyBtn) {
        studyBtn.style.display = 'none';
      }
      
      // Reset submit button
      const submitBtn = document.getElementById('submit-score-btn');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.textContent = 'Submit Score';
      }
      document.getElementById('score-submitted').classList.add('hidden');
    }

    function submitScoreToGoogleFormManual() {
      const percentage = Math.round((correctCount / questions.length) * 100);
      submitScoreToGoogleForm(percentage);
      
      const submitBtn = document.getElementById('submit-score-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.5';
        submitBtn.textContent = 'Submitted';
      }
    }

    function submitScoreToGoogleForm(percentage) {
      if (!GOOGLE_FORM_URL) return;

      var formData = new URLSearchParams();
      formData.append(FORM_FIELDS.name, studentName);
      formData.append(FORM_FIELDS.score, correctCount.toString());
      formData.append(FORM_FIELDS.total, questions.length.toString());
      formData.append(FORM_FIELDS.percentage, percentage.toString());
      if (FORM_FIELDS.difficulty) formData.append(FORM_FIELDS.difficulty, selectedDifficulty);

      fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
      }).then(function() {
        document.getElementById('score-submitted').classList.remove('hidden');
      }).catch(function() {});
    }

    function restartQuiz() {
      filterQuestions();
      currentQuestionIndex = 0;
      score = 0;
      correctCount = 0;

      document.getElementById('results-screen').classList.add('hidden');
      document.getElementById('quiz-screen').classList.remove('hidden');

      updateScore();
      showQuestion();
    }

    function goHome() {
      document.getElementById('results-screen').classList.add('hidden');
      document.getElementById('quiz-screen').classList.add('hidden');
      document.getElementById('flashcard-screen').classList.add('hidden');
      document.getElementById('start-screen').classList.remove('hidden');
    }

    /* ---- Flashcard Mode ---- */

    function startFlashcards() {
      flashcardShlokas = allShlokas.slice();
      currentCardIndex = 0;
      
      document.getElementById('start-screen').classList.add('hidden');
      document.getElementById('flashcard-screen').classList.remove('hidden');
      document.getElementById('results-screen').classList.add('hidden');
      
      updateFlashcard();
    }

    function updateFlashcard() {
      const s = flashcardShlokas[currentCardIndex];
      const card = document.getElementById('flashcard');
      card.classList.remove('flipped');
      
      document.getElementById('fc-name').textContent = s.name;
      document.getElementById('fc-sanskrit').textContent = s.sanskrit || '';
      document.getElementById('fc-meaning').textContent = s.meaning || '';
      document.getElementById('fc-deity').textContent = s.deity || '';
      document.getElementById('fc-occasion').textContent = s.occasion || '';
      document.getElementById('fc-deep').textContent = s.deepMeaning ? s.deepMeaning.summary : '';
      
      document.getElementById('flashcard-counter').textContent = (currentCardIndex + 1) + ' / ' + flashcardShlokas.length;
    }

    function flipCard() {
      document.getElementById('flashcard').classList.toggle('flipped');
    }

    function nextCard() {
      currentCardIndex = (currentCardIndex + 1) % flashcardShlokas.length;
      updateFlashcard();
    }

    function prevCard() {
      currentCardIndex = (currentCardIndex - 1 + flashcardShlokas.length) % flashcardShlokas.length;
      updateFlashcard();
    }

    function shuffleFlashcards() {
      flashcardShlokas.sort(() => Math.random() - 0.5);
      currentCardIndex = 0;
      updateFlashcard();
    }

    function studyWrongAnswers() {
      if (wrongShlokaNames.length === 0) return;
      
      flashcardShlokas = allShlokas.filter(s => wrongShlokaNames.includes(s.name));
      currentCardIndex = 0;
      
      document.getElementById('results-screen').classList.add('hidden');
      document.getElementById('flashcard-screen').classList.remove('hidden');
      
      updateFlashcard();
    }
  </script>
</body>
</html>`;
}

module.exports = { generateHTML };
