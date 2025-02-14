document.addEventListener("DOMContentLoaded", () => {
  // Referințe
  const startBtn       = document.getElementById("startBtn");
  const puzzle1        = document.getElementById("puzzle1");
  const puzzle1Grid    = document.getElementById("puzzle1Grid");
  const puzzle1Message = document.getElementById("puzzle1Message");
  const btnPuzzle1Done = document.getElementById("btnPuzzle1Done");

  const puzzle2        = document.getElementById("puzzle2");
  const memoryGame     = document.getElementById("memory-game");
  const puzzle2Message = document.getElementById("puzzle2Message");
  const btnPuzzle2Done = document.getElementById("btnPuzzle2Done");

  const finalMessage   = document.getElementById("finalMessage");
  const yesBtn         = document.getElementById("yesBtn");
  const noBtn          = document.getElementById("noBtn");
  const pupicMsg       = document.getElementById("pupicMessage");

  // =============================
  //      Puzzle 4×4 - Drag Real
  // =============================
  const rows = 4;
  const cols = 4;
  const correctOrder = [...Array(rows*cols).keys()]; // [0..15]
  let puzzle1Order   = [...correctOrder];            // amestecăm
  let tileWidth  = 80; // puzzle 320 => 80 px per tile
  let tileHeight = 80;

  let draggedTile = null;
  let offsetX = 0, offsetY = 0; // offset de la colțul tile-ului
  let startZIndex = 1; // tile-ul care e ridicat iese deasupra
  let draggedPos = null; // indexul din puzzle1Order

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
    // creează tile-uri conform puzzle1Order
    puzzle1Order.forEach((tileIndex, i) => {
      const tileEl = document.createElement("div");
      tileEl.classList.add("tile");
      // Poziție "corectă" în imagine (tileIndex)
      const row = Math.floor(tileIndex / cols);
      const col = tileIndex % cols;
      tileEl.style.backgroundPosition = `-${col * tileWidth}px -${row * tileHeight}px`;
      // Poziție actuală (i)
      const currentRow = Math.floor(i / cols);
      const currentCol = i % cols;
      tileEl.style.left = (currentCol * tileWidth) + "px";
      tileEl.style.top  = (currentRow * tileHeight) + "px";

      tileEl.dataset.indexPuzzleOrder = i;       // indexul unde e plasat
      tileEl.dataset.tileIndex        = tileIndex; // 0..15 (identifică bucata)

      // Pointer events
      tileEl.addEventListener("pointerdown", onPointerDown);
      puzzle1Grid.appendChild(tileEl);
    });
  }

  function onPointerDown(e) {
    draggedTile = e.currentTarget;
    // indexul din puzzle1Order
    draggedPos = parseInt(draggedTile.dataset.indexPuzzleOrder);

    // calcul offset față de colțul stânga-sus al tile-ului
    const tileRect = draggedTile.getBoundingClientRect();
    offsetX = e.clientX - tileRect.left;
    offsetY = e.clientY - tileRect.top;

    // ridicăm tile-ul deasupra
    startZIndex++;
    draggedTile.style.zIndex = startZIndex;

    // ascultăm pointermove + pointerup
    draggedTile.setPointerCapture(e.pointerId);
    draggedTile.addEventListener("pointermove", onPointerMove);
    draggedTile.addEventListener("pointerup", onPointerUp);
  }

  function onPointerMove(e) {
    // Mutăm tile-ul după cursor
    const containerRect = puzzle1Grid.getBoundingClientRect();
    const newLeft = e.clientX - containerRect.left - offsetX;
    const newTop  = e.clientY - containerRect.top  - offsetY;

    draggedTile.style.left = newLeft + "px";
    draggedTile.style.top  = newTop + "px";
  }

  function onPointerUp(e) {
    // scoatem listenerii
    draggedTile.removeEventListener("pointermove", onPointerMove);
    draggedTile.removeEventListener("pointerup", onPointerUp);

    // găsim tile-ul sub pointer
    const elUnder = document.elementFromPoint(e.clientX, e.clientY);

    if (elUnder && elUnder.classList.contains("tile") && elUnder !== draggedTile) {
      // indexul tile-ului țintă
      const targetPos = parseInt(elUnder.dataset.indexPuzzleOrder);

      // facem swap în puzzle1Order
      [puzzle1Order[draggedPos], puzzle1Order[targetPos]] =
        [puzzle1Order[targetPos], puzzle1Order[draggedPos]];

      renderPuzzle1();
      checkPuzzle1Solved();
    } else {
      // dacă n-am dat drumul peste alt tile, reîncadrăm piesa la loc
      // doar refacem tot puzzle-ul, piesa revine la poziția inițială
      renderPuzzle1();
    }

    draggedTile = null;
    offsetX = 0; offsetY = 0;
    draggedPos = null;
  }

  function checkPuzzle1Solved() {
    // dacă puzzle1Order coincide cu correctOrder => rezolvat
    for (let i = 0; i < puzzle1Order.length; i++) {
      if (puzzle1Order[i] !== correctOrder[i]) return;
    }
    puzzle1Message.classList.remove("hidden");
    btnPuzzle1Done.classList.remove("hidden");
  }

  btnPuzzle1Done.addEventListener("click", () => {
    puzzle1.classList.add("hidden");
    puzzle2.classList.remove("hidden");
    initPuzzle2();
  });

  // =============================
  //      Memory 4×4
  // =============================
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
  let firstCard = null;
  let lockBoard = false;
  let pairsFound = 0;
  const totalPairs = cardImages.length; // 8

  function initPuzzle2() {
    puzzle2Message.classList.add("hidden");
    btnPuzzle2Done.classList.add("hidden");
    firstCard = null; 
    lockBoard = false; 
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

  // =============================
  //     Final + inimioare
  // =============================
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

  // ============================
  // Funcție amestecare array
  // ============================
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
});
