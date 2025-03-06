const PORT = process.env.PORT || 3000;  // Render动态分配端口
const io = require('socket.io')(PORT, {
    cors: { origin: '*' }
});

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('move', (data) => {
        socket.broadcast.emit('move', data);
    });
});

console.log(`Socket.IO服务器已启动在端口: ${PORT}`);
