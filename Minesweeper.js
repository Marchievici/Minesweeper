var rows = 9;
var cols = 9;
var board = [];
var total_mines = 10;
var styleCell = "font-size: 30px; height: 60px; background-color: white; border: 1px solid black; text-align: center";

function start() {//create board
    var table = document.querySelector(".board");
    for (var i = 0; i < rows; i++) {
        board[i] = [];
        var row = document.createElement("div");
        table.append(row);
        for (var j = 0; j < cols; j++) {    
            var column = document.createElement("div");
            column.addEventListener("click", function() {
                whenClick(this.id); 
            }, {once: true}); 
            board[i][j] = " ";
            column.innerHTML = board[i][j];
            column.className = "element";
            column.setAttribute("id","" + i + j);
            row.append(column);  
        }
    }
    generateMines();
    putNumbers();
}


function generateMines() {
    var rand_elem = getRandomElements();
    var elements = document.querySelectorAll(".element");
    var k = 0;
    while (k < total_mines) {
        for (let ind = 0; ind < elements.length; ++ind) {
            if (rand_elem[k] == ind) {
                var id = elements[ind].id;
                var line = id[1];
                var col = id[0];
                board[line][col] = "m"; 
                var elem = document.getElementById(id);
                var mine = document.createElement("img");
                mine.src = "mine.png";
                mine.style.cssText = "width: 0px";
                mine.className += "mines";
                elem.appendChild(mine);
            } 
        }
        ++k;
    }     
}

function getRandomElements() {
    var result = [];
    for (var i = 0; i < total_mines; i++) {
        var rand = Math.floor(Math.random() * (rows * cols));
        if (result.includes(rand) == false) {
            result.push(rand); 
        } else {
            --i;
        }   
    }
    return result; 
}
   
function putNumbers() {
    for (let i = 0; i < rows; ++i) {
        for (let j = 0; j < cols; ++j) {
            var nr_mines = checkCellsArround(i, j);
            if (nr_mines > 0) {
                board[j][i] = nr_mines;
                var onBoard = document.getElementById("" + i + j);
                onBoard.innerHTML = nr_mines;
            }          
        }
    }
}

function checkCellsArround(i, j) {
    var cellsArround = [i > 0 && board[j][i - 1] == "m", i < cols - 1 && board[j][i + 1] == "m",
                    j < rows - 1 && board[j + 1][i] == "m", j > 0 && board[j - 1][i] == "m",
                    j < rows - 1 && i > 0 && board[j + 1][i - 1] == "m", i > 0 && j > 0 && board[j - 1][i - 1] == "m", 
                    j > 0 && i < cols - 1 && board[j - 1][i + 1] == "m", j < rows - 1 && i < cols - 1 && board[j + 1][i + 1] == "m"];
    var mines_arround = 0; 
    if (board[j][i] != "m") {
        for (let ind = 0; ind < cellsArround.length; ++ind) {
            if (cellsArround[ind] == true) {
                ++mines_arround;
            }
        }
    } 
    return mines_arround;
}

function whenClick(id) {
    var possible_numbers = [1, 2, 3, 4, 5, 6, 7, 8];
    var i, j;
    i = parseInt(id[0]);
    j = parseInt(id[1]);
    var elem = document.getElementById(id);
    var table = document.getElementById("table");
    if (board[j][i] == "m") {//if click on mine
        lost();
    } else if (possible_numbers.includes(board[j][i])) {//if click on numbers
        elem.style.cssText = styleCell;
        checkWin();
    } else {//if I click on empty cell
        checkArround(i, j, id);  
    }
}

function checkArround(i, j, id) {
    var empty_cells = [];
    empty_cells[0] = id;
    for (ind = 0; ind < empty_cells.length; ++ind) {
        i = parseInt(empty_cells[ind][0]);
        j = parseInt(empty_cells[ind][1]);
        elem = document.getElementById("" + i + j);
        elem.style.cssText = styleCell;
        var verifyExtremities = [i > 0, i < cols - 1, j < rows - 1, j > 0, j < rows - 1 && i > 0,
            i > 0 && j > 0, j > 0 && i < cols - 1, j < rows - 1 && i < cols - 1];
        var elementsArround = [[i - 1, j], [i + 1, j], [i, j + 1], [i, j - 1], [i - 1, j + 1],
            [i - 1, j - 1], [i + 1, j - 1], [i + 1, j + 1]];
        for (index = 0; index < verifyExtremities.length; ++index) {
            if (verifyExtremities[index] == true) {
                var aux_i = elementsArround[index][0]; 
                var aux_j = elementsArround[index][1];
                var current_elem = document.getElementById("" + aux_i + aux_j);
                var fontSize = window.getComputedStyle(current_elem, null).getPropertyValue('font-size');
                if (board[aux_j][aux_i] == " " && fontSize == "0px" && empty_cells.includes("" + aux_i + aux_j) == false) {
                    empty_cells.push("" + aux_i + aux_j)
                } else if (fontSize == "0px") {             
                    current_elem.style.cssText = styleCell;
                }
            }   
        }
        checkWin();
    }
}

function checkWin() {
    var needed_to_win = rows * cols - total_mines;
    var counter_revealed_cells = 0;
    document.querySelectorAll(".element").forEach(function(element) {
        var fontSize = window.getComputedStyle(element, null).getPropertyValue('font-size');
        if (fontSize == "30px") {
            ++counter_revealed_cells;
            if (needed_to_win == counter_revealed_cells) {
                document.getElementById("WinOrLost").innerHTML = "Congrats, you won!! :)";
                var buton = document.querySelector(".btn-reset");
                buton.style.visibility = "visible"; 
            }
        }    
    }); 
}

function lost() {
        document.getElementById("WinOrLost").innerHTML = "You lost, try again!";
        document.querySelectorAll('.mines').forEach(function(element) {
          element.style.cssText = "width: 58px; height: 58px";
        });
        table.style.cssText = "font-size: 30px; background-color: white";
        var buton = document.querySelector(".btn-reset");
        buton.style.visibility = "visible";
}
