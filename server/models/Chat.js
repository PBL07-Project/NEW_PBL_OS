const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema(
  {
  
    name: { type: String, required: function() { return this.isGroupChat; } },
    isGroupChat: { type: Boolean, default: false },
 
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chat', ChatSchema);