const PORT = process.env.PORT || 3000;
const io = require('socket.io')(PORT, {
    cors: { origin: '*' }
});

let users = []; // 存储已连接的用户，最多2人
let currentTurn = 'black'; // 轮到谁落子

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // 分配颜色（先来的是黑棋，后来的白棋）
    if (users.length < 2) {
        const assignedColor = users.length === 0 ? 'black' : 'white';
        users.push({ id: socket.id, color: assignedColor });
        socket.emit('assignColor', assignedColor);
        console.log(`分配给 ${socket.id} 颜色: ${assignedColor}`);
    } else {
        // 如果已经有两个人，通知第三个玩家观战模式
        socket.emit('spectator');
    }

    // 监听 `move` 事件
    socket.on('move', (data) => {
        const user = users.find(u => u.id === socket.id);
        if (!user) return; // 如果用户不在游戏中，忽略

        // 确保只有轮到的玩家才能下棋
        if (user.color !== currentTurn) {
            socket.emit('notYourTurn');
            return;
        }

        console.log(`棋子数据传输: x=${data.x}, y=${data.y}, 颜色=${user.color}`);
        io.emit('move', { x: data.x, y: data.y, isBlack: user.color === 'black' });

        // 轮换回合
        currentTurn = currentTurn === 'black' ? 'white' : 'black';
    });

    // 处理断线
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
        users = users.filter(u => u.id !== socket.id);
        if (users.length === 0) {
            currentTurn = 'black'; // 重置游戏
        }
    });
});

console.log(`Socket.IO服务器已启动在端口: ${PORT}`);
