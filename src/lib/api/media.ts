import { ReferenceType } from "./contracts/common";
import { MediaDetailsDTO } from "./contracts/media";
import { apiRequest, buildApiUrl } from "./apiClient";

export const getPosterImage = async (referenceType: ReferenceType, referenceId: string): Promise<string> => {
    const url = buildApiUrl(`/api/media/poster/${referenceType}/${referenceId}`);
    const response = await fetch(url, { credentials: 'include' });
    
    if (!response.ok) {
        throw new Error('Failed to fetch poster image');
    }
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
}

export const getMediaDetails = async (referenceId: string, referenceType: ReferenceType): Promise<MediaDetailsDTO> => {
    const url = buildApiUrl(`/api/media/${referenceType}/${referenceId}`);
    return apiRequest<MediaDetailsDTO>(
        url,
        { headers: { "Content-Type": "application/json" } },
        'Failed to fetch media details'
    );
}

export interface MediaSearchResult {
    id: number;
    title: string;
    description?: string;
    releaseDate: number;
}

export const searchMedia = async (query: string, mediaType: string, count: number): Promise<MediaSearchResult[]> => {
    if (!query) {
        return [];
    }
    const url = buildApiUrl(`/api/media/search/${mediaType}`, { 
        query: query,
        pageSize: count 
    });
    try {
        const result = await apiRequest<{ data: MediaSearchResult[] }>(url, {}, 'Failed to search media');
        return result.data;
    } catch {
        return [];
    }
}
