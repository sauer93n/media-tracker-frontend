/// <reference types="vite/client" />

import { apiRequest, buildApiUrl } from './apiClient';

export interface ImportRatingsResponse {
    success: boolean;
    importedCount?: number;
    message?: string;
}

export const importKinopoiskRatings = async (userId: string): Promise<ImportRatingsResponse> => {
    const url = buildApiUrl(`/api/Kinopoisk/import-ratings/${userId}`);
    return apiRequest<ImportRatingsResponse>(
        url,
        { method: 'POST' },
        'Failed to import ratings from Kinopoisk'
    );
};
