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
    function showAvailableMoves(){ //when you start dragging a piece, its available moves will be shown
        const allSquares = document.querySelectorAll('.square');
        const correctGo = draggedElement.firstChild.classList.contains(playerGo);
        if (correctGo) {
            allSquares.forEach(square => {
                if (checkIfValid(square) && !square.firstChild?.firstChild.classList.contains(playerGo)) {//if the move is valid and does not land on a piece of the same colour
                    square.classList.add('available');//the available class adds a yellow border to indicate available moves
                  } 
                });
        }
    }
    showAvailableMoves()

    /*const kings = Array.from(document.querySelectorAll('#king'))
    
    console.log(kings.some(king => king.parentNode.classList.contains('available')))
    function check() {
        opponentPieces = Array.from(document.getElementsByClassName(playerGo));
        opponentPieces.forEach(piece => checkifValid(piece.parentNode.parentNode.classList))
    }
    check();*/
}

const dragOver = (e) => {
    e.preventDefault(); //preventing data recording of what the dragged piece is hovered over
}

const dragDrop = (e) => {
    e.stopPropagation(); //stops parent elements from receiving event
    const correctGo = draggedElement.firstChild.classList.contains(playerGo);
    const taken = e.target.classList.contains('piece');
    const valid = checkIfValid(e.target);
    const opponentGo = playerGo === 'white' ? 'black' : 'white';
    const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo);

    allSquares.forEach(square => {
        if (checkIfValid(square)) {
            square.classList.remove('available'); // removes highlighted available moves when piece is dropped
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

//going through different types of pieces and what their allowed moves are
function checkIfValid(target) {
    const targetId = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'));
    const startId = Number(startPositionId);
    const piece = draggedElement.id;
    let rowDifference = Math.floor((Math.abs(targetId-startId))/width);

    switch(piece) {
        case 'pawn' :
            const starterRow = [8,9,10,11,12,13,14,15]
            if (
                starterRow.includes(startId) && startId + width * 2 === targetId && !document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild || //starting pawns can move two space forward if no other piece in the way
                startId + width === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild || //pawn can move one forward if no piece in way
                startId + width - 1 === targetId && document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && targetId%width < startId%width || //pawn can take opponent piece diagonally
                startId + width + 1 === targetId && document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && targetId%width > startId%width //final condition makes sure pawn cannot take piece diagonally on other side of the board
                ) {
                    return true;
                }
            else {
                return false;
            }
            break;
        case 'knight' :
            // removing incorrect available moves involving when knight is at edge of board, jumping to other side of the board
            if (
                startId % width === width - 2 && startId + width + 2 === targetId ||
                startId % width === width - 2 && startId - width + 2 === targetId ||
                startId % width === width - 7 && startId + width - 2 === targetId ||
                startId % width === width - 7 && startId - width - 2 === targetId ||
                startId % width === 0 && startId + width - 2 === targetId ||
                startId % width === 0 && startId + width * 2 - 1 === targetId
               ) {
                return false;
               } 
            //possible kinght moves
            if (
                startId % width !== width - 1 && startId + width * 2 + 1 === targetId || 
                startId % width !== width + 1 && startId + width * 2 - 1 === targetId ||
                startId % width !== width - 1 && startId + width + 2 === targetId ||
                startId % width !== width + 2 && startId + width - 2 === targetId ||
                startId % width !== width - 1 && startId - width * 2 + 1 === targetId ||
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
                //going through all four diagonal directions and checking if any pieces blocking path
                diagonalPathForwardLeft = [];
                for (let i =0; i<rowDifference-1; i++) {
                    if (startId + width * (i+1) + (i+1) >=0 && startId + width * (i+1) + (i+1) <=63) { //ensuring possible moves on board, prevent error when for loops run in all four diagonal directions
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
            //if every square in diagonal path is free, then move is allowed
            if ((startId + width * rowDifference + rowDifference) === targetId && diagonalPathForwardLeft.every(i=>i) && startId%width < targetId%width) { //final condition prevents available moves continuing to other side of board incorrectly
                return true;
                } 
            
                else if ((startId + width * (rowDifference + 1) - (rowDifference + 1)) === targetId && diagonalPathForwardRight.every(i=>i) && startId%width > targetId%width) {
                    return true;
                }

                else if ((startId - width * (rowDifference + 1) + (rowDifference + 1)) === targetId && diagonalPathBackwardLeft.every(i=>i) && startId%width < targetId%width) {
                    return true;
                } 

                else if ((startId - width * rowDifference - rowDifference) === targetId && diagonalPathBackwardRight.every(i=>i) && startId%width > targetId%width) {
                    return true;
                }
            else {
                return false;
            }
            break;
        case 'rook' :
            
            function rookPath() {
            //going through all four vertical/horizontal directions and checking if any pieces blocking path
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
            //if every square in vertical/horizontal path is free, then move is allowed
            if ((startId + width * rowDifference) === targetId && upPath.every(i=>i)) { 
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
            bishopPath(); //combining bishop and rook moves
            rookPath();
            if ((startId + width * rowDifference + rowDifference) === targetId && diagonalPathForwardLeft.every(i=>i) && startId%width < targetId%width) {
                return true;
                } 
            
                else if ((startId + width * (rowDifference + 1) - (rowDifference + 1)) === targetId && diagonalPathForwardRight.every(i=>i) && startId%width > targetId%width) {
                    return true;
                }

                else if ((startId - width * (rowDifference + 1) + (rowDifference + 1)) === targetId && diagonalPathBackwardLeft.every(i=>i) && startId%width < targetId%width) {
                    return true;
                } 

                else if ((startId - width * rowDifference - rowDifference) === targetId && diagonalPathBackwardRight.every(i=>i) && startId%width > targetId%width) {
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
            case 'king': 
            //valid king moves
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

//switching Ids of squares every turn so that square Ids always start from 0 on current player's side
function changePlayer() { 
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

//game is won when king is taken
function checkForWin() {
    const kings = Array.from(document.querySelectorAll('#king'))
    if (!kings.some(king => king.firstChild.classList.contains('white'))) {
        infoDisplay.innerHTML = "Black Player Wins";
        const allSquares = document.querySelectorAll('.square');
        allSquares.forEach(square => square.firstChild?.setAttribute('draggable', false)) //once game is won, cannot drag pieces anymore
    }

    if (!kings.some(king => king.firstChild.classList.contains('black'))) {
        infoDisplay.innerHTML = "White Player Wins";
        const allSquares = document.querySelectorAll('.square');
        allSquares.forEach(square => square.firstChild?.setAttribute('draggable', false))
    }
}

//allowing dragging and dropping of pieces
const allSquares = document.querySelectorAll(".square"); 
allSquares.forEach((square)=>{
    square.addEventListener('dragstart', dragStart);
    square.addEventListener('dragover', dragOver);
    square.addEventListener('drop', dragDrop);
})