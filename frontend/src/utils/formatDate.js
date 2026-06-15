/**
 * Collection of date formatting utilities for Sibzer
 */

/**
 * Formats a date to a readable string
 * formatDate("2024-03-15T10:30:00Z") → "March 15, 2024"
 */
export const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-PK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Formats a date with time
 * formatDateTime("2024-03-15T10:30:00Z") → "March 15, 2024 at 10:30 AM"
 */
export const formatDateTime = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-PK", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Formats a date as short form
 * formatShortDate("2024-03-15T10:30:00Z") → "15 Mar 2024"
 */
export const formatShortDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-PK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Returns relative time string
 * formatRelativeTime("2024-03-15T10:30:00Z") → "2 days ago" | "just now" | "in 3 hours"
 */
export const formatRelativeTime = (date) => {
  if (!date) return "";

  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  return formatShortDate(date);
};

/**
 * Formats time only
 * formatTime("2024-03-15T10:30:00Z") → "10:30 AM"
 */
export const formatTime = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleTimeString("en-PK", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Default export is the most commonly used one
export default formatDate;