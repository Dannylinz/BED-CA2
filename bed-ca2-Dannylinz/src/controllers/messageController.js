//Naing Lin Htet 2329606 DISM/FT/2B/21
const model = require('../models/messageModel.js');

module.exports.getAllMessages = (req, res) => {
    console.log('GET /api/messages route hit');
    model.getAllMessages((error, results) => {
        if (error) {
            console.error('Error fetching messages:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            console.log('Fetched messages:', results);
            res.status(200).json(results);
        }
    });
};

module.exports.createMessage = (req, res) => {
    const { user_id, username, message_text } = req.body;
    console.log('POST /api/messages route hit with body:', req.body);
    model.createMessage({ user_id, username, message_text }, (error, results) => {
        if (error) {
            console.error('Error creating message:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            res.status(201).json({ message: 'Message created successfully' });
        }
    });
};

module.exports.updateMessage = (req, res) => {
    const { id } = req.params;
    const { message_text } = req.body;
    model.updateMessage(id, { message_text }, (error, results) => {
        if (error) {
            console.error('Error updating message:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            res.status(200).json({ message: 'Message updated successfully' });
        }
    });
};

module.exports.deleteMessage = (req, res) => {
    const messageId = parseInt(req.params.id);

    if (!messageId) {
        return res.status(400).json({ message: "Invalid message ID" });
    }

    model.deleteMessageById(messageId, (error, results) => {
        if (error) {
            console.error("Error deleting message:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Message not found" });
        }

        res.status(200).json({ message: "Message deleted successfully" });
    });
};