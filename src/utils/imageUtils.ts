// Utility to handle image URLs
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return "";
  // Handle relative paths from uploads directory
  if (imagePath.startsWith("uploads")) {
    // return `${import.meta.env.VITE_API_URL}/${imagePath}`;
    return `/${imagePath}`;
  }

  return imagePath;
};
