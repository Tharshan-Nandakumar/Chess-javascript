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
    console.log('target Id', targetId);
    console.log('start Id', startId);
    console.log('piece', piece);

    switch(piece) {
        case 'pawn' :
            const starterRow = [8,9,10,11,12,13,14,15]
            if (
                starterRow.includes(startId) && startId + width * 2 === targetId ||
                startId + width === targetId ||
                startId + width - 1 === targetId &&  
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

