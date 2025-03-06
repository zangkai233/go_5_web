const io = require('socket.io')(3000, {
    cors: { origin: '*' }
});

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('move', (data) => {
        socket.broadcast.emit('move', data);
    });
});

console.log('Socket.IO服务器已启动在：http://localhost:3000');
