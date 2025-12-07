import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAndEnrichSingleReview } from "../../lib/utils/reviewUtils";
import { getReviewById } from "../../lib/api/reviews";
import { Review } from "../../lib/models/review";
import { Spinner } from "../../components/spinner/spinner";
import { GoToDashboard } from "../../components/ui/goToDashboard";
import { ReviewContent } from "../../components/ui/reviewContent";


export const ReviewDetails = () => {
    const { reviewId } = useParams<{ reviewId: string }>();
    const [review, setReview] = useState<Review | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReview = async () => {
            if (!reviewId) return;
            
            try {
                const review = await fetchAndEnrichSingleReview(() => getReviewById(reviewId));

                setReview(review);
            } catch (error) {
                console.error("Error fetching review:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchReview();
    }, [reviewId]);

    return (
        <div className="flex-1 w-full flex flex-col items-start overflow-auto p-10 px-32 text-white">
            {loading && <Spinner />}
            {review && (
                <section className="w-full h-full overflow-auto">
                    <ReviewContent review={review} viewMode="full" />
                </section>
            )}
        </div>
    )
}