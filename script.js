const socket = io('https://go-5-web.onrender.com'); // 确保这里的地址正确

const canvas = document.getElementById('chessboard');
const context = canvas.getContext('2d');
const resetButton = document.getElementById('resetGame'); 
const emojiButton = document.getElementById('sendEmoji'); 
const emojiImg = document.getElementById('emoji');
const size = 15;
const cellSize = canvas.width / size;
let board = Array(size).fill().map(() => Array(size).fill(null));
let myColor = null; 

// 绘制棋盘
function drawBoard() {
    context.fillStyle = "#DEB887";
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.strokeStyle = "black";
    for (let i = 0; i <= size; i++) {
        context.beginPath();
        context.moveTo(i * cellSize, 0);
        context.lineTo(i * cellSize, canvas.height);
        context.moveTo(0, i * cellSize);
        context.lineTo(canvas.width, i * cellSize);
        context.stroke();
    }
}

// 监听服务器分配的颜色
socket.on('assignColor', (color) => {
    myColor = color;
    alert(`你现在的颜色是: ${color === 'black' ? '黑棋' : '白棋'}`);
});

// 如果房间已满，则进入观战模式
socket.on('spectator', () => {
    myColor = 'spectator';
    alert('房间已满，你正在观战');
});

// 处理点击事件（仅允许当前玩家下棋）
canvas.addEventListener('click', (e) => {
    if (!myColor || myColor === 'spectator') return; 

    const x = Math.floor(e.offsetX / cellSize);
    const y = Math.floor(e.offsetY / cellSize);
    if (board[x][y] !== null) return;

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

// 监听“刷新游戏”事件，交换颜色并清空棋盘
socket.on('resetGame', () => {
    board = Array(size).fill().map(() => Array(size).fill(null));
    drawBoard();
});

// 点击按钮，向服务器发送“重置游戏”请求
resetButton.addEventListener('click', () => {
    socket.emit('resetGame');
});

// 🎉 监听发送表情包事件
emojiButton.addEventListener('click', () => {
    socket.emit('sendEmoji');
});

// 监听服务器广播的表情包事件，显示表情
socket.on('sendEmoji', () => {
    emojiImg.style.display = 'block'; // 显示表情
    setTimeout(() => {
        emojiImg.style.display = 'none'; // 3秒后隐藏
    }, 3000);
});

socket.on('connect', () => {
    console.log('✅ 成功连接到公网服务器！');
});

drawBoard();
