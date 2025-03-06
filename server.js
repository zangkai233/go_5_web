const PORT = process.env.PORT || 3000;
const io = require('socket.io')(PORT, {
    cors: { origin: '*' }
});

io.on('connection', (socket) => {
    console.log('A user connected');

    // 监听 `move` 事件，并广播给其他用户
    socket.on('move', (data) => {
        console.log(`棋子数据传输: x=${data.x}, y=${data.y}, 颜色=${data.isBlack ? '黑' : '白'}`);
        socket.broadcast.emit('move', data);
    });
});

console.log(`Socket.IO服务器已启动在端口: ${PORT}`);
