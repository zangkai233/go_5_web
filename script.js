const socket = io('https://go-5-web.onrender.com'); // 确保这里的地址正确

const canvas = document.getElementById('chessboard');
const context = canvas.getContext('2d');
const size = 15; // 棋盘尺寸
const cellSize = canvas.width / size;
let board = Array(size).fill().map(() => Array(size).fill(null));
let isBlack = true; // 黑棋先行

// 绘制棋盘
function drawBoard() {
    context.fillStyle = "#DEB887"; // 背景色改为木头色
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.strokeStyle = "black"; // 棋盘线条颜色
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
    
    // 发送棋子数据到服务器
    socket.emit('move', { x, y, isBlack });

    isBlack = !isBlack;
});

// 监听来自服务器的棋子落子事件
socket.on('move', ({ x, y, isBlack }) => {
    console.log(`收到对手的落子: x=${x}, y=${y}, 颜色=${isBlack ? '黑' : '白'}`);
    board[x][y] = isBlack;
    drawPiece(x, y, isBlack);
});

socket.on('connect', () => {
    console.log('✅ 成功连接到公网服务器！');
});

drawBoard();
