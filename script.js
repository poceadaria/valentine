document.addEventListener("DOMContentLoaded", () => {
  // ======================================
  //           REFERINȚE HTML
  // ======================================
  const startBtn       = document.getElementById("startBtn");

  // Puzzle 4x4
  const puzzle1        = document.getElementById("puzzle1");
  const puzzle1Grid    = document.getElementById("puzzle1Grid");
  const puzzle1Message = document.getElementById("puzzle1Message");
  const btnPuzzle1Done = document.getElementById("btnPuzzle1Done");

  // Memory
  const puzzle2        = document.getElementById("puzzle2");
  const memoryGame     = document.getElementById("memory-game");
  const puzzle2Message = document.getElementById("puzzle2Message");
  const btnPuzzle2Done = document.getElementById("btnPuzzle2Done");

  // Final
  const finalMessage   = document.getElementById("finalMessage");
  const yesBtn         = document.getElementById("yesBtn");
  const noBtn          = document.getElementById("noBtn");
  const pupicMsg       = document.getElementById("pupicMessage");

  // ======================================
  //  PUZZLE 4×4 - DRAG REAL, RESPONSIVE
  // ======================================
  const rows = 4;
  const cols = 4;
  const correctOrder = Array.from({ length: rows*cols }, (_, i) => i); // [0..15]
  let puzzle1Order   = [...correctOrder]; // amestecăm

  // Variabile pentru drag
  let draggedTile = null;
  let draggedPos  = null;
  let offsetX     = 0;
  let offsetY     = 0;
  let zIndexCount = 1; // ca să aducem piesa deasupra celorlalte

  startBtn.addEventListener("click", () => {
    startBtn.classList.add("hidden");
    puzzle1.classList.remove("hidden");
    initPuzzle1();
  });

  function initPuzzle1() {
    puzzle1Message.classList.add("hidden");
    btnPuzzle1Done.classList.add("hidden");
    shuffleArray(puzzle1Order);
    renderPuzzle1();
  }

  function renderPuzzle1() {
    puzzle1Grid.innerHTML = "";

    // Aflăm dimensiunea reală a containerului puzzle, ex. 300px sau 320px
    const containerSize = puzzle1Grid.clientWidth; 
    // Fiecare tile => 1/4 din container
    const tileSize = containerSize / 4;

    // Pentru fiecare index i (0..15), generăm o piesă
    puzzle1Order.forEach((tileIndex, i) => {
      // tileIndex = care bucată din imagine (0..15)
      const tileEl = document.createElement("div");
      tileEl.classList.add("tile");

      // "tileIndex" => rândul și coloana în imagine
      const imgRow = Math.floor(tileIndex / cols); 
      const imgCol = tileIndex % cols;
      tileEl.style.backgroundPosition = `${imgCol * 25}% ${imgRow * 25}%`;

      // Poziționarea curentă (i) => pe rândul i/4, col i%4
      const row = Math.floor(i / cols);
      const col = i % cols;

      tileEl.style.width  = tileSize + "px";
      tileEl.style.height = tileSize + "px";
      tileEl.style.left   = (col * tileSize) + "px";
      tileEl.style.top    = (row * tileSize) + "px";

      // Ca să știm pe care loc se află tile-ul
      tileEl.dataset.currentPos = i;       // indexul puzzle1Order
      tileEl.dataset.tileIndex  = tileIndex;

      // Evenimente pointer
      tileEl.addEventListener("pointerdown", (e) => {
        onPointerDownPuzzle(e, tileSize);
      });

      puzzle1Grid.appendChild(tileEl);
    });
  }

  function onPointerDownPuzzle(e, tileSize) {
    draggedTile = e.currentTarget;
    draggedPos  = parseInt(draggedTile.dataset.currentPos);

    // Luăm offsetul (diferența) față de colțul stânga-sus al piesei
    const rect = draggedTile.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    // Punem piesa deasupra
    zIndexCount++;
    draggedTile.style.zIndex = zIndexCount;

    // Capturăm pointerul
    draggedTile.setPointerCapture(e.pointerId);

    // Adăugăm listeneri
    draggedTile.addEventListener("pointermove", onPointerMovePuzzle);
    draggedTile.addEventListener("pointerup", onPointerUpPuzzle);
  }

  function onPointerMovePuzzle(e) {
    // Mișcăm piesa sub deget
    const gridRect = puzzle1Grid.getBoundingClientRect();
    const newLeft  = e.clientX - gridRect.left - offsetX;
    const newTop   = e.clientY - gridRect.top  - offsetY;

    draggedTile.style.left = newLeft + "px";
    draggedTile.style.top  = newTop + "px";
  }

  function onPointerUpPuzzle(e) {
    // Scoatem listenerii
    draggedTile.removeEventListener("pointermove", onPointerMovePuzzle);
    draggedTile.removeEventListener("pointerup", onPointerUpPuzzle);

    const elUnder = document.elementFromPoint(e.clientX, e.clientY);
    if (elUnder && elUnder.classList.contains("tile") && elUnder !== draggedTile) {
      // Indexul unde e tile-ul sub pointer
      const targetPos = parseInt(elUnder.dataset.currentPos);

      // Swap in puzzle1Order
      [puzzle1Order[draggedPos], puzzle1Order[targetPos]] =
        [puzzle1Order[targetPos], puzzle1Order[draggedPos]];

      renderPuzzle1();
      checkPuzzle1Solved();
    } else {
      // Dacă nu e altă piesă sub pointer, readucem piesa la poziția inițială
      renderPuzzle1();
    }

    // Reset
    draggedTile = null;
    draggedPos  = null;
    offsetX     = 0;
    offsetY     = 0;
  }

  function checkPuzzle1Solved() {
    for (let i = 0; i < puzzle1Order.length; i++) {
      if (puzzle1Order[i] !== correctOrder[i]) return;
    }
    // Gata puzzle
    puzzle1Message.classList.remove("hidden");
    btnPuzzle1Done.classList.remove("hidden");
  }

  btnPuzzle1Done.addEventListener("click", () => {
    puzzle1.classList.add("hidden");
    puzzle2.classList.remove("hidden");
    initPuzzle2();
  });

  // ======================================
  //            MEMORY 4×4
  // ======================================
  const cardImages = [
    "https://cdn-icons-png.flaticon.com/512/2107/2107952.png",
    "https://cdn-icons-png.flaticon.com/512/138/138533.png",
    "https://cdn-icons-png.flaticon.com/512/1077/1077035.png",
    "https://cdn-icons-png.flaticon.com/512/786/786432.png",
    "https://cdn-icons-png.flaticon.com/512/1256/1256650.png",
    "https://cdn-icons-png.flaticon.com/512/7421/7421739.png",
    "https://cdn-icons-png.flaticon.com/512/2589/2589175.png",
    "https://cdn-icons-png.flaticon.com/512/2659/2659980.png"
  ];
  let memoryCards = [...cardImages, ...cardImages];
  let firstCard  = null;
  let lockBoard  = false;
  let pairsFound = 0;
  const totalPairs = cardImages.length; // 8

  function initPuzzle2() {
    puzzle2Message.classList.add("hidden");
    btnPuzzle2Done.classList.add("hidden");
    firstCard  = null;
    lockBoard  = false;
    pairsFound = 0;

    shuffleArray(memoryCards);
    renderMemoryGame();
  }

  function renderMemoryGame() {
    memoryGame.innerHTML = "";
    memoryCards.forEach((imgSrc) => {
      const card = document.createElement("div");
      card.classList.add("card");

      const front = document.createElement("div");
      front.classList.add("front");
      const frontImg = document.createElement("img");
      frontImg.src = imgSrc;
      frontImg.style.width = "40px";
      frontImg.style.height = "40px";
      front.appendChild(frontImg);

      const back = document.createElement("div");
      back.classList.add("back");
      back.textContent = "?";

      card.appendChild(front);
      card.appendChild(back);
      card.addEventListener("click", () => flipCard(card));

      memoryGame.appendChild(card);
    });
  }

  function flipCard(card) {
    if (lockBoard) return;
    if (card.classList.contains("flipped")) return;

    card.classList.add("flipped");

    if (!firstCard) {
      firstCard = card;
      return;
    }
    checkMatch(firstCard, card);
  }

  function checkMatch(card1, card2) {
    const img1 = card1.querySelector(".front img").src;
    const img2 = card2.querySelector(".front img").src;

    if (img1 === img2) {
      pairsFound++;
      firstCard = null;
      if (pairsFound === totalPairs) {
        puzzle2Message.classList.remove("hidden");
        btnPuzzle2Done.classList.remove("hidden");
      }
    } else {
      lockBoard = true;
      setTimeout(() => {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        firstCard = null;
        lockBoard = false;
      }, 800);
    }
  }

  btnPuzzle2Done.addEventListener("click", () => {
    puzzle2.classList.add("hidden");
    finalMessage.classList.remove("hidden");
  });

  // ======================================
  //        FINAL: DA / NU
  // ======================================
  yesBtn.addEventListener("click", () => {
    startHeartsAnimation();
    pupicMsg.textContent = "Bravo, ai câștigat un pupic și un muiuț!";
    pupicMsg.classList.remove("hidden");
  });

  let scaleFactor = 1;
  noBtn.addEventListener("click", () => {
    scaleFactor += 0.1;
    yesBtn.style.transform = `scale(${scaleFactor})`;
  });

  // Animația inimioarelor
  function startHeartsAnimation() {
    const heartsContainer = document.getElementById("hearts-container");
    setInterval(() => {
      const heart = document.createElement("div");
      heart.innerHTML = "&#10084;";
      heart.style.position = "absolute";
      heart.style.fontSize = `${Math.floor(Math.random() * 20) + 20}px`;
      heart.style.color = "red";
      heart.style.left = Math.random() * 100 + "%";
      heart.style.top = "-50px";
      heart.style.animation = "fall 3s linear";

      heartsContainer.appendChild(heart);
      setTimeout(() => {
        heartsContainer.removeChild(heart);
      }, 3000);
    }, 300);
  }

  // Funcție de amestecare
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
});
