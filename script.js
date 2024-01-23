const gameContainer = document.getElementById("game-container");
const gridSize = 20;
const cellSize = gameContainer.clientWidth / gridSize;
let snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }]; // Starting with a snake length of 2
let direction = "right"
let mouse = { x: 0, y: 0 }; // Initialize mouse coordinates
let foot = {x: 0, y: 0};

function createCell(x, y, className, imageUrl) {
    const cell = document.createElement("div");
    cell.style.width = `${cellSize}px`;
    cell.style.height = `${cellSize}px`;
    cell.style.position = "absolute";
    cell.style.left = `${x * cellSize}px`;
    cell.style.top = `${y * cellSize}px`;
  //create an image for the mouse
    if (imageUrl) {
      const img = document.createElement("img");
      img.src = imageUrl;
      img.style.width = "100%";
      img.style.height = "100%";
      cell.appendChild(img);
    }

    cell.classList.add(className);
    gameContainer.appendChild(cell);
    return cell;
  }
//this is the food that the snake can eat to get longer
function generatemouse() {
  mouse.x = Math.floor(Math.random() * gridSize);
  mouse.y = Math.floor(Math.random() * gridSize);

  // Ensure the mouse does not overlap with the snake
  while (snake.some(segment => segment.x === mouse.x && segment.y === mouse.y)) {
    mouse.x = Math.floor(Math.random() * gridSize);
    mouse.y = Math.floor(Math.random() * gridSize);
  }

  createCell(mouse.x, mouse.y, "mouse", "images/mouse.jpg");
}
//i added a foot where if the snake runs into it you loose the game (person steps on snake)
function generateFoot() {
    foot.x = Math.floor(Math.random() * gridSize);
    foot.y = Math.floor(Math.random() * gridSize);

    // Ensure the foot does not overlap with the snake or mouse
    while (snake.some(segment => segment.x === foot.x && segment.y === foot.y) ||
           (foot.x === mouse.x && foot.y === mouse.y)) {
      foot.x = Math.floor(Math.random() * gridSize);
      foot.y = Math.floor(Math.random() * gridSize);
    }

    createCell(foot.x, foot.y, "foot", "images/feet.jpg");
  }

function update() {
  const head = Object.assign({}, snake[0]);

  switch (direction) {
    case "up":
      head.y -= 1;
      break;
    case "down":
      head.y += 1;
      break;
    case "left":
      head.x -= 1;
      break;
    case "right":
      head.x += 1;
      break;
  }

  snake.unshift(head);
//these are all the checks to state if game loss, or if snake collids with food we append new length.
  // Check if the head collides with the boundaries
  if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
    alert("Game Over! Try to Eat the Mouse next Time!");
    resetGame();
    return;
  }

    // Check if the head collides with itself or the foot
  if (snake.some(segment => segment.x === foot.x && segment.y === foot.y)) {
    alert("Game Over! You got Stepped on by a Foot!");
    resetGame();
    return;
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      alert("Game Over! Snakes cant Eat Themselves");
      resetGame();
      return;
    }
  }

  // Check if the head collides
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      alert("Game Over!");
      resetGame();
      return;
    }
  }

  // Check if the head collides with the mouse
  if (head.x === mouse.x && head.y === mouse.y) {
    // Increase snake length
    snake.push({});
    // Generate new mouse
    generatemouse();
    // we want to generate a new foot if the mouse gets eaten to show the persons moving
    generateFoot();
  } else {
    // Remove the tail if the snake did not eat mouse
    snake.pop();
  }

  // Update the game grid
  updateGrid();

  // Call the update function recursively
  setTimeout(update, 200);
}

function updateGrid() {
  // Remove previous snake cells and mouse
  const cells = document.querySelectorAll(".snake-cell, .mouse, .foot");
  cells.forEach((cell) => gameContainer.removeChild(cell));

  // Create new snake cells
  snake.forEach(({ x, y }) => {
    createCell(x, y, "snake-cell");
  });

  // Create mouse cell
  createCell(mouse.x, mouse.y, "mouse", "images/mouse.jpg");

  // create foot cell
  createCell(foot.x, foot.y, "foot", "images/feet.jpg");
}


function resetGame() {
  // Clear the game container and reset the snake
  gameContainer.innerHTML = "";
  snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }];
  direction = "right";
  generatemouse(); // Generate initial mouse
  generateFoot();
  update();
}

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      direction = "up";
      break;
    case "ArrowDown":
      direction = "down";
      break;
    case "ArrowLeft":
      direction = "left";
      break;
    case "ArrowRight":
      direction = "right";
      break;
  }
});

// Initialize the game
resetGame();