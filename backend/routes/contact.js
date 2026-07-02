const express = require('express');
const router = express.Router();
const { submitContact, getContacts } = require('../controllers/contactController');

router.post('/', submitContact);
router.get('/', getContacts);

module.exports = router;
