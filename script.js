const socket = io('https://go-5-web.onrender.com'); // 已替换为你的公网服务器地址

const canvas = document.getElementById('chessboard');
const context = canvas.getContext('2d');
const size = 15; // 棋盘尺寸
const cellSize = canvas.width / size;
let board = Array(size).fill().map(() => Array(size).fill(null));
let isBlack = true; // 黑棋先行

// 绘制棋盘
function drawBoard() {
    for (let i = 0; i <= size; i++) {
        context.beginPath();
        context.moveTo(i * cellSize, 0);
        context.lineTo(i * cellSize, canvas.height);
        context.moveTo(0, i * cellSize);
        context.lineTo(canvas.width, i * cellSize);
        context.stroke();
    }
}

// 绘制棋子
function drawPiece(x, y, isBlack) {
    context.beginPath();
    context.arc((x + 0.5) * cellSize, (y + 0.5) * cellSize, cellSize / 2.5, 0, 2 * Math.PI);
    context.fillStyle = isBlack ? 'black' : 'white';
    context.fill();
}

// 处理点击事件
canvas.addEventListener('click', (e) => {
    const x = Math.floor(e.offsetX / cellSize);
    const y = Math.floor(e.offsetY / cellSize);
    if (board[x][y] !== null) return;
    board[x][y] = isBlack;
    drawPiece(x, y, isBlack);
    socket.emit('move', { x, y, isBlack });
    isBlack = !isBlack;
});

// 接收对方的落子
socket.on('move', ({ x, y, isBlack }) => {
    board[x][y] = isBlack;
    drawPiece(x, y, isBlack);
});

socket.on('connect', () => {
    console.log('成功连接到公网服务器！');
});

drawBoard();
