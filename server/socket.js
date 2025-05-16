const Message = require('./models/Message');
const Chat = require('./models/Chat');
const User = require('./models/User');

function setupSocket(io) {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('joinChat', (chatId) => {
      socket.join(chatId);
      console.log(`Socket ${socket.id} joined chat ${chatId}`);
    });

    socket.on('chatMessage', async ({ chatId, senderId, content }) => {
      try {
        const message = new Message({ chat: chatId, sender: senderId, content });
        const savedMessage = await message.save();
        await Chat.findByIdAndUpdate(chatId, { latestMessage: savedMessage._id });
        const sender = await User.findById(senderId).select('username');
        io.to(chatId).emit('message', { 
          chatId, 
          senderId, 
          senderName: sender ? sender.username : "Unknown", 
          content, 
          createdAt: savedMessage.createdAt 
        });
      } catch(err) {
        console.error('Error saving message:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}

module.exports = { setupSocket };