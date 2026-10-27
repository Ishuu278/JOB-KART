// v2 migration + seeding: single-recruiter admin model
// - Migrates legacy 'interview' status → 'interviewScheduled'
// - Backfills statusHistory for old applications
// - Creates the OFFICIAL recruiter account from .env (exactly one)
// - Seeds a sample conversation + notifications for demo richness
const path = require('path');
// Use the SAME mongoose instance the backend models use
const mongoose = require('../backend/node_modules/mongoose');
require('dotenv').config({ path: path.join(__dirname, '..', 'backend', '.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/JOB-DATA';
const User = require('../backend/models/User');
const Application = require('../backend/models/Application');
const Job = require('../backend/models/Job');
const Message = require('../backend/models/Message');
const Notification = require('../backend/models/Notification');
const bcrypt = require('../backend/node_modules/bcryptjs');

(async () => {
  await mongoose.connect(MONGO_URI);
  console.log('connected');

  // 1. Migrate legacy statuses
  const appsToMigrate = await Application.find({ status: 'interview' });
  for (const a of appsToMigrate) {
    a.status = 'interviewScheduled';
    await a.save();
  }
  console.log('migrated interview → interviewScheduled:', appsToMigrate.length);

  // 2. Backfill statusHistory for apps missing it
  const noHistory = await Application.find({ statusHistory: { $exists: false } });
  for (const a of noHistory) {
    a.statusHistory = [{ status: a.status, changedAt: a.updatedAt || new Date(), note: '' }];
    await a.save();
  }
  console.log('backfilled statusHistory:', noHistory.length);

  // 3. Ensure exactly ONE official recruiter from .env
  const email = (process.env.RECRUITER_EMAIL || 'recruiter@jobkart.in').toLowerCase();
  const password = process.env.RECRUITER_PASSWORD || 'Recruit@2026';
  let recruiter = await User.findOne({ role: 'recruiter' });
  if (!recruiter) {
    const salt = await bcrypt.genSalt(12);
    recruiter = await User.create({
      name: 'Job-Kart Recruiter',
      email,
      password: await bcrypt.hash(password, salt),
      role: 'recruiter',
      companyId: await Job.findOne().select('companyId').then(j => j ? j.companyId : null)
    });
    console.log('official recruiter created:', email);
  } else {
    // make sure the fixed credentials work on it
    recruiter.email = email;
    recruiter.password = await bcrypt.hash(password, await bcrypt.genSalt(12));
    await recruiter.save();
    console.log('official recruiter updated:', email);
  }
  // demote any other recruiters (there must be exactly one)
  const others = await User.find({ role: 'recruiter', _id: { $ne: recruiter._id } });
  if (others.length) {
    console.log('demoting extra recruiters:', others.map(o => o.email).join(', '));
    await User.updateMany({ role: 'recruiter', _id: { $ne: recruiter._id } }, { $set: { role: 'candidate' } });
  }

  // 4. Sample chat: recruiter ↔ aisha on her first application's job
  const aisha = await User.findOne({ email: 'aisha@demo.com' });
  if (aisha) {
    const firstApp = await Application.findOne({ candidateId: aisha._id }).populate('jobId');
    if (firstApp && firstApp.jobId) {
      const convId = `${aisha._id}_${firstApp.jobId._id}`;
      const existing = await Message.countDocuments({ conversationId: convId });
      if (existing === 0) {
        await Message.create({ conversationId: convId, senderId: recruiter._id, receiverId: aisha._id, text: `Hi ${aisha.name.split(' ')[0]}! Thanks for applying to ${firstApp.jobId.title}. Could you share more about your React project?` });
        await Message.create({ conversationId: convId, senderId: aisha._id, receiverId: recruiter._id, text: 'Thank you! I built a full-stack job portal (Job-Kart) with React, Node and MongoDB — happy to walk you through it.' });
        await Message.create({ conversationId: convId, senderId: recruiter._id, receiverId: aisha._id, text: 'Impressive. Let\'s schedule a chat this week.' });
        console.log('sample chat seeded on conversation', convId.slice(-20));
      }

      // notifications for aisha
      const notifCount = await Notification.countDocuments({ userId: aisha._id });
      if (notifCount === 0) {
        await Notification.create({ userId: aisha._id, type: 'new_message', title: 'New message', body: `Recruiter sent you a message regarding ${firstApp.jobId.title}.` });
        await Notification.create({ userId: aisha._id, type: 'status_update', title: 'Application update', body: `Your application for ${firstApp.jobId.title} is now under review.` });
        console.log('sample notifications seeded for aisha');
      }
    }
  }

  console.log('V2 SEED COMPLETE');
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
