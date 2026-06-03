import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const CATEGORIES = ['Coding', 'Chess', 'Business', 'DIY', 'Music', 'Art', 'Language', 'Fitness', 'Cooking', 'Other'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export default function Upload() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
    category: '',
    level: '',
    tags: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title || !form.description || !form.videoUrl || !form.category || !form.level) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const tags = form.tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const res = await api.post('/skills', { ...form, tags });
      navigate(`/skill/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload skill. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-white mb-2">Upload a Skill</h1>
        <p className="text-gray-400">Share your expertise with the community</p>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-800/50 text-red-400 rounded-xl px-4 py-3 mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-display text-gray-300 mb-1.5">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="title"
            className="input"
            placeholder="e.g. Learn Chess Openings in 30 Minutes"
            value={form.title}
            onChange={handleChange}
            maxLength={120}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-display text-gray-300 mb-1.5">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            name="description"
            className="input resize-none"
            rows={5}
            placeholder="What will people learn? What level is this for? Any prerequisites?"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        {/* Video URL */}
        <div>
          <label className="block text-sm font-display text-gray-300 mb-1.5">
            YouTube Video URL <span className="text-red-400">*</span>
          </label>
          <input
            type="url"
            name="videoUrl"
            className="input"
            placeholder="https://www.youtube.com/watch?v=..."
            value={form.videoUrl}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-600 mt-1">Paste a YouTube link (watch or youtu.be format)</p>
        </div>

        {/* Category + Level */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-display text-gray-300 mb-1.5">
              Category <span className="text-red-400">*</span>
            </label>
            <select name="category" className="input" value={form.category} onChange={handleChange}>
              <option value="">Select category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-display text-gray-300 mb-1.5">
              Skill Level <span className="text-red-400">*</span>
            </label>
            <select name="level" className="input" value={form.level} onChange={handleChange}>
              <option value="">Select level</option>
              {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-display text-gray-300 mb-1.5">
            Tags <span className="text-gray-600 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            name="tags"
            className="input"
            placeholder="chess, openings, strategy, beginner (comma-separated)"
            value={form.tags}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-600 mt-1">Separate tags with commas</p>
        </div>

        {/* Preview if URL exists */}
        {form.videoUrl && (
          <div className="card p-4">
            <p className="text-xs font-mono text-brand-400 mb-2">Video URL preview</p>
            <p className="text-xs text-gray-500 font-mono break-all">{form.videoUrl}</p>
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-base"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Publishing…
              </span>
            ) : (
              'Publish Skill'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
