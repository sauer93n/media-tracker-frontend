import { useState, useEffect } from 'react';
import { searchMedia, getMediaDetails, getPosterImage } from '../lib/api/media';
import { MediaDetailsDTO } from '../lib/api/contracts/media';
import { ReferenceType } from '../lib/api/contracts/common';

export const useMediaSearch = (searchTerm: string, mediaType: string | undefined) => {
  const [searchResults, setSearchResults] = useState<MediaDetailsDTO[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const performSearch = async () => {
      if (searchTerm && mediaType) {
        setIsSearching(true);
        try {
          const searchResults = await searchMedia(searchTerm, mediaType, 10);
          const results = await Promise.all(searchResults.map(async (media) => {
            const details = await getMediaDetails(media.id.toString(), mediaType as ReferenceType);
            try {
              const posterUrl = await getPosterImage(mediaType as ReferenceType, media.id.toString());
              details.posterUrl = posterUrl;
            } catch (error) {
              console.warn(`Failed to load poster for ${media.title}:`, error);
              details.posterUrl = null;
            }
            return details;
          }));

          // Ensure results is always an array
          setSearchResults(Array.isArray(results) ? results : []);
        } catch (error) {
          console.error('Error searching media:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    };

    performSearch();
  }, [searchTerm, mediaType]);

  return { searchResults, isSearching };
};
