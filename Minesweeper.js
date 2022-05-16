"use strict";
const row = 9;
const col = 9;
const mines = 10;
const boxes = [];
const needed_to_win = row * col - mines;
const board = document.querySelector(".board");

const createBoard = function () {
  const htmlText = `<div class="d-flex">
      <div class="cel"></div>
      <div class="cel"></div>
      <div class="cel"></div>
      <div class="cel"></div>
      <div class="cel"></div>
      <div class="cel"></div>
      <div class="cel"></div>
      <div class="cel"></div>
      <div class="cel"></div>
    </div>`;
  for (let i = 0; i < 9; ++i) {
    board.insertAdjacentHTML("beforeend", htmlText);
  }
};
createBoard();

const getRandomBoxes = function () {
  const idList = [...document.querySelectorAll(".cel")].map((elem) => elem.id);
  const randomBoxes = [];
  while (randomBoxes.length < mines) {
    const randomPosId = Math.trunc(Math.random() * 81);
    randomBoxes.includes(idList[randomPosId])
      ? randomBoxes
      : randomBoxes.push(idList[randomPosId]);
  }
  return randomBoxes;
};

const placeMines = function (randomBoxes) {
  randomBoxes.forEach((box) => {
    const elem = document.getElementById(`${box}`);
    const mine = document.createElement("img");
    mine.src = "./assets/mine.png";
    mine.style.width = "0px";
    elem.appendChild(mine);
    elem.classList.add("mine");
  });
};

const showFlagOnRClick = function (box, flag) {
  box.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    flag.classList.remove("hide-flag");
    flag.classList.add("show-flag");
  });
};

const placeFlagsHidden = function () {
  [...document.querySelectorAll(".cel")].forEach((box) => {
    const flag = document.createElement("img");
    flag.src = "./assets/flag.png";
    box.appendChild(flag);
    flag.classList.add("hide-flag");
    showFlagOnRClick(box, flag);
  });
};

const hideFlags = function (cel) {
  if (cel) {
    cel.children[0].classList.remove("show-flag");
    cel.children[0].classList.add("hide-flag");
  } else {
    [...document.querySelectorAll(".show-flag")].forEach((box) => {
      box.style.width = "0px";
    });
  }
};

const countMinesAround = function (i, j) {
  const cellsAround = [
    j > 0 && boxes[i][j - 1].classList.contains("mine"),
    j < col - 1 && boxes[i][j + 1].classList.contains("mine"),
    i < row - 1 && boxes[i + 1][j].classList.contains("mine"),
    i > 0 && boxes[i - 1][j].classList.contains("mine"),
    i < row - 1 && j > 0 && boxes[i + 1][j - 1].classList.contains("mine"),
    j > 0 && i > 0 && boxes[i - 1][j - 1].classList.contains("mine"),
    i > 0 && j < col - 1 && boxes[i - 1][j + 1].classList.contains("mine"),
    i < row - 1 &&
      j < col - 1 &&
      boxes[i + 1][j + 1].classList.contains("mine"),
  ];
  let mines_around = 0;
  for (let ind = 0; ind < cellsAround.length; ++ind) {
    if (cellsAround[ind] === true) {
      ++mines_around;
    }
  }
  return mines_around;
};

const placeNumbers = function () {
  boxes.forEach((row, i) => {
    row.forEach((box, j) => {
      if (!box.classList.contains("mine")) {
        box.textContent = countMinesAround(i, j);
        box.classList.add("hide-content");
      }
    });
  });
};

const setBtnVisible = function () {
  const button = document.querySelector(".btn");
  button.style.visibility = "visible";
  button.addEventListener("click", function (e) {
    e.preventDefault();
    location.reload();
  });
};

const lost = function () {
  document.getElementById("WorL").textContent = "L 😔, try again! 🤙";
  [...document.querySelectorAll(".cel")].forEach((box) => {
    box.classList.contains("mine")
      ? (box.children[0].style.width = "100%")
      : box.classList.add("show-content");
  });
  hideFlags();
  setBtnVisible();
};

const checkWin = function () {
  let counter_revealed_cells = 0;
  [...document.querySelectorAll(".cel")].forEach((box) => {
    if (box.classList.contains("show-content")) {
      ++counter_revealed_cells;
    }
  });
  if (needed_to_win === counter_revealed_cells) {
    document.getElementById("WorL").textContent = "Congrats, you won! 🎉🎉🎉";
    setBtnVisible();
  }
};

const checkForEmptyCells = function (boxId) {
  const empty_cells = [boxId];
  for (let ind = 0; ind < empty_cells.length; ++ind) {
    const i = Number(empty_cells[ind][0]);
    const j = Number(empty_cells[ind][1]);
    const box = document.getElementById(empty_cells[ind]);
    box.classList.add("show-content");
    hideFlags(box);
    const verifyExtremities = [
      i > 0,
      i < col - 1,
      j < row - 1,
      j > 0,
      j < row - 1 && i > 0,
      i > 0 && j > 0,
      j > 0 && i < col - 1,
      j < row - 1 && i < col - 1,
    ];
    const boxesArround = [
      [i - 1, j],
      [i + 1, j],
      [i, j + 1],
      [i, j - 1],
      [i - 1, j + 1],
      [i - 1, j - 1],
      [i + 1, j - 1],
      [i + 1, j + 1],
    ];
    for (let index = 0; index < verifyExtremities.length; ++index) {
      if (verifyExtremities[index] === true) {
        const aux_i = boxesArround[index][0];
        const aux_j = boxesArround[index][1];
        const current_box = document.getElementById("" + aux_i + aux_j);
        const fontSize = window
          .getComputedStyle(current_box, null)
          .getPropertyValue("font-size");
        if (
          boxes[aux_i][aux_j].textContent === "0" &&
          fontSize === "0px" &&
          empty_cells.includes("" + aux_i + aux_j) === false
        ) {
          empty_cells.push("" + aux_i + aux_j);
          checkWin();
        } else {
          current_box.classList.add("show-content");
          hideFlags(current_box);
        }
      }
    }
    checkWin();
  }
};

const whenUserClickBox = function () {
  boxes.forEach((row, i) => {
    row.forEach((box, j) => {
      box.addEventListener("click", function () {
        if (box.classList.contains("mine")) {
          lost();
        } else if (box.textContent === String(0)) {
          checkForEmptyCells(box.id);
        } else {
          box.classList.add("show-content");
          hideFlags(box);
          checkWin();
        }
      });
    });
  });
};

const fillBoard = function () {
  const initElems = [...document.querySelectorAll(".cel")];
  while (initElems.length) boxes.push(initElems.splice(0, 9));
  boxes.forEach((row, i) => {
    row.forEach((box, j) => {
      box.id = i + "" + j;
    });
  });
  placeMines(getRandomBoxes());
  placeNumbers();
  placeFlagsHidden();
  whenUserClickBox();
};
fillBoard();
