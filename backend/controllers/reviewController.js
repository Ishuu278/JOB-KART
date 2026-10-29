const mongoose = require('mongoose');
const Review = require('../models/Review');
const Company = require('../models/Company');

// Recompute a company's aggregate rating from its reviews.
async function recalcCompanyRating(companyId) {
  const reviews = await Review.find({ companyId });

  if (reviews.length === 0) {
    await Company.findByIdAndUpdate(companyId, {
      rating: { score: '0.0', total: '0 Reviews', bars: [0, 0, 0, 0, 0] }
    });
    return;
  }

  const totalStars = reviews.reduce((sum, r) => sum + r.stars, 0);
  const bars = [0, 0, 0, 0, 0];
  reviews.forEach(r => {
    if (r.stars >= 1 && r.stars <= 5) bars[5 - r.stars]++;
  });

  await Company.findByIdAndUpdate(companyId, {
    rating: {
      score: (totalStars / reviews.length).toFixed(1),
      total: `${reviews.length} Reviews`,
      bars: bars.map(b => Math.round((b / reviews.length) * 100))
    }
  });
}

exports.getReviews = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.companyId)) {
      return res.status(404).json({ message: 'Company not found' });
    }
    const { sort = 'newest' } = req.query;
    let sortOption = { createdAt: -1 };

    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'highest') sortOption = { stars: -1 };
    if (sort === 'lowest') sortOption = { stars: 1 };

    const reviews = await Review.find({ companyId: req.params.companyId })
      .sort(sortOption);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { companyId, stars, text, role } = req.body;

    if (!companyId || !/^[0-9a-fA-F]{24}$/.test(String(companyId))) {
      return res.status(400).json({ message: 'A valid companyId is required' });
    }

    const rating = Number(stars);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be a whole number between 1 and 5' });
    }

    const body = String(text || '').trim();
    if (body.length < 5) {
      return res.status(400).json({ message: 'Please write at least 5 characters of review text' });
    }

    const company = await Company.findById(companyId).select('_id');
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // One review per user per company — otherwise the aggregate rating can be spammed.
    const existing = await Review.findOne({ companyId, userId: req.user._id });
    if (existing) {
      return res.status(409).json({ message: 'You have already reviewed this company' });
    }

    const review = await Review.create({
      companyId,
      userId: req.user._id,
      author: req.user.name,
      stars: rating,
      text: body,
      role: String(role || '').trim().slice(0, 60)
    });

    await recalcCompanyRating(companyId);
    res.status(201).json(review);
  } catch (error) {
    if (error && error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Review not found' });
    }
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const isOwner = String(review.userId) === String(req.user._id);
    if (req.user.role !== 'recruiter' && !isOwner) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await Review.deleteOne({ _id: review._id });
    await recalcCompanyRating(review.companyId);
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
