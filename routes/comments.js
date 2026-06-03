const express = require('express');
const Comment = require('../models/Comment');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/comments/:skillId
router.get('/:skillId', async (req, res) => {
  try {
    const comments = await Comment.find({ skill: req.params.skillId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/comments/:skillId
router.post('/:skillId', protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Comment cannot be empty' });
    }

    const comment = await Comment.create({
      skill: req.params.skillId,
      user: req.user._id,
      text: text.trim(),
    });

    await comment.populate('user', 'name');
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/comments/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
