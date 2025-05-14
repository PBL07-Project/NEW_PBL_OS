module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('joinRoom', (room) => {
      socket.join(room);
      console.log(`User joined room: ${room}`);
    });

    socket.on('sendMessage', (data) => {
      io.to(data.room).emit('receiveMessage', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};
