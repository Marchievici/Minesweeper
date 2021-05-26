var rows = 9;
var cols = 9;
var board = [];
var total_bombs = 10;
var nr_elem = (rows - 1) * 10 + (cols - 1) + 1;
var position_bombs = [];
var needed_to_win = rows * cols - total_bombs;

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
            /*column.addEventListener("contextmenu", function() {
                putFlag(this.id);
            });*/
            board[i][j] = " ";
            column.innerHTML = board[i][j];
            column.className = "divs";
            column.style.cssText = "position: relative; border: 1px solid black; border-collapse: collapse; width: 60px; height: 60px; text-align: center";
            column.setAttribute("id", "" + i + j);
            row.append(column);  
        }
    }
    generateMines();
    putNumbers();
}


function generateMines() { 
    for (let ind = 1; ind <= total_bombs; ++ind) {
        var rand = Math.floor(Math.random() * nr_elem);
        if (position_bombs.includes(rand) == false && rand % 10 != 9) {//I make sure there aren't 9 in any number
            var id = getId(rand);
            var aux = document.getElementById(id);
            var mine = document.createElement("img");
            mine.src = "mine.png";
            mine.style.cssText = "width: 0px";
            mine.className += "mines";
            aux.appendChild(mine);
            position_bombs.push(rand);
        } else {
            --ind;
        }
    }
}

function getId(random) {
    var i, j;
    if (random < 10) {
        i = 0;
        j = random; 
        random = "" + i + j;
    } else {       
        i = Math.floor(random / 10);
        j = random % 10;
    }
    board[j][i] = "b";
    return random;
}
   
function putNumbers() {
    for (let i = 0; i < rows; ++i) {
        for (let j = 0; j < cols; ++j) {
            var nr_bombs = checkCellsArround(i, j);
            if (nr_bombs > 0) {
                board[j][i] = nr_bombs;
                var onBoard = document.getElementById("" + i + j);
                onBoard.innerHTML = nr_bombs;
            }          
        }
    }
}

function checkCellsArround(i, j) {
    if (board[j][i] != "b") {
        var bombs_around = 0;
        if (i > 0) {
            if (board[j][i - 1] == "b") {//stanga
                ++bombs_around;       
            }
        }
        
        if (i < cols - 1) {
            if (board[j][i + 1] == "b") {//dreapta
                ++bombs_around;
            }
        }
        
        if (j < cols - 1) {
            if (board[j + 1][i] == "b") {//jos
                ++bombs_around;
            } 
        }
        
        if (j > 0) {
            if (board[j - 1][i] == "b") {//sus
                ++bombs_around;
            }
        }
        
        if (j < cols - 1 && i > 0) {
            if (board[j + 1][i - 1] == "b") {//stanga-jos
                ++bombs_around;
            }
        }

        if (i > 0 && j > 0) {
            if (board[j - 1][i - 1] == "b") {//sus-stanga
                ++bombs_around;
            }
        }
        
        if (j > 0 && i < cols - 1) {
            if (board[j - 1][i + 1] == "b") {//dreapta-sus
                ++bombs_around;
            }
        }
        
        if (j < rows - 1 && i < cols - 1) {
            if (board[j + 1][i + 1] == "b") {//dreapta-jos
                ++bombs_around;
            }
        }
    }
    return bombs_around;
}

function whenClick(id) {
    var possible_numbers = [1, 2, 3, 4, 5, 6, 7, 8];
    var i, j;
    i = parseInt(id[0]);
    j = parseInt(id[1]);
    var elem = document.getElementById(id);
    var table = document.getElementById("table");
    if (board[j][i] == "b") {//if click on bomb
        document.getElementById("WinOrLost").innerHTML = "You lost, try again!";
        document.querySelectorAll('.mines').forEach(function(element) {
          element.style.cssText = "width: 58px; height: 58px";
        });
        table.style.cssText = "font-size: 30px; background-color: white";
        var buton = document.querySelector(".btn");
        buton.style.visibility = "visible";
        table.removeEventListener("click", whenClick(this.id) , false);
    } else if (possible_numbers.includes(board[j][i])) {//if click on numbers
        elem.style.cssText = "position: relative; font-size: 30px; height: 60px; background-color: white; border: 1px solid black; text-align: center";
        checkWin();
    } else {//if click on empty cell   
        var empty_cells = [];
        empty_cells[0] = id;
        for (ind = 0; ind < empty_cells.length; ++ind) {
            aux_id = empty_cells[ind];
            i = parseInt(empty_cells[ind][0]);
            j = parseInt(empty_cells[ind][1]);
            elem = document.getElementById("" + i + j);
            elem.style.cssText = "font-size: 30px; height: 60px; width: 60px; background-color: white; border: 1px solid black; text-align: center";
            if (i > 0) {
                var aux_i = i - 1;
                var left_elem = document.getElementById("" + aux_i + j);
                var fontSize = window.getComputedStyle(left_elem, null).getPropertyValue('font-size');
                if (board[j][aux_i] == " " && fontSize == "0px" && empty_cells.includes("" + aux_i + j) == false) {//stanga
                    empty_cells.push("" + aux_i + j)//pun id in lista
                } else if (fontSize == "0px") {             
                    left_elem.style.cssText = "font-size: 30px; height: 60px; width: 60px; background-color: white; border: 1px solid black; text-align: center";
                }
            }
           
            if (i < cols - 1) {
                var aux_i = i + 1;
                var right_elem = document.getElementById("" + aux_i + j);
                var fontSize = window.getComputedStyle(right_elem, null).getPropertyValue('font-size');
                if (board[j][aux_i] == " " && fontSize == "0px" && empty_cells.includes("" + aux_i + j) == false) {//dreapta
                    empty_cells.push("" + aux_i + j)
                } else if (fontSize == "0px") {         
                    right_elem.style.cssText = "font-size: 30px; height: 60px; width: 60px; background-color: white; border: 1px solid black; text-align: center";
                }
            }
             
            if (j < cols - 1) {
                var aux_j = j + 1;
                var bottom_elem = document.getElementById("" + i + aux_j);
                var fontSize = window.getComputedStyle(bottom_elem, null).getPropertyValue('font-size');
                if (board[aux_j][i] == " " && fontSize == "0px" && empty_cells.includes("" + i + aux_j) == false) {//dreapta
                    empty_cells.push("" + i + aux_j)
                } else if (fontSize == "0px")  {                 
                    bottom_elem.style.cssText = "font-size: 30px; height: 60px; width: 60px; background-color: white; border: 1px solid black; text-align: center";
                } 
            }

            if (j > 0) {
                var aux_j = j - 1;
                var up_elem = document.getElementById("" + i + aux_j);
                var fontSize = window.getComputedStyle(up_elem, null).getPropertyValue('font-size');
                if (board[aux_j][i] == " " && fontSize == "0px" && empty_cells.includes("" + i + aux_j) == false) {//sus
                    empty_cells.push("" + i + aux_j);
                } else if (fontSize == "0px")  {     
                    up_elem.style.cssText = "font-size: 30px; height: 60px; width: 60px; background-color: white; border: 1px solid black; text-align: center";
                }
            }
            
            if (j < cols - 1 && i > 0) {
                var aux_j = j + 1, aux_i = i - 1;
                var bottom_left_elem = document.getElementById("" + aux_i + aux_j);
                var fontSize = window.getComputedStyle(bottom_left_elem, null).getPropertyValue('font-size');
                if (board[aux_j][aux_i] == " " && fontSize == "0px" && empty_cells.includes("" + aux_i + aux_j) == false) {//stanga-jos
                    empty_cells.push("" + aux_i + aux_j);
                } else if (fontSize == "0px")  {                 
                    bottom_left_elem.style.cssText = "font-size: 30px; height: 60px; width: 60px; background-color: white; border: 1px solid black; text-align: center";
                }
            }

            if (i > 0 && j > 0) {
                var aux_i = i - 1, aux_j = j - 1;
                var up_left_elem = document.getElementById("" + aux_i + aux_j);
                var fontSize = window.getComputedStyle(up_left_elem, null).getPropertyValue('font-size');
                if (board[aux_j][aux_i] == " " && fontSize == "0px" && empty_cells.includes("" + aux_i + aux_j) == false) {//sus-stanga
                    empty_cells.push("" + aux_i + aux_j);
                } else if (fontSize == "0px")  {                   
                    up_left_elem.style.cssText = "font-size: 30px; height: 60px; width: 60px; background-color: white; border: 1px solid black; text-align: center";
                }
            }
           
            if (j > 0 && i < cols - 1) {
                var aux_i = i + 1, aux_j = j - 1;
                var up_right_elem = document.getElementById("" + aux_i + aux_j);
                var fontSize = window.getComputedStyle(up_right_elem, null).getPropertyValue('font-size');
                if (board[aux_j][aux_i] == " " && fontSize === "0px" && empty_cells.includes("" + aux_i + aux_j) == false) {//dreapta-sus
                    empty_cells.push("" + aux_i + aux_j);
                } else if (fontSize == "0px")  {        
                    up_right_elem.style.cssText = "font-size: 30px; height: 60px; width: 60px; background-color: white; border: 1px solid black; text-align: center";
                }
            }
             
            if (j < rows - 1 && i < cols - 1) {
                var aux_i = i + 1, aux_j = j + 1;
                var bottom_right_elem = document.getElementById("" + aux_i + aux_j);
                var fontSize = window.getComputedStyle(bottom_right_elem, null).getPropertyValue('font-size');
                if (board[aux_j][aux_i] == " " && fontSize == "0px" && empty_cells.includes("" + aux_i + aux_j) == false) {//dreapta-jos
                    empty_cells.push("" + aux_i + aux_j);
                } else if (fontSize == "0px")  {     
                    bottom_right_elem.style.cssText = "font-size: 30px; height: 60px; width: 60px; background-color: white; border: 1px solid black; text-align: center";
                }
            }
            checkWin();
        }  
    }
}

/*function putFlag(id) {
    table.oncontextmenu = (e) => {
      e.preventDefault();
    } 
    var aux = document.getElementById(id);
    var flag = window.getComputedStyle(aux, null).getPropertyValue('background-color');
    if (flag != "red") {
        flag = "red";
    } else {
        flag = rgb(211,211,211);
    }
    aux.style.backgroundColor = flag;
}*/

function checkWin() {
    var counter_revealed_cells = 0;
    document.querySelectorAll(".divs").forEach(function(element) {
        var fontSize = window.getComputedStyle(element, null).getPropertyValue('font-size');
        if (fontSize == "30px") {
            ++counter_revealed_cells;
            if (needed_to_win == counter_revealed_cells) {
                table.style.cssText = "font-size: 30px; background-color: white";
                document.getElementById("WinOrLost").innerHTML = "Congrats, you won!! :)";
                return;
            }
        }    
    });
    if (counter_revealed_cells == needed_to_win) {
        var buton = document.querySelector(".btn");
        buton.style.visibility = "visible";  
    }  
}
