const express = require('express');
const Skill = require('../models/Skill');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/skills — list with search & filters
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { search, category, level, sort = 'newest', page = 1, limit = 12 } = req.query;

    const query = {};

    if (search) {
      query.$text = { $search: search };
    }
    if (category) query.category = category;
    if (level) query.level = level;

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      top_rated: { averageRating: -1 },
      most_viewed: { views: -1 },
    };

    const skills = await Skill.find(query)
      .populate('creator', 'name')
      .sort(sortOptions[sort] || sortOptions.newest)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Skill.countDocuments(query);

    res.json({ skills, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/skills/trending — top rated recent skills
router.get('/trending', async (req, res) => {
  try {
    const skills = await Skill.find({ ratingCount: { $gte: 0 } })
      .populate('creator', 'name')
      .sort({ averageRating: -1, createdAt: -1 })
      .limit(6);
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/skills/recent
router.get('/recent', async (req, res) => {
  try {
    const skills = await Skill.find()
      .populate('creator', 'name')
      .sort({ createdAt: -1 })
      .limit(8);
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/skills/:id
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id).populate('creator', 'name email bio');
    if (!skill) return res.status(404).json({ message: 'Skill not found' });

    // Increment views
    skill.views += 1;
    await skill.save();

    res.json(skill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/skills — create
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, videoUrl, category, level, tags } = req.body;

    if (!title || !description || !videoUrl || !category || !level) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const skill = await Skill.create({
      title,
      description,
      videoUrl,
      category,
      level,
      tags: tags || [],
      creator: req.user._id,
    });

    await skill.populate('creator', 'name');
    res.status(201).json(skill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/skills/:id — update
router.put('/:id', protect, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });

    if (skill.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, description, videoUrl, category, level, tags } = req.body;
    Object.assign(skill, { title, description, videoUrl, category, level, tags });
    await skill.save();

    res.json(skill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/skills/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });

    if (skill.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await skill.deleteOne();
    res.json({ message: 'Skill deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/skills/:id/like
router.post('/:id/like', protect, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });

    const userId = req.user._id.toString();
    const liked = skill.likes.map((l) => l.toString()).includes(userId);

    if (liked) {
      skill.likes = skill.likes.filter((l) => l.toString() !== userId);
    } else {
      skill.likes.push(req.user._id);
    }

    await skill.save();
    res.json({ likes: skill.likes.length, liked: !liked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
