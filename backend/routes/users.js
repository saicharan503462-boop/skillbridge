const express = require('express');
const User = require('../models/User');
const Skill = require('../models/Skill');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/users/:id — public profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const skills = await Skill.find({ creator: req.params.id }).sort({ createdAt: -1 });

    const avgRating =
      skills.length > 0
        ? skills.reduce((sum, s) => sum + s.averageRating, 0) / skills.length
        : 0;

    res.json({
      user,
      skills,
      stats: {
        skillCount: skills.length,
        avgRating: Math.round(avgRating * 10) / 10,
        followerCount: user.followers.length,
        followingCount: user.following.length,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/me — update own profile
router.put('/me', protect, async (req, res) => {
  try {
    const { name, bio } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio },
      { new: true, runValidators: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/users/:id/follow
router.post('/:id/follow', protect, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    const isFollowing = targetUser.followers.map((f) => f.toString()).includes(req.user._id.toString());

    if (isFollowing) {
      targetUser.followers = targetUser.followers.filter((f) => f.toString() !== req.user._id.toString());
      req.user.following = req.user.following.filter((f) => f.toString() !== req.params.id);
    } else {
      targetUser.followers.push(req.user._id);
      req.user.following.push(targetUser._id);
    }

    await targetUser.save();
    await req.user.save();

    res.json({ following: !isFollowing, followerCount: targetUser.followers.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
