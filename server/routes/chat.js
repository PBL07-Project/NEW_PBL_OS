const express = require('express');
const jwt = require('jsonwebtoken');
const Chat = require('../models/Chat');
const Message = require('../models/Message'); 

const router = express.Router();

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch(err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

router.post('/group', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    const chat = new Chat({
      name,
      isGroupChat: true,
      users: [req.user.id]
    });
    await chat.save();
    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/group/join', authMiddleware, async (req, res) => {
  try {
    const { groupId } = req.body;
    const chat = await Chat.findOne({ _id: groupId, isGroupChat: true }).populate('users', 'username email');
    if (!chat) return res.status(404).json({ error: 'Group chat not found' });
    if (!chat.users.some(user => user._id.toString() === req.user.id)) {
      chat.users.push(req.user.id);
      await chat.save();
    }
    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/personal', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;
    let chat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [req.user.id, userId] }
    });
    if (!chat) {
      chat = new Chat({ isGroupChat: false, users: [req.user.id, userId] });
      await chat.save();
    }
    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/all', authMiddleware, async (req, res) => {
  try {
    const chats = await Chat.find({ users: { $in: [req.user.id] } })
      .populate('users', 'username email')
      .sort({ updatedAt: -1 });
    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/messages/:chatId', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .sort({ createdAt: 1 })
      .populate('sender', 'username');
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
