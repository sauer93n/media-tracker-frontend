import { ReviewDTO } from "../api/contracts/review";
import { Review } from "../models/review";
export const transformReview = (review: ReviewDTO): Review => {
    return {
        id: review.id,
        authorId: review.authorId,
        content: review.content,
        rating: review.rating,
        isLikedByUser: review.isLikedByUser,
        isDislikedByUser: review.isDislikedByUser,
        referenceId: review.referenceId,
        referenceType: review.referenceType,
        likes: review.likes,
        dislikes: review.dislikes
    } as Review;
};