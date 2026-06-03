import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import SkillCard, { SkillCardSkeleton } from '../components/SkillCard';

const CATEGORIES = ['', 'Coding', 'Chess', 'Business', 'DIY', 'Music', 'Art', 'Language', 'Fitness', 'Cooking', 'Other'];
const LEVELS = ['', 'Beginner', 'Intermediate', 'Advanced'];
const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'top_rated', label: 'Top Rated' },
  { value: 'most_viewed', label: 'Most Viewed' },
  { value: 'oldest', label: 'Oldest' },
];

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [skills, setSkills] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  const category = searchParams.get('category') || '';
  const level = searchParams.get('level') || '';
  const sort = searchParams.get('sort') || 'newest';
  const search = searchParams.get('search') || '';
  const page = Number(searchParams.get('page') || 1);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    next.delete('page'); // reset to page 1 on filter change
    setSearchParams(next);
  };

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (category) params.category = category;
      if (level) params.level = level;
      if (sort) params.sort = sort;

      const res = await api.get('/skills', { params });
      setSkills(res.data.skills);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, category, level, sort, page]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setParam('search', searchInput.trim());
  };

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-white mb-2">Explore Skills</h1>
        <p className="text-gray-400">
          {total > 0 ? `${total} skill${total !== 1 ? 's' : ''} found` : 'Discover structured learning content'}
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearchSubmit} className="relative mb-6">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
          width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          className="input pl-11 pr-24"
          placeholder="Search skills, topics, keywords…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-1.5 px-4 text-sm">
          Search
        </button>
      </form>

      {/* Filters row */}
      <div className="flex flex-wrap gap-3 mb-8">
        {/* Category */}
        <select
          className="input w-auto py-2 text-sm"
          value={category}
          onChange={(e) => setParam('category', e.target.value)}
        >
          <option value="">All Categories</option>
          {CATEGORIES.slice(1).map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Level */}
        <select
          className="input w-auto py-2 text-sm"
          value={level}
          onChange={(e) => setParam('level', e.target.value)}
        >
          <option value="">All Levels</option>
          {LEVELS.slice(1).map((l) => <option key={l} value={l}>{l}</option>)}
        </select>

        {/* Sort */}
        <select
          className="input w-auto py-2 text-sm"
          value={sort}
          onChange={(e) => setParam('sort', e.target.value)}
        >
          {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>

        {/* Active filter tags */}
        {(search || category || level) && (
          <button
            onClick={() => {
              setSearchInput('');
              setSearchParams({});
            }}
            className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 px-3 py-2 bg-red-900/20 border border-red-900/30 rounded-xl transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
            Clear filters
          </button>
        )}
      </div>

      {/* Skills grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array(12).fill(0).map((_, i) => <SkillCardSkeleton key={i} />)}
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-display text-xl text-gray-300 mb-2">No skills found</h3>
          <p className="text-gray-500 text-sm">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {skills.map((skill) => <SkillCard key={skill._id} skill={skill} />)}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            disabled={page <= 1}
            onClick={() => setParam('page', page - 1)}
            className="btn-secondary py-2 px-4 text-sm disabled:opacity-40"
          >
            ← Prev
          </button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setParam('page', p)}
              className={`w-9 h-9 rounded-xl text-sm font-display font-medium transition-colors ${
                p === page
                  ? 'bg-brand-500 text-white'
                  : 'bg-surface-card border border-surface-border text-gray-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            disabled={page >= pages}
            onClick={() => setParam('page', page + 1)}
            className="btn-secondary py-2 px-4 text-sm disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
