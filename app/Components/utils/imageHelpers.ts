// utils/imageHelpers.ts
export const getCourseImageUrl = (imagePath: string | undefined, type: 'thumbnail' | 'cover' = 'thumbnail'): string => {
  if (!imagePath) {
    // Image par défaut
    return type === 'thumbnail' 
      ? '/images/cmu.jpg'
      : '/images/lsf.jpg';
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_LEARNING_API_URL || 'http://localhost:8002';
  
  // Extraire le nom de fichier du chemin
  const filename = imagePath.split('/').pop() || '';
  
  if (type === 'thumbnail') {
    return `${baseUrl}/api/courses/thumbnails/${filename}/`;
  } else {
    return `${baseUrl}/api/courses/covers/${filename}/`;
  }
};

// une fonction plus simple
export const getThumbnailUrl = (thumbnailPath: string | undefined): string => {
  return getCourseImageUrl(thumbnailPath, 'thumbnail');
};

export const getCoverImageUrl = (coverPath: string | undefined): string => {
  return getCourseImageUrl(coverPath, 'cover');
};