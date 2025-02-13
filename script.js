document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBtn");
  const puzzle1 = document.getElementById("puzzle1");
  const puzzle1Grid = document.getElementById("puzzle1Grid");
  const puzzle1Message = document.getElementById("puzzle1Message");
  const btnPuzzle1Done = document.getElementById("btnPuzzle1Done");

  const puzzle2 = document.getElementById("puzzle2");
  const memoryGame = document.getElementById("memory-game");
  const puzzle2Message = document.getElementById("puzzle2Message");
  const btnPuzzle2Done = document.getElementById("btnPuzzle2Done");

  const finalMessage = document.getElementById("finalMessage");
  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");
  const pupicMsg = document.getElementById("pupicMessage");

  // =========================
  //  JOC 1: PUZZLE 4×4
  // =========================
  const rows = 4;
  const cols = 4;
  const totalTiles = rows * cols;
  const correctOrder = Array.from({ length: totalTiles }, (_, i) => i);
  let puzzle1Order = [...correctOrder];

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

      const row = Math.floor(tileIndex / cols);
      const col = tileIndex % cols;
      tileEl.style.backgroundPosition = `-${col * 80}px -${row * 80}px`;

      tileEl.dataset.index = i;

      tileEl.setAttribute("draggable", "true");
      tileEl.addEventListener("dragstart", onDragStart);
      tileEl.addEventListener("dragover", onDragOver);
      tileEl.addEventListener("drop", onDrop);

      tileEl.addEventListener("touchstart", onTouchStart);
      tileEl.addEventListener("touchmove", onTouchMove);
      tileEl.addEventListener("touchend", onTouchEnd);

      puzzle1Grid.appendChild(tileEl);
    });
  }

  let draggedTile = null;
  let targetTile = null;

  function onDragStart(e) {
    draggedTile = e.target;
  }
  function onDragOver(e) {
    e.preventDefault();
  }
  function onDrop(e) {
    e.preventDefault();
    targetTile = e.target;
    swapTiles();
  }

  function onTouchStart(e) {
    draggedTile = e.target;
  }
  function onTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element && element.classList.contains("tile")) {
      targetTile = element;
    }
  }
  function onTouchEnd() {
    if (draggedTile && targetTile) {
      swapTiles();
    }
  }

  function swapTiles() {
    if (!draggedTile || !targetTile) return;
    const index1 = draggedTile.dataset.index;
    const index2 = targetTile.dataset.index;
    [puzzle1Order[index1], puzzle1Order[index2]] = [puzzle1Order[index2], puzzle1Order[index1]];
    draggedTile = null;
    targetTile = null;
    renderPuzzle1();
    checkPuzzle1Solved();
  }

  function checkPuzzle1Solved() {
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

  // =========================
  //  JOC 2: MEMORY 4×4
  // =========================
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

  function initPuzzle2() {
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
    if (card1.querySelector(".front img").src === card2.querySelector(".front img").src) {
      pairsFound++;
      firstCard = null;
      if (pairsFound === cardImages.length) {
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

  // =========================
  //  Mesaj final (DA/NU)
  // =========================
  yesBtn.addEventListener("click", () => {
    pupicMsg.textContent = "Bravo, ai câștigat un pupic și un muiuț!";
    pupicMsg.classList.remove("hidden");
  });

  noBtn.addEventListener("click", () => {
    yesBtn.style.transform = `scale(${parseFloat(yesBtn.style.transform.replace("scale(", "").replace(")", "")) + 0.1})`;
  });

  function shuffleArray(arr) {
    arr.sort(() => Math.random() - 0.5);
  }
});
