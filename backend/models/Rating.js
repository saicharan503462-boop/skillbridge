const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    skill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true }
);

// A user can only rate a skill once
ratingSchema.index({ skill: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
