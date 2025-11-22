/// <reference types="vite/client" />

import { PagedResult } from "./contracts/common";
import { ReviewDTO } from "./contracts/review";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5261';

export const getAllReviews = async (): Promise<PagedResult<ReviewDTO>> => {
    var response: Response = await fetch(`${API_BASE_URL}/api/review`, {
        method: 'GET',
        credentials: 'include',
    });

    if (response.ok) {
      const data: PagedResult<ReviewDTO> = await response.json();
      // Process the fetched reviews data
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