/**
 * Format raw view count into compact strings e.g. 12.3K, 1.4M
 */
export const formatViews = (views = 0) => {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  }
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return views.toString();
};

/**
 * Format size in MB into human readable MB or GB
 */
export const formatFileSize = (sizeMB = 0) => {
  if (sizeMB >= 1024) {
    return `${(sizeMB / 1024).toFixed(1)} GB`;
  }
  return `${sizeMB} MB`;
};
