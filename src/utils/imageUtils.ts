// Utility to handle image URLs
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return "";

  // Normalize path separators (Windows uses backslash)
  const normalizedPath = imagePath.replace(/\\/g, '/');

  // Handle relative paths from uploads directory
  if (normalizedPath.startsWith("uploads")) {
    return `${API_URL}/${normalizedPath}`;
  }

  return imagePath;
};
