// Convert a YouTube URL to an embeddable URL
export function getYouTubeEmbedUrl(url) {
  if (!url) return null;

  // Already embed format
  if (url.includes('youtube.com/embed/')) return url;

  let videoId = null;

  // youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) videoId = shortMatch[1];

  // youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) videoId = watchMatch[1];

  if (videoId) return `https://www.youtube.com/embed/${videoId}`;

  // Return original if we can't parse it (might be a direct embed or other platform)
  return url;
}

// Get YouTube thumbnail from a URL
export function getYouTubeThumbnail(url) {
  if (!url) return null;
  let videoId = null;

  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) videoId = shortMatch[1];

  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) videoId = watchMatch[1];

  const embedMatch = url.match(/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) videoId = embedMatch[1];

  if (videoId) return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  return null;
}

// Format a date nicely
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Format relative time
export function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDate(date);
}

// Level badge color
export const levelBadgeClass = {
  Beginner: 'badge-green',
  Intermediate: 'badge-amber',
  Advanced: 'badge-purple',
};

// Category colors
export const categoryColors = {
  Coding: 'text-blue-400 bg-blue-900/30 border-blue-800/30',
  Chess: 'text-violet-400 bg-violet-900/30 border-violet-800/30',
  Business: 'text-amber-400 bg-amber-900/30 border-amber-800/30',
  DIY: 'text-orange-400 bg-orange-900/30 border-orange-800/30',
  Music: 'text-pink-400 bg-pink-900/30 border-pink-800/30',
  Art: 'text-rose-400 bg-rose-900/30 border-rose-800/30',
  Language: 'text-cyan-400 bg-cyan-900/30 border-cyan-800/30',
  Fitness: 'text-green-400 bg-green-900/30 border-green-800/30',
  Cooking: 'text-yellow-400 bg-yellow-900/30 border-yellow-800/30',
  Other: 'text-gray-400 bg-gray-900/30 border-gray-800/30',
};
