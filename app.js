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
        square.firstChild?.setAttribute('draggable', true);
        square.setAttribute('square-id',i);
        const row = Math.ceil(63 - i / 8);
        if (row % 2 === 0) {
            i%2 ===0 ? square.classList.add('beige') : square.classList.add('brown');
        } else {
            i%2 ===0 ? square.classList.add('brown') : square.classList.add('beige');
        }

        if (i <=15) {
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
    startPositionId = e.target.parentNode.getAttribute('square-id');
    draggedElement = e.target;
}

const dragOver = (e) => {
    e.preventDefault();
}

const dragDrop = (e) => {
    e.stopPropagation();
    const correctGo = draggedElement.firstChild.classList.contains(playerGo);
    const taken = e.target.classList.contains('piece');
    const valid = checkIfValid(e.target);
    const opponentGo = playerGo === 'white' ? 'black' : 'white';
    const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo);
   
    if (correctGo) {
        // must check this first 
        if (takenByOpponent && valid) {
            e.target.parentNode.append(draggedElement);
            e.target.remove();
            changePlayer();
            return
        }
        // then check this
        if (taken && !takenByOpponent) {
            infoDisplay.textContent = ('You cannot go there');
            setTimeout(() => infoDisplay.textContent = "", 2000);
            return;
        }
        if (valid) {
            e.target.append(draggedElement);
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
                starterRow.includes(startId) && startId + width * 2 === targetId && !document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild ||
                startId + width === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild ||
                startId + width - 1 === targetId && document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild ||
                startId + width + 1 === targetId && document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild
                ) {
                    return true;
                }
            break;
        case 'knight' :
            if (
                startId + width * 2 + 1 === targetId ||
                startId + width * 2 - 1 === targetId ||
                startId + width + 2 === targetId ||
                startId + width - 2 === targetId ||
                startId - width * 2 + 1 === targetId ||
                startId - width * 2 - 1 === targetId ||
                startId - width + 2 === targetId ||
                startId - width - 2 === targetId 
                ) {
                return true;
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
                
                return diagonalPathForwardRight, diagonalPathForwardLeft, diagonalPathBackwardLeft, diagonalPathBackwardRight
                
            }
            bishopPath();
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
                
                return upPath, downPath, leftPath, rightPath;
            }
            
            rookPath();
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
            break; 
        case 'queen':
            bishopPath();
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
            break;  
            case 'king': 
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
    }
}

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

const allSquares = document.querySelectorAll(".square");
allSquares.forEach((square)=>{
    square.addEventListener('dragstart', dragStart);
    square.addEventListener('dragover', dragOver);
    square.addEventListener('drop', dragDrop);
})

