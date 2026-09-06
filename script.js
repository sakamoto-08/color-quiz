// --- 1. 色データの定義 (英語名・日本語名・RGB値) ---
const COLOR_DATA = [
  { name: "レッド (Red)", rgb: "rgb(255, 0, 0)" },
  { name: "ブルー (Blue)", rgb: "rgb(0, 0, 255)" },
  { name: "グリーン (Green)", rgb: "rgb(0, 128, 0)" },
  { name: "イエロー (Yellow)", rgb: "rgb(255, 255, 0)" },
  { name: "オレンジ (Orange)", rgb: "rgb(255, 165, 0)" },
  { name: "パープル (Purple)", rgb: "rgb(128, 0, 128)" },
  { name: "ピンク (Pink)", rgb: "rgb(255, 192, 203)" },
  { name: "ブラウン (Brown)", rgb: "rgb(165, 42, 42)" },
  { name: "グレー (Gray)", rgb: "rgb(128, 128, 128)" },
  { name: "ブラック (Black)", rgb: "rgb(0, 0, 0)" },
  { name: "ホワイト (White)", rgb: "rgb(255, 255, 255)" },
  { name: "シアン (Cyan)", rgb: "rgb(0, 255, 255)" },
  { name: "マゼンタ (Magenta)", rgb: "rgb(255, 0, 255)" },
];

const TOTAL_QUESTIONS = 10; // 全問題数

// --- 2. 状態管理変数 ---
let currentQuestionIndex = 0; // 現在の問題番号
let score = 0; // 正答数
let currentCorrectAnswer = null; // 現在の問の正解データ
let questionQueue = []; // 今ラウンドの出題順（重複なし）

// --- 3. DOM要素の取得 ---
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const progressEl = document.getElementById("progress");
const colorPanelEl = document.getElementById("color-panel");
const feedbackEl = document.getElementById("feedback");
const optionsContainerEl = document.getElementById("options-container");
const finalScoreEl = document.getElementById("final-score");
const restartBtn = document.getElementById("restart-btn");

// --- 4. 初期化・イベント設定 ---
restartBtn.addEventListener("click", startQuiz);

// ゲーム開始
startQuiz();

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  questionQueue = shuffle([...COLOR_DATA]).slice(0, TOTAL_QUESTIONS);

  resultScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");

  nextQuestion();
}

// Fisher–Yates で配列をシャッフルする
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// --- 5. 問題出題処理 ---
function nextQuestion() {
  // パネルとフィードバックの表示初期化
  colorPanelEl.className = "color-panel";
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback-text";
  optionsContainerEl.innerHTML = "";

  // 10問終了したら結果画面へ
  if (currentQuestionIndex >= TOTAL_QUESTIONS) {
    showResult();
    return;
  }

  // 進捗表示の更新
  progressEl.textContent = `第 ${currentQuestionIndex + 1} / ${TOTAL_QUESTIONS} 問`;

  // 開始時に決めた出題順から正解を取り出す（重複なし）
  currentCorrectAnswer = questionQueue[currentQuestionIndex];

  // パネル背景色を設定
  colorPanelEl.style.backgroundColor = currentCorrectAnswer.rgb;

  // 4つの選択肢を作成（正解1つ + ダミー3つ）
  const options = generateOptions(currentCorrectAnswer);

  // ボタンを生成して画面に配置
  options.forEach((color) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = color.name;
    btn.addEventListener("click", () => handleAnswer(color));
    optionsContainerEl.appendChild(btn);
  });
}

// 選択肢（4つ）を生成する関数
function generateOptions(correctColor) {
  // 正解以外の色を取得
  const dummies = COLOR_DATA.filter((c) => c.name !== correctColor.name);

  // ダミー配列をシャッフルして3つ抽出
  const selectedDummies = shuffle(dummies).slice(0, 3);

  // 正解とダミーを結合し、再度シャッフル
  return shuffle([correctColor, ...selectedDummies]);
}

// --- 6. 回答判定処理 ---
function handleAnswer(selectedColor) {
  // 二重クリック防止のため全ボタンを無効化
  const buttons = optionsContainerEl.querySelectorAll("button");
  buttons.forEach((btn) => (btn.disabled = true));

  // 正誤判定
  if (selectedColor.name === currentCorrectAnswer.name) {
    score++;
    colorPanelEl.classList.add("correct");
    feedbackEl.textContent = "正解！";
    feedbackEl.classList.add("correct");
  } else {
    colorPanelEl.classList.add("incorrect");
    feedbackEl.textContent = `不正解… 正解は「${currentCorrectAnswer.name}」でした`;
    feedbackEl.classList.add("incorrect");
  }

  // インデックスを進めて1.5秒後に次の問題へ
  currentQuestionIndex++;
  setTimeout(nextQuestion, 1500);
}

// --- 7. 結果画面表示 ---
function showResult() {
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");
  finalScoreEl.textContent = `${score} / ${TOTAL_QUESTIONS}`;
}
