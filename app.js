const gameboard = document.getElementById('gameboard');
const playerDisplay = document.getElementById('player');
const infoDisplay = document.getElementById('info-display');
const width = 8;

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

const dragDrop = () => {
    e.stopPropagation();
}

const allSquares = document.querySelectorAll("#gameboard .square");
allSquares.forEach((square)=>{
    square.addEventListener('dragstart', dragStart);
    square.addEventListener('dragover', dragOver);
    square.addEventListener('drop', dragDrop);
})

