// ── Card Data (4 pairs = 8 cards) ──
const EMOJIS = ['🐶', '🐱', '🦊', '🐼'];

// ── DOM Elements ──
const grid = document.getElementById('card-grid');
const moveCountEl = document.getElementById('move-count');
const pairCountEl = document.getElementById('pair-count');
const restartBtn = document.getElementById('restart-btn');
const winOverlay = document.getElementById('win-overlay');
const finalMovesEl = document.getElementById('final-moves');
const playAgainBtn = document.getElementById('play-again-btn');

// ── Game State ──
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let isLocked = false; // prevent clicks during check

// ── Shuffle (Fisher-Yates) ──
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ── Create Card Element ──
function createCardElement(emoji, index) {
  const card = document.createElement('article');
  card.classList.add('card');
  card.dataset.emoji = emoji;
  card.dataset.index = index;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', 'Memory card');
  card.setAttribute('tabindex', '0');

  card.innerHTML = `
    <div class="card-inner">
      <div class="card-face card-back"></div>
      <div class="card-face card-front">${emoji}</div>
    </div>
  `;

  card.addEventListener('click', () => flipCard(card));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      flipCard(card);
    }
  });

  return card;
}

// ── Initialize / Reset Game ──
function initGame() {
  // Reset state
  flippedCards = [];
  matchedPairs = 0;
  moves = 0;
  isLocked = false;
  moveCountEl.textContent = '0';
  pairCountEl.textContent = '0';
  winOverlay.hidden = true;

  // Build & shuffle deck
  const deck = shuffle([...EMOJIS, ...EMOJIS]);

  // Clear grid & render cards
  grid.innerHTML = '';
  cards = deck.map((emoji, i) => {
    const cardEl = createCardElement(emoji, i);
    grid.appendChild(cardEl);
    return cardEl;
  });
}

// ── Flip Card ──
function flipCard(card) {
  // Guard: ignore invalid clicks
  if (
    isLocked ||
    card.classList.contains('flipped') ||
    card.classList.contains('matched') ||
    flippedCards.length >= 2
  ) {
    return;
  }

  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    moves++;
    moveCountEl.textContent = moves;
    checkMatch();
  }
}

// ── Check Match ──
function checkMatch() {
  const [card1, card2] = flippedCards;
  const isMatch = card1.dataset.emoji === card2.dataset.emoji;

  if (isMatch) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    matchedPairs++;
    pairCountEl.textContent = matchedPairs;
    flippedCards = [];

    if (matchedPairs === EMOJIS.length) {
      setTimeout(showWin, 600);
    }
  } else {
    isLocked = true;
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      flippedCards = [];
      isLocked = false;
    }, 800);
  }
}

// ── Show Win Screen ──
function showWin() {
  finalMovesEl.textContent = moves;
  winOverlay.hidden = false;
}

// ── Event Listeners ──
restartBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);

// ── Start Game ──
initGame();
