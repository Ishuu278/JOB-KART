const ContactMessage = require('../models/ContactMessage');

exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please provide name, email, and message' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    const contactMessage = await ContactMessage.create({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone || '').trim(),
      service: String(service || '').trim(),
      message: String(message).trim()
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
