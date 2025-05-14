const Message = require('../models/Message');
const Room = require('../models/Room');

exports.sendMessage = async (req, res) => {
  const { content, recipient, room } = req.body;
  const sender = req.user.id;

  const message = new Message({ sender, recipient, content, room });

  try {
    await message.save();
    res.status(200).json({ message });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message' });
  }
};

exports.getMessages = async (req, res) => {
  const { room } = req.params;

  try {
    const messages = await Message.find({ room }).populate('sender recipient');
    res.status(200).json({ messages });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};
