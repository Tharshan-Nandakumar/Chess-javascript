const gameboard = document.getElementById('gameboard');
const playerDisplay = document.getElementById('player');
const infoDisplay = document.getElementById('info-display');
const width = 8;
let playerGo = 'black';
playerDisplay.textContent = 'black';

const startPieces = [
    rook, knight, bishop, queen, king, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    '','','','','','','','',
    '','','','','','','','',
    '','','','','','','','',
    '','','','','','','','',
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    rook, knight, bishop, queen, king, bishop, knight, rook,
]

const createBoard = () => {
    startPieces.forEach((startPiece, i) => {
        const square = document.createElement('div');
        square.classList.add('square');
        square.innerHTML = startPiece;
        square.firstChild?.setAttribute('draggable', true); //if square has a piece, it will be draggable
        square.setAttribute('square-id',i);
        const row = Math.ceil(63 - i / 8);

        if (row % 2 === 0) {  //setting square colours to alternate between brown and beige
            i%2 ===0 ? square.classList.add('beige') : square.classList.add('brown'); 
        } else {
            i%2 ===0 ? square.classList.add('brown') : square.classList.add('beige');
        }

        if (i <=15) { //setting colours of starting pieces
            square.firstChild.firstChild.classList.add('black');
        }

        if (i >= 48) {
            square.firstChild.firstChild.classList.add('white');
        }

        gameboard.append(square);
    })
}

createBoard()

let startPositionId 
let draggedElement

const dragStart = (e) => {
    startPositionId = e.target.parentNode.getAttribute('square-id'); //when a piece is dragged, its starting square Id is saved
    draggedElement = e.target;
    function showAvailableMoves(){
        const allSquares = document.querySelectorAll('.square');
        const correctGo = draggedElement.firstChild.classList.contains(playerGo);
        if (correctGo) {
            allSquares.forEach(square => {
                if (checkIfValid(square) && !square.firstChild?.firstChild.classList.contains(playerGo)) {
                    square.classList.add('available');
                  } 
                });
        }
    }
    showAvailableMoves()
}

const dragOver = (e) => {
    e.preventDefault(); //preventing data recording of what the dragged piece is hovered over
}

const dragDrop = (e) => {
    e.stopPropagation();
    const correctGo = draggedElement.firstChild.classList.contains(playerGo);
    const taken = e.target.classList.contains('piece');
    const valid = checkIfValid(e.target);
    const opponentGo = playerGo === 'white' ? 'black' : 'white';
    const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo);

    allSquares.forEach(square => {
        if (checkIfValid(square)) {
            square.classList.remove('available');
          } 
        });
    if (correctGo) {
        // must check if legal move and if taking opponent piece first 
        if (takenByOpponent && valid) {
            e.target.parentNode.append(draggedElement);
            e.target.remove();
            checkForWin()
            changePlayer();
            return
        }
        // then check you are not going on same colour piece
        if (taken && !takenByOpponent) {
            infoDisplay.textContent = ('You cannot go there');
            setTimeout(() => infoDisplay.textContent = "", 2000);
            return;
        }
        // if legal move then allowed
        if (valid) {
            e.target.append(draggedElement);
            checkForWin();
            changePlayer();
            return;
        }
    }
}

function checkIfValid(target) {
    const targetId = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'));
    const startId = Number(startPositionId);
    const piece = draggedElement.id;
    let rowDifference = Math.floor((Math.abs(targetId-startId))/width);
    console.log('target Id', targetId);
    console.log('start Id', startId);
    console.log('piece', piece); 

    switch(piece) {
        case 'pawn' :
            const starterRow = [8,9,10,11,12,13,14,15]
            if (
                starterRow.includes(startId) && startId + width * 2 === targetId && !document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild || //starting pawns can move two space forward if no other piece in the way
                startId + width === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild || //pawn can move one forward if no piece in way
                startId + width - 1 === targetId && document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild || //pawn can take opponent piece diagonally
                startId + width + 1 === targetId && document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild
                ) {
                    return true;
                }
            else {
                return false;
            }
            break;
        case 'knight' :
            if (
                startId % width !== width - 1 && startId + width * 2 + 1 === targetId || //possible kinght moves
                startId % width !== width + 1 && startId + width * 2 - 1 === targetId ||
                startId % width !== width - 1 && startId + width + 2 === targetId ||
                startId % width !== width + 2 && startId + width - 2 === targetId ||
                startId - width * 2 + 1 === targetId ||
                startId - width * 2 - 1 === targetId ||
                startId % width !== width - 1 && startId - width + 2 === targetId ||
                startId - width - 2 === targetId 
                ) {
                return true;
                }
            else {
                return false;
            }
            break;
        case 'bishop' :
            
            function bishopPath() {

                diagonalPathForwardLeft = [];
                for (let i =0; i<rowDifference-1; i++) {
                    if (startId + width * (i+1) + (i+1) >=0 && startId + width * (i+1) + (i+1) <=63) {
                        diagonalPathForwardLeft.push(!document.querySelector(`[square-id="${startId + width * (i+1) + (i+1)}"]`).firstChild);
                    }
                }

                diagonalPathForwardRight = [];
                for (let i =0; i<rowDifference; i++) {
                    if (startId + width * (i+1) - (i+1) >=0 && startId + width * (i+1) - (i+1) <=63) {
                        diagonalPathForwardRight.push(!document.querySelector(`[square-id="${startId + width * (i+1) - (i+1)}"]`).firstChild);
                    }
                }

                diagonalPathBackwardLeft = [];
                
                for (let i =0; i<rowDifference; i++) {
                    if (startId - width * (i+1) + (i+1) >=0 && startId - width * (i+1) + (i+1) <=63) {
                        diagonalPathBackwardLeft.push(!document.querySelector(`[square-id="${startId - width * (i+1) + (i+1)}"]`).firstChild);
                    }
                }

                diagonalPathBackwardRight = [];
                for (let i =0; i<rowDifference-1; i++) {
                    if (startId - width * (i+1) - (i+1) >=0 && startId - width * (i+1) - (i+1) <=63) {
                        diagonalPathBackwardRight.push(!document.querySelector(`[square-id="${startId - width * (i+1) - (i+1)}"]`).firstChild);
                    }
                }
                
                return diagonalPathForwardRight, diagonalPathForwardLeft, diagonalPathBackwardLeft, diagonalPathBackwardRight //returns boolean arrays in all four diagonal directions showing if squares are occupied
                
            }
            bishopPath();
            if ((startId + width * rowDifference + rowDifference) === targetId && diagonalPathForwardLeft.every(i=>i)) { //if every square in path is free, then move is allowed
                return true;
                } 
            
                else if ((startId + width * (rowDifference + 1) - (rowDifference + 1)) === targetId && diagonalPathForwardRight.every(i=>i)) {
                    return true;
                }

                else if ((startId - width * (rowDifference + 1) + (rowDifference + 1)) === targetId && diagonalPathBackwardLeft.every(i=>i)) {
                    return true;
                } 

                else if ((startId - width * rowDifference - rowDifference) === targetId && diagonalPathBackwardRight.every(i=>i)) {
                    return true;
                }
            else {
                return false;
            }
            break;
        case 'rook' :
            
            function rookPath() {
                upPath = [];
                for (let i =0; i<rowDifference - 1; i++) {
                    if (startId + width * (i + 1) >=0 && startId + width * (i + 1) <=63) {
                        upPath.push(!document.querySelector(`[square-id="${startId + width * (i + 1)}"]`).firstChild);
                    }
                }

                downPath = [];
                for (let i =0; i<rowDifference - 1; i++) {
                    if (startId - width * (i + 1) >=0 && startId - width * (i + 1) <=63) {
                        downPath.push(!document.querySelector(`[square-id="${startId - width * (i + 1)}"]`).firstChild);
                    }
                }
                
                leftPath = [];
                for (let i =0; i<(targetId - startId)-1; i++) {
                    leftPath.push(!document.querySelector(`[square-id="${startId + i + 1}"]`).firstChild);
                }

                rightPath = [];
                for (let i =0; i<(startId - targetId)-1; i++) {
                    rightPath.push(!document.querySelector(`[square-id="${startId - (i + 1)}"]`).firstChild);
                }
                
                return upPath, downPath, leftPath, rightPath; //returns boolean arrays in all four directions showing if squares are occupied
            }
            
            rookPath();
            if ((startId + width * rowDifference) === targetId && upPath.every(i=>i)) { //if path is free then move is allowed
                return true;
                } 

                else if ((startId - width * rowDifference) === targetId && downPath.every(i=>i)) {
                    return true;
                }
                
                else if (targetId <= (startId + 7) && targetId >= (startId + 1) && leftPath.every(i=>i) && Math.floor(startId / width) === Math.floor(targetId / width)) {
                    return true;
                }  
                
                else if (targetId >= (startId - 7) && targetId <= (startId - 1) && rightPath.every(i=>i) && Math.floor(startId / width) === Math.floor(targetId / width)) {
                    return true;
                } 
            else {
                return false;
            }
            break; 
        case 'queen':
            bishopPath(); //combing bishop and rook moves
            rookPath();
            if ((startId + width * rowDifference + rowDifference) === targetId && diagonalPathForwardLeft.every(i=>i)) {
                return true;
                } 
            
                else if ((startId + width * (rowDifference + 1) - (rowDifference + 1)) === targetId && diagonalPathForwardRight.every(i=>i)) {
                    return true;
                }

                else if ((startId - width * (rowDifference + 1) + (rowDifference + 1)) === targetId && diagonalPathBackwardLeft.every(i=>i)) {
                    return true;
                } 

                else if ((startId - width * rowDifference - rowDifference) === targetId && diagonalPathBackwardRight.every(i=>i)) {
                    return true;
                }

                else if ((startId + width * rowDifference) === targetId && upPath.every(i=>i)) {
                    return true;
                } 

                else if ((startId - width * rowDifference) === targetId && downPath.every(i=>i)) {
                    return true;
                }
                
                else if (targetId <= (startId + 7) && targetId >= (startId + 1) && leftPath.every(i=>i) && Math.floor(startId / width) === Math.floor(targetId / width)) {
                    return true;
                }  
                
                else if (targetId >= (startId - 7) && targetId <= (startId - 1) && rightPath.every(i=>i) && Math.floor(startId / width) === Math.floor(targetId / width)) {
                    return true;
                } 
            else {
                return false;
            }
            break;  
            case 'king': //valid king moves
            if (
                startId + 1 === targetId ||
                startId - 1 === targetId ||
                startId + width === targetId ||
                startId - width === targetId ||
                startId + width + 1 === targetId ||
                startId + width - 1 === targetId ||
                startId - width + 1 === targetId ||
                startId - width - 1 === targetId 
            ) {
                return true;
            }
            else {
                return false;
            }
    }
}

function changePlayer() { //switching Ids of squares every turn so that square Ids always start from 0 on current player's side
    if (playerGo === "black") {
        reverseIds();
        playerGo = "white";
        playerDisplay.textContent = "white";
    } else {
        revertIds();
        playerGo = "black";
        playerDisplay.textContent = "black";
    }
}

function reverseIds() {
    const allSquares = document.querySelectorAll('.square');
    allSquares.forEach((square, i) => 
        square.setAttribute('square-id', (width*width - 1) - i))
}

function revertIds() {
    const allSquares = document.querySelectorAll('.square');
    allSquares.forEach((square, i) => square.setAttribute('square-id',i))
}


function checkForWin() {
    const kings = Array.from(document.querySelectorAll('#king'))
    if (!kings.some(king => king.firstChild.classList.contains('white'))) {
        infoDisplay.innerHTML = "Black Player Wins";
        const allSquares = document.querySelectorAll('.square');
        allSquares.forEach(square => square.firstChild?.setAttribute('draggable', false))
    }

    if (!kings.some(king => king.firstChild.classList.contains('black'))) {
        infoDisplay.innerHTML = "White Player Wins";
        const allSquares = document.querySelectorAll('.square');
        allSquares.forEach(square => square.firstChild?.setAttribute('draggable', false))
    }
}

const allSquares = document.querySelectorAll(".square"); //allowing dragging and dropping of pieces

allSquares.forEach((square)=>{
    square.addEventListener('dragstart', dragStart);
    square.addEventListener('dragover', dragOver);
    square.addEventListener('drop', dragDrop);
})