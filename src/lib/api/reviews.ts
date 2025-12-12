/// <reference types="vite/client" />

import { PagedResult } from "./contracts/common";
import { ReviewDTO } from "./contracts/review";
import { apiRequest, buildApiUrl } from "./apiClient";

export const getAllReviews = async (pageNumber: number, pageSize: number): Promise<PagedResult<ReviewDTO>> => {
    const url = buildApiUrl('/api/review', { pageNumber, pageSize });
    return apiRequest<PagedResult<ReviewDTO>>(url, {}, 'Failed to fetch reviews');
}

export const getMyReviews = async (referenceType: string, pageNumber: number = 1, pageSize: number = 100): Promise<PagedResult<ReviewDTO>> => {
    const url = buildApiUrl(`/api/review/my/${referenceType}`, { pageNumber, pageSize });
    return apiRequest<PagedResult<ReviewDTO>>(url, {}, 'Failed to fetch my reviews');
}

export const createReview = async (review: Partial<ReviewDTO>): Promise<ReviewDTO> => {
    const url = buildApiUrl('/api/review/create');
    return apiRequest<ReviewDTO>(
        url,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(review),
        },
        'Failed to create review'
    );
}

export const deleteReview = async (reviewId: string): Promise<void> => {
    const url = buildApiUrl(`/api/review/${reviewId}`);
    await apiRequest<void>(url, { method: 'DELETE' }, 'Failed to delete review');
}

export const updateReview = async (reviewId: string, content: string, rating: number): Promise<ReviewDTO> => {
    const url = buildApiUrl('/api/review/update/');
    return apiRequest<ReviewDTO>(
        url,
        {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reviewId, content, rating }),
        },
        'Failed to update review'
    );
}

export const getReviewById = async (reviewId: string): Promise<ReviewDTO> => {
    const url = buildApiUrl(`/api/review/${reviewId}`);
    return apiRequest<ReviewDTO>(url, {}, 'Failed to fetch review');
}

export const likeReview = async (reviewId: string): Promise<void> => {
    const url = buildApiUrl(`/api/review/${reviewId}/like`);
    await apiRequest<void>(url, { method: 'POST' }, 'Failed to like review');
}

export const dislikeReview = async (reviewId: string): Promise<void> => {
    const url = buildApiUrl(`/api/review/${reviewId}/dislike`);
    await apiRequest<void>(url, { method: 'POST' }, 'Failed to dislike review');
}