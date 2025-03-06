const PORT = process.env.PORT || 3000;
const io = require('socket.io')(PORT, {
    cors: { origin: '*' }
});

let users = []; 
let currentTurn = 'black'; 

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    if (users.length < 2) {
        const assignedColor = users.length === 0 ? 'black' : 'white';
        users.push({ id: socket.id, color: assignedColor });
        socket.emit('assignColor', assignedColor);
        console.log(`分配给 ${socket.id} 颜色: ${assignedColor}`);
    } else {
        socket.emit('spectator');
    }

    socket.on('move', (data) => {
        const user = users.find(u => u.id === socket.id);
        if (!user) return; 

        if (user.color !== currentTurn) {
            socket.emit('notYourTurn');
            return;
        }

        io.emit('move', { x: data.x, y: data.y, isBlack: user.color === 'black' });
        currentTurn = currentTurn === 'black' ? 'white' : 'black';
    });

    socket.on('resetGame', () => {
        if (users.length === 2) {
            users.forEach(user => {
                user.color = user.color === 'black' ? 'white' : 'black';
                io.to(user.id).emit('assignColor', user.color);
            });
        }
        io.emit('resetGame');
        currentTurn = 'black';
    });

    // 🎉 监听表情包事件并广播
    socket.on('sendEmoji', () => {
        io.emit('sendEmoji');
    });

    socket.on('disconnect', () => {
        users = users.filter(u => u.id !== socket.id);
    });
});

console.log(`Socket.IO服务器已启动在端口: ${PORT}`);
