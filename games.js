var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');
var scoreEl = document.getElementById('score');
var bestEl = document.getElementById('best');

var COLS = 20;
var ROWS = 20;
var FPS  = 9;
var CELL;

var snake, dir, nextDir, food, score, best = 0, phase, loopTimer;

function init() {
  snake   = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
  dir     = { x: 1, y: 0 };
  nextDir = { x: 1, y: 0 };
  score   = 0;
  scoreEl.innerText = score;
  placeFood();
}

function placeFood() {
  do {
    food = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  } while (snake.some(function(s) { return s.x === food.x && s.y === food.y; }));
}

function start() {
  if (loopTimer) clearInterval(loopTimer);
  init();
  phase     = 'running';
  loopTimer = setInterval(tick, 1000 / FPS);
}

function tick() {
  dir = nextDir;
  var head = { x: (snake[0].x + dir.x + COLS) % COLS,
               y: (snake[0].y + dir.y + ROWS) % ROWS };

  if (snake.some(function(s) { return s.x === head.x && s.y === head.y; })) {
    phase = 'dead';
    best  = Math.max(best, score);
    bestEl.innerText = best;
    clearInterval(loopTimer);
    draw();
    return;
  }

  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.innerText = score;
    placeFood();
  } else {
    snake.pop();
  }
  draw();
}

function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  snake.forEach(function(part, i) {
    ctx.fillStyle = (i === 0) ? '#4CAF50' : '#2E7D32';
    ctx.fillRect(part.x * CELL, part.y * CELL, CELL - 1, CELL - 1);
  });
  ctx.fillStyle = '#FF5252';
  ctx.fillRect(food.x * CELL, food.y * CELL, CELL - 1, CELL - 1);
}

function resize() {
  var size = Math.min(window.innerWidth - 30, window.innerHeight - 250);
  CELL = Math.floor(size / COLS);
  canvas.width = canvas.height = CELL * COLS;
  draw();
}

function changeDir(x, y) {
  if (phase !== 'running') start();
  if (x !== -dir.x || y !== -dir.y) nextDir = { x: x, y: y };
}

document.getElementById('up').onclick    = function() { changeDir(0, -1); };
document.getElementById('down').onclick  = function() { changeDir(0, 1); };
document.getElementById('left').onclick  = function() { changeDir(-1, 0); };
document.getElementById('right').onclick = function() { changeDir(1, 0); };

window.addEventListener('resize', resize);
phase = 'idle';
init();
resize();
function draw() {
  // تنظيف الشاشة
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // رسم التفاحة (استخدام إيموجي التفاحة)
  ctx.font = CELL + "px Arial";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("🍎", food.x * CELL, food.y * CELL);

  // رسم الثعبان
  snake.forEach(function(part, i) {
    if (i === 0) {
      // رأس الثعبان (إيموجي وجه ثعبان)
      ctx.fillText("🐍", part.x * CELL, part.y * CELL);
    } else {
      // جسم الثعبان (دوائر خضراء متدرجة لتبدو حقيقية)
      ctx.fillStyle = "#32CD32";
      ctx.beginPath();
      ctx.arc((part.x * CELL) + CELL/2, (part.y * CELL) + CELL/2, CELL/2 - 1, 0, 2 * Math.PI);
      ctx.fill();
    }
  });

  // رسائل الحالة
  if (phase === 'idle' || phase === 'dead') {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillText(phase === 'dead' ? "لعبة انتهت! اضغط للبدء" : "اضغط سهم للبدء", canvas.width / 2, canvas.height / 2);
  }
}
