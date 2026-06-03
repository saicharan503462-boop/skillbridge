const express = require('express');
const Rating = require('../models/Rating');
const Skill = require('../models/Skill');
const { protect } = require('../middleware/auth');

const router = express.Router();

// POST /api/ratings/:skillId — rate a skill
router.post('/:skillId', protect, async (req, res) => {
  try {
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const skill = await Skill.findById(req.params.skillId);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });

    // Prevent creator from rating own skill
    if (skill.creator.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot rate your own skill' });
    }

    // Upsert: update if exists, create if not
    const existing = await Rating.findOne({ skill: req.params.skillId, user: req.user._id });

    if (existing) {
      existing.rating = rating;
      await existing.save();
    } else {
      await Rating.create({ skill: req.params.skillId, user: req.user._id, rating });
    }

    // Recalculate average
    const allRatings = await Rating.find({ skill: req.params.skillId });
    const avg = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;

    skill.averageRating = Math.round(avg * 10) / 10;
    skill.ratingCount = allRatings.length;
    await skill.save();

    res.json({ averageRating: skill.averageRating, ratingCount: skill.ratingCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/ratings/:skillId/mine — get current user's rating for a skill
router.get('/:skillId/mine', protect, async (req, res) => {
  try {
    const rating = await Rating.findOne({ skill: req.params.skillId, user: req.user._id });
    res.json({ rating: rating ? rating.rating : null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
