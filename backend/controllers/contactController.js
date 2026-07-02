const ContactMessage = require('../models/ContactMessage');

exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please provide name, email, and message' });
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      phone: phone || '',
      service: service || '',
      message
    });

    res.status(201).json({ message: 'Message sent successfully', id: contactMessage._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getContacts = async (req, res) => {
  try {
    const contacts = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
