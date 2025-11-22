import { ReferenceType } from "./contracts/common";
import { MediaDetailsDTO } from "./contracts/media";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5261';

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
