const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // WhatsApp message identifiers
  message_id: { type: String, required: true, unique: true, index: true },
  wa_id: { type: String, required: true, index: true }, // The WhatsApp ID of the sender
  recipient_id: { type: String, index: true }, // The WhatsApp ID of the recipient
  
  // Message content
  type: { type: String, enum: ['text', 'image', 'video', 'document', 'audio', 'location', 'contacts', 'interactive', 'button'], default: 'text' },
  text: { type: String, default: '' },
  
  // Contact information
  name: { type: String, index: true }, // Sender's name
  
  // Status tracking
  status: { 
    type: String, 
    enum: ['sent', 'delivered', 'read', 'failed', 'deleted'],
    default: 'sent',
    index: true
  },
  
  // Timestamps
  timestamp: { type: Date, required: true, index: true }, // WhatsApp timestamp
  status_timestamp: { type: Date, index: true }, // When the status was last updated
  
  // Additional metadata
  phone_number_id: String, // The WhatsApp Business Account phone number ID
  display_phone_number: String, // Display phone number
  
  // Raw payload storage
  raw_payload: { type: mongoose.Schema.Types.Mixed }, // Complete original message
  status_updates: [{
    status: String,
    timestamp: Date,
    raw_payload: mongoose.Schema.Types.Mixed
  }]
}, { 
  timestamps: true,
  collection: 'processed_messages',
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for common queries
messageSchema.index({ 'wa_id': 1, 'timestamp': -1 });
messageSchema.index({ 'recipient_id': 1, 'timestamp': -1 });
messageSchema.index({ 'status': 1, 'timestamp': -1 });

module.exports = mongoose.model('Message', messageSchema);