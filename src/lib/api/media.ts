import { ReferenceType } from "./contracts/common";
import { MediaDetailsDTO } from "./contracts/media";

const API_BASE_URL = window.config?.apiUrl || 'http://localhost:5261';

export const getPosterImage = async (referenceType: ReferenceType, referenceId: string): Promise<string> => {
    var response: Response = await fetch(`${API_BASE_URL}/api/media/poster/${referenceType}/${referenceId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "image/jpeg"
            },
            credentials: 'include',
        }
    );
    if (response.ok) {
        const data: Blob = await response.blob();
        return URL.createObjectURL(data);
    }
    throw new Error('Failed to fetch poster image');
}

export const getMediaDetails = async (referenceId: string, referenceType: ReferenceType): Promise<MediaDetailsDTO> => {
    var response: Response = await fetch(`${API_BASE_URL}/api/media/${referenceType}/${referenceId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
    });
    if (response.ok) {
        const data: MediaDetailsDTO = await response.json();
        return data;
    }
    throw new Error('Failed to fetch media details');
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
    const response = await fetch(`${API_BASE_URL}/api/media/search/${mediaType}?query=${encodeURIComponent(query)}&pageSize=${count}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
    });

    if (response.ok) {
        const result = await response.json();
        // Handle both array and object responses
        return result.data;
    }
    
    return [];
}
