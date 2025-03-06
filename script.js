const socket = io('https://go-5-web.onrender.com'); // 确保这里的地址正确

const canvas = document.getElementById('chessboard');
const context = canvas.getContext('2d');
const resetButton = document.getElementById('resetGame'); // 获取按钮
const size = 15; // 棋盘尺寸
const cellSize = canvas.width / size;
let board = Array(size).fill().map(() => Array(size).fill(null));
let myColor = null; // 存储当前用户的颜色

// 绘制棋盘
function drawBoard() {
    context.fillStyle = "#DEB887"; // 木头色背景
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.strokeStyle = "black"; // 棋盘线条
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

// 监听服务器分配的颜色
socket.on('assignColor', (color) => {
    myColor = color;
    alert(`你被分配为 ${color === 'black' ? '黑棋' : '白棋'}`); // 提示玩家他们的颜色
});

// 如果房间已满，则进入观战模式
socket.on('spectator', () => {
    myColor = 'spectator';
    alert('房间已满，你正在观战');
});

// 处理点击事件（仅允许当前玩家下棋）
canvas.addEventListener('click', (e) => {
    if (!myColor || myColor === 'spectator') return; // 观战者无法下棋

    const x = Math.floor(e.offsetX / cellSize);
    const y = Math.floor(e.offsetY / cellSize);
    if (board[x][y] !== null) return;

    // 发送数据给服务器
    socket.emit('move', { x, y });
});

// 监听服务器广播的棋子落子事件
socket.on('move', ({ x, y, isBlack }) => {
    board[x][y] = isBlack;
    drawPiece(x, y, isBlack);
});

// 监听非当前回合落子的情况
socket.on('notYourTurn', () => {
    alert('现在不是你的回合，请等待对手落子');
});

// 监听“刷新游戏”事件
socket.on('resetGame', () => {
    board = Array(size).fill().map(() => Array(size).fill(null)); // 清空棋盘
    drawBoard();
});

// 点击按钮，向服务器发送“重置游戏”请求
resetButton.addEventListener('click', () => {
    socket.emit('resetGame');
});

socket.on('connect', () => {
    console.log('✅ 成功连接到公网服务器！');
});

drawBoard();
