import { Review } from "../models/review";
import { transformReview } from "../transformers/reviewTransformer";
import { getMediaDetails, getPosterImage } from "../api/media";

/**
 * Fetches a single review and enriches it with media details
 * @param fetchFunction - Function that returns a promise with a single review data
 * @returns Promise with enriched review
 */
export const fetchAndEnrichSingleReview = async (
  fetchFunction: () => Promise<any>
): Promise<Review | null> => {
    try {
        const reviewData = await fetchFunction();
        
        const review: Review = transformReview(reviewData);

        try {
            const mediaDetails = await getMediaDetails(
                review.referenceId,
                review.referenceType
            );
            
            const poster = await getPosterImage(
                review.referenceType,
                review.referenceId
            );
            
            review.media = mediaDetails;
            review.media.posterUrl = poster;
        } catch (error) {
            console.error(
                `fetchAndEnrichSingleReview: Error fetching media details for review ${review.id}:`,
                error
            );
        }

        return review;
    } 
    catch (error) {
        console.error('fetchAndEnrichSingleReview: Error:', error);
        return null;
    }
};

/**
 * Fetches reviews using the provided fetch function and enriches them with media details
 * @param fetchFunction - Function that returns a promise with reviews data
 * @returns Promise with array of enriched reviews
 */
export const fetchAndEnrichReviews = async (
  fetchFunction: () => Promise<any>
): Promise<Review[]> => {
    try {
        const reviewsData = await fetchFunction();
        const reviews: Review[] = reviewsData.data.map(transformReview);

        await Promise.all(
            reviews.map(async (review) => {
                try {
                const mediaDetails = await getMediaDetails(
                    review.referenceId,
                    review.referenceType
                );
                const poster = await getPosterImage(
                    review.referenceType,
                    review.referenceId
                );
                review.media = mediaDetails;
                review.media.posterUrl = poster;
                } catch (error) {
                console.error(
                    `Error fetching media details for review ${review.id}:`,
                    error
                );
                }
            })
        );
        return reviews;
    } 
    catch (error) {
        console.error('Error fetching and enriching reviews:', error);
        return [];
    }
};
