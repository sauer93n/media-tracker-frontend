/// <reference types="vite/client" />

import { PagedResult } from "./contracts/common";
import { ReviewDTO } from "./contracts/review";

const API_BASE_URL = window.config?.apiUrl || 'http://localhost:5261';

export const getAllReviews = async (pageNumber: number, pageSize: number): Promise<PagedResult<ReviewDTO>> => {
    var response: Response = await fetch(`${API_BASE_URL}/api/review?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
        method: 'GET',
        credentials: 'include',
    });

    if (response.ok) {
      const data: PagedResult<ReviewDTO> = await response.json();
      return data;
    }
    throw new Error('Failed to fetch reviews');
}

export const getMyReviews = async (): Promise<PagedResult<ReviewDTO>> => {
    var response: Response = await fetch(`${API_BASE_URL}/api/review/my`, {
        method: 'GET',
        credentials: 'include',
    });
    if (response.ok) {
      const data: PagedResult<ReviewDTO> = await response.json();
      return data;
    }
    throw new Error('Failed to fetch my reviews');
}

export const createReview = async (review: Partial<ReviewDTO>): Promise<ReviewDTO> => {
    var response: Response = await fetch(`${API_BASE_URL}/api/review/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(review),
    });
    if (response.ok) {
      const data: ReviewDTO = await response.json();
      return data;
    }
    throw new Error('Failed to create review');
}

export const deleteReview = async (reviewId: string): Promise<void> => {
    var response: Response = await fetch(`${API_BASE_URL}/api/review/${reviewId}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (response.ok) {
      return;
    }
    throw new Error('Failed to delete review');
}

export const updateReview = async (reviewId: string, content: string, rating: number): Promise<ReviewDTO> => {
    var response: Response = await fetch(`${API_BASE_URL}/api/review/update/`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewId, content, rating }),
    });
    if (response.ok) {
      const data: ReviewDTO = await response.json();
      return data;
    }
    throw new Error('Failed to update review');
}

export const getReviewById = async (reviewId: string): Promise<ReviewDTO> => {
    var response: Response = await fetch(`${API_BASE_URL}/api/review/${reviewId}`, {
        method: 'GET',
        credentials: 'include',
    });
    if (response.ok) {
      const data: ReviewDTO = await response.json();
      return data;
    }
    throw new Error('Failed to fetch review');
}

export const likeReview = async (reviewId: string): Promise<void> => {
    var response: Response = await fetch(`${API_BASE_URL}/api/review/${reviewId}/like`, {
        method: 'POST',
        credentials: 'include',
    });
    if (response.ok) {
      return;
    }
    throw new Error('Failed to like review');
}

export const dislikeReview = async (reviewId: string): Promise<void> => {
    var response: Response = await fetch(`${API_BASE_URL}/api/review/${reviewId}/dislike`, {
        method: 'POST',
        credentials: 'include',
    });
    if (response.ok) {
      return;
    }
    throw new Error('Failed to dislike review');
}