const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Coding', 'Chess', 'Business', 'DIY', 'Music', 'Art', 'Language', 'Fitness', 'Cooking', 'Other'],
    },
    level: {
      type: String,
      required: true,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
    },
    tags: [{ type: String, trim: true }],
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    averageRating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Text index for search
skillSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Skill', skillSchema);
