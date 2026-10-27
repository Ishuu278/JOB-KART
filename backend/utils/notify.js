const Notification = require('../models/Notification');

/**
 * Create a notification and push it live to the recipient.
 * @param {Object} io socket.io server (from req.io)
 * @param {Object} opts { userId, type, title, body, applicationId, link }
 */
async function createAndEmit(io, opts) {
  const notification = await Notification.create({
    userId: opts.userId,
    type: opts.type,
    title: opts.title,
    body: opts.body || '',
    applicationId: opts.applicationId || null,
    link: opts.link || ''
  });

  if (io) {
    io.to(String(opts.userId)).emit('notification:new', { notification });
  }

  return notification;
}

module.exports = { createAndEmit };
