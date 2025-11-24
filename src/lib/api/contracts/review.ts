import { ReferenceType } from './common';

/**
 * Data transfer object for a review
 */
export type ReviewDTO = {
  id: string;
  authorId: string;
  content: string;
  rating: number;
  isLikedByUser: boolean;
  isDislikedByUser: boolean;
  referenceId: string;
  referenceType: ReferenceType;
  likes: number;
  dislikes: number;
}

/**
 * Request payload for creating a new review
 */
export type CreateReviewRequest = {
  authorId: string;
  authorName: string;
  content: string;
  rating: number;
  referenceId: string;
}

/**
 * Request payload for updating an existing review
 */
export type UpdateReviewRequest = {
  reviewId: string;
  content: string;
  rating: number;
}
