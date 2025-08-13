const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Message = require('../models/Messages');

/**
 * Extracts messages from WhatsApp webhook payload
 */
function extractMessages(payload) {
  try {
    if (!payload.metaData?.entry) return [];
    
    const messages = [];
    
    for (const entry of payload.metaData.entry) {
      if (!entry.changes) continue;
      
      for (const change of entry.changes) {
        if (change.field !== 'messages' || !change.value?.messages) continue;
        
        const contact = change.value.contacts?.[0];
        
        for (const msg of change.value.messages) {
          messages.push({
            wa_id: msg.from,
            name: contact?.profile?.name || 'Unknown',
            text: msg.text?.body || '',
            timestamp: new Date(parseInt(msg.timestamp) * 1000),
            message_id: msg.id,
            type: msg.type,
            status: 'sent',
            raw_payload: msg
          });
        }
      }
    }
    
    return messages;
  } catch (error) {
    console.error('Error extracting messages:', error);
    return [];
  }
}

/**
 * Extracts status updates from WhatsApp webhook payload
 */
function extractStatusUpdates(payload) {
  try {
    if (!payload.metaData?.entry) return [];
    
    const statusUpdates = [];
    
    for (const entry of payload.metaData.entry) {
      if (!entry.changes) continue;
      
      for (const change of entry.changes) {
        if (change.field !== 'statuses' || !change.value?.statuses) continue;
        
        for (const status of change.value.statuses) {
          statusUpdates.push({
            message_id: status.id,
            status: status.status.toLowerCase(),
            timestamp: new Date(parseInt(status.timestamp) * 1000),
            recipient_id: status.recipient_id,
            raw_payload: status
          });
        }
      }
    }
    
    return statusUpdates;
  } catch (error) {
    console.error('Error extracting status updates:', error);
    return [];
  }
}

async function processPayloads() {
  try {
    // Use the correct path to the sample payloads directory
    const sourceDir = path.resolve(__dirname, '../../whatsapp sample payloads');
    const archiveDir = path.join(sourceDir, 'processed');
    
    // Check if source directory exists
    if (!fs.existsSync(sourceDir)) {
      console.log('❌ Source payloads directory not found:', sourceDir);
      return { 
        success: false, 
        message: 'Source payloads directory not found',
        directory: sourceDir
      };
    }

    // Create archive directory if it doesn't exist
    if (!fs.existsSync(archiveDir)) {
      fs.mkdirSync(archiveDir, { recursive: true });
    }

    const files = fs.readdirSync(sourceDir).filter(file => file.endsWith('.json'));
    if (files.length === 0) {
      return { 
        success: true, 
        message: 'No JSON payload files found in the source directory.',
        directory: sourceDir
      };
    }

    let processedCount = 0;
    const session = await mongoose.startSession();
    
    try {
      session.startTransaction();
      
      for (const file of files) {
        const filePath = path.join(sourceDir, file);
        console.log(`🔍 Processing file: ${file}`);
        
        try {
          const payload = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          
          // Process messages
          const messages = extractMessages(payload);
          for (const msg of messages) {
            await Message.updateOne(
              { message_id: msg.message_id },
              { $set: msg },
              { upsert: true, session }
            );
            console.log(`✅ Processed message: ${msg.message_id}`);
            processedCount++;
          }
          
          // Process status updates
          const statusUpdates = extractStatusUpdates(payload);
          for (const status of statusUpdates) {
            await Message.updateOne(
              { message_id: status.message_id },
              { 
                $set: { 
                  status: status.status,
                  'raw_payload.status_update': status.raw_payload,
                  updatedAt: new Date()
                } 
              },
              { session }
            );
            console.log(`✅ Updated status for message ${status.message_id}: ${status.status}`);
            processedCount++;
          }
          
          // Move file to archive
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const newFileName = `${path.parse(file).name}_${timestamp}${path.extname(file)}`;
          fs.renameSync(
            filePath,
            path.join(archiveDir, newFileName)
          );
          console.log(`📦 Archived: ${file} -> ${newFileName}`);
          
        } catch (error) {
          console.error(`❌ Error processing file ${file}:`, error.message);
          // Continue with next file even if one fails
        }
      }
      
      await session.commitTransaction();
      return { 
        success: true, 
        processed: processedCount,
        message: `Successfully processed ${processedCount} payloads.`
      };
      
    } catch (error) {
      await session.abortTransaction();
      console.error('Transaction aborted due to error:', error);
      throw error;
    } finally {
      session.endSession();
    }
    
  } catch (error) {
    console.error('Error in processPayloads:', error);
    return { 
      success: false, 
      error: error.message,
      message: 'Failed to process payloads.'
    };
  }
}

module.exports = { processPayloads };
