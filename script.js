const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const score = document.querySelector('.scoreValue');
const finalScore = document.querySelector('.finalScore > span');
const menu = document.querySelector('.menuScreen');
const buttonPlay = document.querySelector('.btnPlay');

const size = 30;

const initialPosition = {x: 270, y: 240};

let snake = [initialPosition];

// Aumenta pontuação
const incrementScore = () => {
  score.innerText = parseInt(score.innerText) + 1;
}

// Gera valor aleatório
const randomNumber = (min,max) => {
  return Math.round(Math.random() * (max - min) + min);
}

// Gera posição aleatória
const randomPosition = () => {
  const number = randomNumber(0,canvas.width-size);
  return Math.round(number/30) * 30;
}

// Gera cor aleatória
const randomColor = () => {
  const red = randomNumber(0,250);
  const blue = randomNumber(0,250);
  const green = randomNumber(0,250);

  return `rgb(${red},${green},${blue})`;
}

// Objeto da comida
const food = {
  x: randomPosition(),
  y: randomPosition(),
  color: randomColor()
};

let direction, loopId

// Desenha comida
const drawFood = () => {

  const {x,y,color} = food;

  ctx.shadowColor = color;
  ctx.shadowBlur = 6;
  ctx.fillStyle = color;
  ctx.fillRect(x,y,size, size)
  ctx.shadowBlur = 0;
}

// Desenhar cobra
const drawSnake = () => {
  ctx.fillStyle = '#ddd';
  
  snake.forEach((position,index) => {

    if(index == snake.length - 1){
      ctx.fillStyle = 'white'
    }

    ctx.fillRect(position.x,position.y, size, size)
  });
}

// Move cobra
const moveSnake = () => {
  if(!direction) return
  
  const head = snake.at(-1)

  snake.shift();

  // Verifica direções
  if(direction == "right"){
    snake.push({x:head.x + size,y:head.y});
  }else if(direction == "left"){
    snake.push({x:head.x - size,y:head.y});
  }

  if(direction == "up"){
    snake.push({x:head.x,y:head.y - size});
  }else if(direction == "down"){
    snake.push({x:head.x,y:head.y + size});
  }
  
}

// Desenha grid
const drawGrid = () => {
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#191919';
  
  for(let i = 0;i < canvas.width;i+=30){
    ctx.beginPath();
    ctx.lineTo(i,0);
    ctx.lineTo(i,600);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineTo(0,i);
    ctx.lineTo(600,i);
    ctx.stroke();
  }
}

// Checa se deve comer a comida
const checkEat = () => {
  const head = snake[snake.length - 1];

  if(head.x == food.x && head.y == food.y){
    snake.push(head)
    incrementScore();
    
    let x = randomPosition();
    let y = randomPosition();

    while(snake.find((position) => position.x == x && position.y == y)){
      x = randomPosition();
      y = randomPosition();
    }

    food.x = x;
    food.y = y;
    food.color = randomColor();
  }
}

// Checa a colisão com as paredes
const checkCollision = () => {
  const head = snake[snake.length - 1];
  const canvasLimit = canvas.width - size;
  const neckIndex = snake.length - 2
  const wallCollision = head.x < 0 || head.x > canvasLimit 
  || head.y < 0 || head.y > canvasLimit

  const selfCollision = snake.find((position, index) => {
    return index < neckIndex && position.x == head.x && position.y == head.y
  })
  if(wallCollision || selfCollision){
    gameOver();
  }
}

// Game Over - acabou jogo
const gameOver = () => {
  direction = undefined;
  menu.style.display = "flex";
  finalScore.innerText = score.innerText;
  canvas.style.filter = "blur(2px)";
}

// Loop do jogo
const gameLoop = () => {
  clearInterval(loopId)
  
  ctx.clearRect(0,0,600,600)
  drawSnake();
  moveSnake();
  drawGrid();
  drawFood();
  checkEat();
  checkCollision();

  loopId = setTimeout(() => {
    gameLoop();
  },200)
}

gameLoop()

// Teclas de movimentação
document.addEventListener("keydown", ({key}) => {
  if(key == "ArrowRight" && direction != 'left'){
    direction = "right"
  }

  if(key == "ArrowLeft" && direction != 'right'){
    direction = "left"
  }

  if(key == "ArrowUp" && direction != 'down'){
    direction = "up"
  }

  if(key == "ArrowDown" && direction != 'up'){
    direction = "down"
  }
})

// Clique para começar a jogar
buttonPlay.addEventListener("click",() => {
  score.innerText = "00";
  menu.style.display = "none";
  canvas.style.filter = "none";
  snake = [initialPosition];
})