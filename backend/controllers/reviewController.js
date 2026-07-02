const Review = require('../models/Review');
const Company = require('../models/Company');

exports.getReviews = async (req, res) => {
  try {
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
    const { companyId, stars, text, author, role } = req.body;

    const review = await Review.create({
      companyId,
      userId: req.user._id,
      author: author || req.user.name,
      role: role || '',
      stars,
      text
    });

    const reviews = await Review.find({ companyId });
    const totalStars = reviews.reduce((sum, r) => sum + r.stars, 0);
    const avgScore = (totalStars / reviews.length).toFixed(1);

    const bars = [0, 0, 0, 0, 0];
    reviews.forEach(r => {
      if (r.stars >= 1 && r.stars <= 5) bars[5 - r.stars]++;
    });
    const barsPercent = bars.map(b => Math.round((b / reviews.length) * 100));

    await Company.findByIdAndUpdate(companyId, {
      rating: {
        score: avgScore,
        total: `${reviews.length} Reviews`,
        bars: barsPercent
      }
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
