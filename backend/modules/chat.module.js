const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Case",
  },
  sender: {
    type: String, // "Doctor" or "Bot"
    required: true,
  },
  message: {
    type: String, // Chat message content
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
