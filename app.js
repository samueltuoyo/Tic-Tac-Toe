let turn = 'X';
let gameOver = false;
const boxes = document.querySelectorAll('.box');
const winner = document.getElementById('winner');
const restart = document.getElementById('restart-btn');
const winBorder = document.getElementById('win-border');
const turnFor = document.querySelector('.turn-for');

restart.addEventListener('click', () => {
  window.location.reload();
});

function game() {
  if (gameOver) return;
  const boxContent = document.querySelectorAll('.text-box');
  const winScenes = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  winScenes.forEach((scene) => {
    if (boxContent[scene[0]].innerHTML === boxContent[scene[1]].innerHTML &&
      boxContent[scene[1]].innerHTML === boxContent[scene[2]].innerHTML &&
      boxContent[scene[0]].innerHTML !== '') {
      winBorder.style.transform = `translate(${scene[0] * 100}px, ${scene[0] * 100}px)`;
      winBorder.style.display = 'none';
      turnFor.style.animation = 'anim 1s linear infinite';
      boxContent[scene[0]].style.fontSize = '60px';
      boxContent[scene[1]].style.fontSize = '60px';
      boxContent[scene[2]].style.fontSize = '60px';
      turnFor.style.display = 'none';
      winner.innerText = boxContent[scene[0]].innerHTML + ' has won the game';
      restart.style.display = 'block';
      gameOver = true;
    }
  });

  const isDraw = Array.from(boxContent).every(box => box.innerHTML !== '');
  if (isDraw && !gameOver) {
    winner.innerText = 'It\'s a draw!';
    restart.style.display = 'block';
    gameOver = true;
  }
}

 Array.from(boxes).forEach((box, i) => {
  box.addEventListener('click', (e) => {
    const boxContent = e.target.querySelector('.text-box');
    if (boxContent.innerHTML === '') {
      boxContent.innerHTML = turn;
      turn = turn === 'X' ? 'O' : 'X';
      game();
      turnFor.innerHTML = `Turn for ${turn}`;
    }
  });
});
;