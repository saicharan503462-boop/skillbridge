import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import { getYouTubeEmbedUrl, timeAgo, levelBadgeClass, categoryColors } from '../utils/helpers';

export default function SkillPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [skill, setSkill] = useState(null);
  const [comments, setComments] = useState([]);
  const [myRating, setMyRating] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [skillRes, commentsRes] = await Promise.all([
          api.get(`/skills/${id}`),
          api.get(`/comments/${id}`),
        ]);
        setSkill(skillRes.data);
        setLikeCount(skillRes.data.likes?.length || 0);
        if (user) {
          setLiked(skillRes.data.likes?.map(l => l.toString()).includes(user._id));
        }
        setComments(commentsRes.data);

        if (user) {
          const ratingRes = await api.get(`/ratings/${id}/mine`);
          setMyRating(ratingRes.data.rating || 0);
        }
      } catch (err) {
        setError('Skill not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id, user]);

  const handleRate = async (rating) => {
    if (!user) { navigate('/login'); return; }
    if (skill?.creator?._id === user._id) return;
    setRatingLoading(true);
    try {
      const res = await api.post(`/ratings/${id}`, { rating });
      setMyRating(rating);
      setSkill((prev) => ({ ...prev, averageRating: res.data.averageRating, ratingCount: res.data.ratingCount }));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not submit rating');
    } finally {
      setRatingLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      const res = await api.post(`/skills/${id}/like`);
      setLiked(res.data.liked);
      setLikeCount(res.data.likes);
    } catch (err) {}
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (!commentText.trim()) return;
    setCommentLoading(true);
    try {
      const res = await api.post(`/comments/${id}`, { text: commentText });
      setComments((prev) => [res.data, ...prev]);
      setCommentText('');
    } catch (err) {
      alert(err.response?.data?.message || 'Could not post comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await api.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {}
  };

  const handleDeleteSkill = async () => {
    if (!window.confirm('Delete this skill? This cannot be undone.')) return;
    try {
      await api.delete(`/skills/${id}`);
      navigate('/');
    } catch (err) {}
  };

  if (loading) {
    return (
      <div className="page-container animate-fade-in">
        <div className="skeleton h-8 w-64 mb-4 rounded-xl" />
        <div className="skeleton aspect-video rounded-2xl mb-6" />
        <div className="skeleton h-5 w-full mb-2 rounded" />
        <div className="skeleton h-5 w-3/4 rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container text-center py-24">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="font-display text-2xl text-white mb-2">{error}</h2>
        <Link to="/" className="btn-primary mt-4">Go Home</Link>
      </div>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(skill.videoUrl);
  const isOwner = user && skill.creator?._id === user._id;
  const catClass = categoryColors[skill.category] || categoryColors.Other;

  return (
    <div className="page-container animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Video */}
          <div className="video-container mb-6 border border-surface-border">
            <iframe src={embedUrl} allowFullScreen title={skill.title} />
          </div>

          {/* Title + actions */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
              {skill.title}
            </h1>
            <div className="flex items-center gap-2 shrink-0">
              {/* Like button */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all ${
                  liked
                    ? 'bg-red-900/30 border-red-800/50 text-red-400'
                    : 'bg-surface-card border-surface-border text-gray-400 hover:text-red-400'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span className="text-sm font-mono">{likeCount}</span>
              </button>

              {isOwner && (
                <button
                  onClick={handleDeleteSkill}
                  className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-900/20 transition-colors border border-surface-border"
                  title="Delete skill"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-mono font-medium border ${catClass}`}>
              {skill.category}
            </span>
            <span className={`badge ${levelBadgeClass[skill.level] || 'badge-green'}`}>
              {skill.level}
            </span>
            {skill.tags?.map((tag) => (
              <span key={tag} className="badge badge-blue">#{tag}</span>
            ))}
          </div>

          {/* Description */}
          <div className="card p-5 mb-6">
            <h3 className="font-display font-semibold text-white mb-3">About this skill</h3>
            <p className="text-gray-400 leading-relaxed text-sm whitespace-pre-wrap">{skill.description}</p>
          </div>

          {/* Rating section */}
          <div className="card p-5 mb-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display font-semibold text-white mb-1">Rating</h3>
                <div className="flex items-center gap-2 mb-1">
                  <StarRating value={skill.averageRating} readonly size={22} />
                  <span className="font-display font-bold text-white text-lg">
                    {skill.averageRating > 0 ? skill.averageRating.toFixed(1) : '—'}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{skill.ratingCount} rating{skill.ratingCount !== 1 ? 's' : ''}</p>
              </div>

              {user && !isOwner && (
                <div>
                  <p className="text-xs text-gray-500 mb-2 text-right">Your rating</p>
                  <StarRating
                    value={myRating}
                    onChange={handleRate}
                    size={26}
                  />
                  {ratingLoading && <p className="text-xs text-brand-400 mt-1 text-right">Saving…</p>}
                </div>
              )}
              {!user && (
                <Link to="/login" className="text-xs text-brand-400 hover:text-brand-300">
                  Login to rate →
                </Link>
              )}
              {isOwner && (
                <p className="text-xs text-gray-600">You can't rate your own skill</p>
              )}
            </div>
          </div>

          {/* Comments */}
          <div className="card p-5">
            <h3 className="font-display font-semibold text-white mb-4">
              Comments <span className="text-gray-500 font-mono text-sm">({comments.length})</span>
            </h3>

            {/* Comment form */}
            {user ? (
              <form onSubmit={handleComment} className="mb-6">
                <textarea
                  className="input resize-none mb-2"
                  rows={3}
                  placeholder="Share your thoughts or ask a question…"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  maxLength={1000}
                />
                <button type="submit" disabled={commentLoading || !commentText.trim()} className="btn-primary py-2 px-5 text-sm">
                  {commentLoading ? 'Posting…' : 'Post Comment'}
                </button>
              </form>
            ) : (
              <div className="bg-surface-secondary border border-surface-border rounded-xl p-4 mb-6 text-center">
                <p className="text-gray-400 text-sm">
                  <Link to="/login" className="text-brand-400 hover:text-brand-300">Log in</Link> to leave a comment
                </p>
              </div>
            )}

            {/* Comments list */}
            <div className="space-y-4">
              {comments.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">No comments yet. Start the conversation!</p>
              )}
              {comments.map((comment) => (
                <div key={comment._id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-border flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-display text-gray-400">
                      {comment.user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-display text-sm text-gray-300">{comment.user?.name}</span>
                      <span className="text-xs text-gray-600">{timeAgo(comment.createdAt)}</span>
                      {user && comment.user?._id === user._id && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="ml-auto text-gray-600 hover:text-red-400 transition-colors"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Creator card */}
          <div className="card p-5">
            <h3 className="font-display font-semibold text-gray-300 text-sm mb-4 uppercase tracking-wide">Creator</h3>
            <Link to={`/profile/${skill.creator?._id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-12 h-12 rounded-full bg-brand-900 border border-brand-700 flex items-center justify-center">
                <span className="font-display text-lg font-bold text-brand-300">
                  {skill.creator?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-display font-semibold text-white">{skill.creator?.name}</p>
                <p className="text-xs text-gray-500">View profile →</p>
              </div>
            </Link>
            {skill.creator?.bio && (
              <p className="text-xs text-gray-500 mt-3 leading-relaxed">{skill.creator.bio}</p>
            )}
          </div>

          {/* Skill meta */}
          <div className="card p-5">
            <h3 className="font-display font-semibold text-gray-300 text-sm mb-4 uppercase tracking-wide">Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Category</span>
                <span className="text-gray-300">{skill.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Level</span>
                <span className="text-gray-300">{skill.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Views</span>
                <span className="text-gray-300 font-mono">{skill.views}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Posted</span>
                <span className="text-gray-300">{timeAgo(skill.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {skill.tags?.length > 0 && (
            <div className="card p-5">
              <h3 className="font-display font-semibold text-gray-300 text-sm mb-3 uppercase tracking-wide">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {skill.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/explore?search=${tag}`}
                    className="badge badge-blue hover:bg-blue-800/30 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
