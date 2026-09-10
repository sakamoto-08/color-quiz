// クイズ用カラーデータセット（全カテゴリ4色ずつに統一）
const COLOR_DATA = [
  // 赤・ピンク系（4色）
  { name: "レッド", rgb: "rgb(255, 0, 0)", category: "red" },
  { name: "マゼンタ", rgb: "rgb(255, 0, 255)", category: "red" },
  { name: "ピンク", rgb: "rgb(255, 192, 203)", category: "red" },
  { name: "ローズ", rgb: "rgb(255, 0, 128)", category: "red" },

  // 青・シアン系（4色）
  { name: "シアン", rgb: "rgb(0, 255, 255)", category: "blue" },
  { name: "ターコイズ", rgb: "rgb(64, 224, 208)", category: "blue" },
  { name: "ブルー", rgb: "rgb(0, 0, 255)", category: "blue" },
  { name: "スカイブルー", rgb: "rgb(135, 206, 235)", category: "blue" },

  // オレンジ・ブラウン・黄系（4色）
  { name: "ブラウン", rgb: "rgb(139, 69, 19)", category: "brown" },
  { name: "オレンジ", rgb: "rgb(255, 165, 0)", category: "brown" },
  { name: "イエロー", rgb: "rgb(255, 255, 0)", category: "brown" },
  { name: "アンバー", rgb: "rgb(255, 191, 0)", category: "brown" },

  // 白・グレー系（4色）
  { name: "グレー", rgb: "rgb(128, 128, 128)", category: "gray" },
  { name: "アイボリー", rgb: "rgb(255, 255, 240)", category: "gray" },
  { name: "シルバー", rgb: "rgb(192, 192, 192)", category: "gray" },
  { name: "ホワイト", rgb: "rgb(245, 245, 245)", category: "gray" },

  // 緑系（4色）
  { name: "グリーン", rgb: "rgb(0, 128, 0)", category: "green" },
  { name: "ライムグリーン", rgb: "rgb(50, 205, 50)", category: "green" },
  { name: "オリーブ", rgb: "rgb(128, 128, 0)", category: "green" },
  { name: "ミントグリーン", rgb: "rgb(152, 255, 204)", category: "green" },
];

let currentQuestion = 0;
let score = 0;
const TOTAL_QUESTIONS = 10;
let quizQuestions = [];

// DOM要素の取得
const progressEl = document.getElementById("progress");
const colorPanelEl = document.getElementById("color-panel");
const feedbackEl = document.getElementById("feedback");
const optionsContainerEl = document.getElementById("options-container");
const quizScreenEl = document.getElementById("quiz-screen");
const resultScreenEl = document.getElementById("result-screen");
const finalScoreEl = document.getElementById("final-score");
const restartBtn = document.getElementById("restart-btn");

// 配列をシャッフルする関数
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// クイズの初期化
function initQuiz() {
  currentQuestion = 0;
  score = 0;
  quizQuestions = shuffleArray(COLOR_DATA).slice(0, TOTAL_QUESTIONS);

  quizScreenEl.classList.remove("hidden");
  resultScreenEl.classList.add("hidden");

  loadQuestion();
}

// 選択肢の生成ロジック（安全な同系色優先処理）
function generateOptions(correctAnswer) {
  // 正解以外のすべての選択肢候補
  const otherColors = COLOR_DATA.filter(
    (item) => item.name !== correctAnswer.name,
  );

  // 同系色とそれ以外に分ける
  const sameCategory = shuffleArray(
    otherColors.filter((item) => item.category === correctAnswer.category),
  );
  const diffCategory = shuffleArray(
    otherColors.filter((item) => item.category !== correctAnswer.category),
  );

  // 同系色を優先してまとめ、3つ抽出する
  const candidates = [...sameCategory, ...diffCategory];
  const selectedDummies = candidates.slice(0, 3);

  // 正解を入れて4択にし、シャッフル
  return shuffleArray([correctAnswer, ...selectedDummies]);
}

// 問題の読み込み
function loadQuestion() {
  feedbackEl.textContent = "";
  colorPanelEl.className = "color-panel";

  const currentData = quizQuestions[currentQuestion];
  progressEl.textContent = `第 ${currentQuestion + 1} / ${TOTAL_QUESTIONS} 問`;
  colorPanelEl.style.backgroundColor = currentData.rgb;

  optionsContainerEl.innerHTML = "";
  const options = generateOptions(currentData);

  options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "option-btn";
    button.textContent = option.name;
    button.addEventListener("click", () =>
      handleAnswer(option.name, currentData.name),
    );
    optionsContainerEl.appendChild(button);
  });
}

// 回答処理
function handleAnswer(selectedName, correctName) {
  const buttons = optionsContainerEl.querySelectorAll(".option-btn");
  buttons.forEach((btn) => (btn.disabled = true));

  if (selectedName === correctName) {
    score++;
    feedbackEl.textContent = "〇 正解！";
    feedbackEl.className = "feedback-text correct";
    colorPanelEl.classList.add("correct");
  } else {
    feedbackEl.textContent = `× 不正解... (正解: ${correctName})`;
    feedbackEl.className = "feedback-text incorrect";
    colorPanelEl.classList.add("incorrect");
  }

  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < TOTAL_QUESTIONS) {
      loadQuestion();
    } else {
      showResult();
    }
  }, 1200);
}

// 結果画面表示
function showResult() {
  quizScreenEl.classList.add("hidden");
  resultScreenEl.classList.remove("hidden");
  finalScoreEl.textContent = `${score} / ${TOTAL_QUESTIONS}`;
}

// リスタートイベント
restartBtn.addEventListener("click", initQuiz);

// アプリ開始
initQuiz();
