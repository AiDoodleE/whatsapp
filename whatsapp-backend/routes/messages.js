const express = require('express');
const Message = require('../models/Messages');
const router = express.Router();

// Get all conversations grouped by wa_id
router.get('/conversations', async (req, res) => {
  const messages = await Message.aggregate([
    { $sort: { timestamp: -1 } },
    {
      $group: {
        _id: '$wa_id',
        name: { $first: '$name' },
        lastMessage: { $first: '$text' },
        lastTime: { $first: '$timestamp' }
      }
    },
    { $sort: { lastTime: -1 } }
  ]);
  res.json(messages);
});

// Get messages for one user
router.get('/messages/:wa_id', async (req, res) => {
  try {
    const messages = await Message.find({ wa_id: req.params.wa_id })
      .sort({ timestamp: 1 })
      .lean(); // Convert to plain JavaScript objects

    // Transform the data for better frontend consumption
    const formattedMessages = messages.map(msg => ({
      id: msg._id,
      message_id: msg.message_id,
      wa_id: msg.wa_id,
      name: msg.name,
      text: msg.text,
      type: msg.type,
      timestamp: msg.timestamp,
      status: msg.status,
      // Include any other relevant fields
      ...(msg.raw_payload && { raw_payload: msg.raw_payload })
    }));

    res.json(formattedMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Send message (demo)
router.post('/messages', async (req, res) => {
  const { wa_id, name, text } = req.body;
  const newMsg = await Message.create({
    wa_id,
    name,
    text,
    timestamp: new Date(),
    status: 'sent',
    message_id: Date.now().toString()
  });
  res.json(newMsg);
});

module.exports = router;
