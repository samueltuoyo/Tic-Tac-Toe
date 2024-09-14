let turn = 'X';
let gameOver = false;
let vsCPU = false; // Variable to track if playing against CPU
const boxes = document.querySelectorAll('.box');
const winner = document.getElementById('winner');
const restart = document.getElementById('restart-btn');
const winBorder = document.getElementById('win-border');
const turnFor = document.querySelector('.turn-for');

// Event listeners for game mode selection
document.getElementById('vs-player').addEventListener('click', () => {
    vsCPU = false;
    startNewGame();
});

document.getElementById('vs-cpu').addEventListener('click', () => {
    vsCPU = true;
    getPlayerNames(); // Get player name before starting game
    startNewGame();
});

function getPlayerNames() {
    let playerName = '';
    while (!playerName) {
        playerName = prompt('What Shall We Call You?'); // Prompt user for name
        if (playerName) {
            localStorage.setItem('player', playerName);
        } else {
            alert('Please enter a valid name.'); // Alert if the input is empty or canceled
        }
    }
}

function startNewGame() {
    boxes.forEach(box => box.querySelector('.text-box').textContent = "");
    winBorder.style.opacity = "0";
    winner.innerText = '';
    turn = vsCPU ? 'O' : 'X'; // If vsCPU is true, CPU starts with 'O'; otherwise, user starts with 'X'
    gameOver = false;
    turnFor.style.display = 'block';
    turnFor.innerHTML = `Turn for ${turn}`;
    turnFor.style.animation = 'none';
    boxes.forEach(box => box.querySelector('.text-box').style.fontSize = 'inherit');
    
    if (vsCPU && turn === 'O') {
        cpuMove(); // Let CPU move first if in vsCPU mode
    }
}

function game() {
    if (gameOver) return;
    const boxContent = document.querySelectorAll('.text-box');
    const winScenes = [
        [0, 1, 2, 19, 49, 0],
        [0, 4, 8, 19, 161, 225],
        [0, 3, 6, -93, 160, 90],
        [1, 4, 7, 20, 160, 90],
        [2, 5, 8, 131, 160, 90],
        [3, 4, 5, 19, 160, 0],
        [6, 7, 8, 19, 272, 0],
        [2, 4, 6, 19, 159, 135],
    ];

    winScenes.forEach((scene) => {
        if (boxContent[scene[0]].innerHTML === boxContent[scene[1]].innerHTML &&
            boxContent[scene[1]].innerHTML === boxContent[scene[2]].innerHTML &&
            boxContent[scene[0]].innerHTML !== '') {
            const win = document.getElementById('win-audio');
            win.play();
            winBorder.style.transform = `translate(${scene[3]}px, ${scene[4]}px) rotate(${scene[5]}deg)`;
            winBorder.style.opacity = "1";
            turnFor.style.animation = 'anim 1s linear infinite';
            boxContent[scene[0]].style.fontSize = '60px';
            boxContent[scene[1]].style.fontSize = '60px';
            boxContent[scene[2]].style.fontSize = '60px';
            turnFor.style.display = 'none';
            if (boxContent[scene[0]].innerHTML === 'X') {
                winner.innerText = localStorage.getItem('player');
            } else {
                winner.innerText = 'CPU has won';
            }
            gameOver = true;
        }
    });

    const isDraw = Array.from(boxContent).every(box => box.innerHTML !== '');
    if (isDraw && !gameOver) {
        const tieJam = document.getElementById('tie-audio');
        tieJam.play();
        winner.innerText = 'It\'s a draw!';
        restart.style.display = 'block';
        gameOver = true;
    }

    if (!gameOver && turn === 'O' && vsCPU) {
        setTimeout(cpuMove, 500); // Slight delay to simulate CPU thinking
    }
}

Array.from(boxes).forEach((box) => {
    box.addEventListener('click', (e) => {
        const boxContent = e.target.querySelector('.text-box');
        const pop = document.getElementById('box-audio');
        pop.play();
        if (boxContent.innerHTML === '' && !gameOver) {
            boxContent.innerHTML = turn;
            turn = turn === 'X' ? 'O' : 'X';
            game();
            if (!gameOver && turn === 'O' && vsCPU) {
                turnFor.innerHTML = 'CPU Turn for O';
            }
        }
    });
});

restart.addEventListener('click', startNewGame);

function evaluate(board) {
    const winScenes = [
        [0, 1, 2],
        [0, 4, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [3, 4, 5],
        [6, 7, 8],
        [2, 4, 6]
    ];

    for (let scene of winScenes) {
        const [a, b, c] = scene;
        if (board[a] === board[b] && board[b] === board[c]) {
            if (board[a] === 'X') return -10;
            else if (board[a] === 'O') return 10;
        }
    }
    return 0;
}

function isMovesLeft(board) {
    return board.includes('');
}

function minimax(board, depth, isMax) {
    const score = evaluate(board);

    if (score === 10) return score - depth;
    if (score === -10) return score + depth;
    if (!isMovesLeft(board)) return 0;

    if (isMax) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                best = Math.max(best, minimax(board, depth + 1, false));
                board[i] = '';
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                best = Math.min(best, minimax(board, depth + 1, true));
                board[i] = '';
            }
        }
        return best;
    }
}

function findBestMove(board) {
    let bestVal = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            let moveVal = minimax(board, 0, false);
            board[i] = '';
            if (moveVal > bestVal) {
                bestMove = i;
                bestVal = moveVal;
            }
        }
    }
    return bestMove;
}

function cpuMove() {
    const boxContent = Array.from(document.querySelectorAll('.text-box')).map(box => box.innerHTML);
    const bestMove = findBestMove(boxContent);
    if (bestMove !== -1) {
        boxes[bestMove].querySelector('.text-box').innerHTML = 'O';
        const pop = document.getElementById('box-audio');
        pop.play();
        turn = 'X';
        game();
        if (!gameOver) turnFor.innerHTML = `${localStorage.getItem('player')} Turn for ${turn}`;
    }
}
