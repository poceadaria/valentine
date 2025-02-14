document.addEventListener("DOMContentLoaded", () => {
  // Referințe la elementele HTML
  const startBtn       = document.getElementById("startBtn");

  // Puzzle 1
  const puzzle1        = document.getElementById("puzzle1");
  const puzzle1Grid    = document.getElementById("puzzle1Grid");
  const puzzle1Message = document.getElementById("puzzle1Message");
  const btnPuzzle1Done = document.getElementById("btnPuzzle1Done");

  // Puzzle 2 (Memory)
  const puzzle2        = document.getElementById("puzzle2");
  const memoryGame     = document.getElementById("memory-game");
  const puzzle2Message = document.getElementById("puzzle2Message");
  const btnPuzzle2Done = document.getElementById("btnPuzzle2Done");

  // Mesaj final
  const finalMessage   = document.getElementById("finalMessage");
  const yesBtn         = document.getElementById("yesBtn");
  const noBtn          = document.getElementById("noBtn");
  const pupicMsg       = document.getElementById("pupicMessage"); // Elementul <p> unde afișăm "Bravo..."

  // =========================================
  //        JOC 1: Puzzle 4×4 Drag & Swap
  // =========================================
  const rows = 4;
  const cols = 4;
  const totalTiles = rows * cols; // 16
  // Ordinea corectă (0..15)
  const correctOrder = Array.from({ length: totalTiles }, (_, i) => i);
  let puzzle1Order = [...correctOrder];

  // Variabile pentru pointer events
  let draggedTile = null;
  let draggedPos  = null;

  // Butonul Start
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
    puzzle1Order.forEach((tileIndex, i) => {
      const tileEl = document.createElement("div");
      tileEl.classList.add("tile");

      // Poziția de fundal
      const row = Math.floor(tileIndex / cols);
      const col = tileIndex % cols;
      tileEl.style.backgroundPosition = `-${col * 80}px -${row * 80}px`;

      // Atribuim datele necesare
      tileEl.dataset.currentPos = i;       // indexul în puzzle1Order
      tileEl.dataset.tileIndex  = tileIndex; // 0..15 (poz. corectă)

      // Adăugăm evenimente pointer
      tileEl.addEventListener("pointerdown", onPointerDownPuzzle);

      puzzle1Grid.appendChild(tileEl);
    });
  }

  function onPointerDownPuzzle(e) {
    // Reținem tile-ul apăsat și poziția acestuia
    draggedTile = e.currentTarget;
    draggedPos  = parseInt(draggedTile.dataset.currentPos);

    // Capturăm evenimentul pointer ca să fim siguri că pointerup vine la noi
    draggedTile.setPointerCapture(e.pointerId);

    // Adăugăm pointerup pe tile (sau pe document) pentru a detecta unde ridică degetul
    draggedTile.addEventListener("pointerup", onPointerUpPuzzle);
  }

  function onPointerUpPuzzle(e) {
    // Scoatem listener-ul de pointerup
    e.currentTarget.removeEventListener("pointerup", onPointerUpPuzzle);

    // Determinăm elementul de sub coordonatele unde s-a ridicat degetul
    // e.clientX, e.clientY — coordonatele pointerului
    const targetElement = document.elementFromPoint(e.clientX, e.clientY);

    // Verificăm dacă am dat drumul deasupra altei piese (tile)
    if (targetElement && targetElement.classList.contains("tile")) {
      const targetPos = parseInt(targetElement.dataset.currentPos);

      if (targetPos !== draggedPos) {
        // Facem swap între piesele din puzzle1Order
        [puzzle1Order[draggedPos], puzzle1Order[targetPos]] =
          [puzzle1Order[targetPos], puzzle1Order[draggedPos]];

        // Reafișăm puzzle-ul
        renderPuzzle1();
        checkPuzzle1Solved();
      }
    }

    // Resetăm variabilele de drag
    draggedTile = null;
    draggedPos  = null;
  }

  function checkPuzzle1Solved() {
    for (let i = 0; i < puzzle1Order.length; i++) {
      if (puzzle1Order[i] !== correctOrder[i]) return;
    }
    // Dacă am ajuns aici, toate se potrivesc
    puzzle1Message.classList.remove("hidden");
    btnPuzzle1Done.classList.remove("hidden");
  }

  btnPuzzle1Done.addEventListener("click", () => {
    puzzle1.classList.add("hidden");
    puzzle2.classList.remove("hidden");
    initPuzzle2();
  });

  // =========================================
  //        JOC 2: Memory 4×4 (Inimioare)
  // =========================================
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

  // =========================================
  //        Mesaj final (Da / Nu)
  // =========================================
  let scaleFactor = 1;
  yesBtn.addEventListener("click", () => {
    // 1) Pornește inimioarele
    startHeartsAnimation();

    // 2) Afișează mesaj "Bravo, ai câștigat un pupic și un muiuț!"
    pupicMsg.textContent = "Bravo, ai câștigat un pupic și un muiuț!";
    pupicMsg.classList.remove("hidden");
  });

  noBtn.addEventListener("click", () => {
    scaleFactor += 0.1;
    yesBtn.style.transform = `scale(${scaleFactor})`;
  });

  function startHeartsAnimation() {
    const heartsContainer = document.getElementById("hearts-container");

    const intervalId = setInterval(() => {
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

  // =========================================
  //       Funcție de amestecare
  // =========================================
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
});
