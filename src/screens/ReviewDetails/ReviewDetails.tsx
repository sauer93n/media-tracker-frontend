import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAndEnrichSingleReview } from "../../lib/utils/reviewUtils";
import { getReviewById } from "../../lib/api/reviews";
import { Review } from "../../lib/models/review";
import { Spinner } from "../../components/spinner/spinner";
import { GoToDashboard } from "../../components/ui/goToDashboard";
import { Button } from "../../components/ui/button";


export const ReviewDetails = () => {
    const { reviewId } = useParams<{ reviewId: string }>();
    const [review, setReview] = useState<Review | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
        <div className="flex-1 w-full flex flex-col items-center overflow-auto p-10 text-white">
            {loading && <Spinner />}
            {review && (
                <div className="flex flex-col items-start gap-2.5 pt-2.5 pb-0 px-2.5 flex-1">
                    <div className="flex flex-1 w-full">
                        <h2 className="mt-[-1.00px] [font-family:'Jura',Helvetica] font-bold text-white text-4xl tracking-[0] leading-[normal] whitespace-nowrap">
                            {review.media?.title}
                        </h2>
                    </div>
                    <span className="mt-[-1.00px] [font-family:'Jura',Helvetica] text-gray-400 tracking-[0] leading-[normal] whitespace-nowrap">
                        by {review.authorName}
                    </span>

                    {/* {renderStars(review.rating)} */}

                    <div className="flex flex-col h-full items-end justify-end gap-2.5 pl-0 pr-[30px] py-0 w-full">
                        <div className="flex flex-col items-start gap-2.5 w-full h-full">
                            <p className="[font-family:'Jura',Helvetica] font-normal text-white text-sm tracking-[0] leading-[14.0px] overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:6] [-webkit-box-orient:vertical]">
                            {review.content}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2.5 px-2.5 py-0 w-full items-center">
                    <button className={
                            "inline-flex gap-[3px] items-center bg-transparent border-0 cursor-pointer" +
                            (review.isLikedByUser ? " opacity-50" : "")}
                        onClick={() => {
                            // like(review.id);
                        }}
                        >
                        <img
                            className="w-6 h-6"
                            alt="Like"
                            src="/icon-park-outline-like.svg"
                        />
                        <span className="[font-family:'Jura',Helvetica] font-normal text-white text-xs tracking-[0] leading-[normal] whitespace-nowrap">
                            {review.likes}
                        </span>
                    </button>

                        <button className={
                                "inline-flex gap-[3px] items-center bg-transparent border-0 cursor-pointer" +
                                (review.isDislikedByUser ? " opacity-50" : "")}
                            onClick={() => {
                                // dislike(review.id);
                            }}
                        >
                            <img
                                className="w-6 h-6"
                                alt="Dislike"
                                src="/icon-park-outline-dislike.svg"
                            />
                            <span className="[font-family:'Jura',Helvetica] font-normal text-white text-xs tracking-[0] leading-[normal] whitespace-nowrap">
                                {review.dislikes}
                            </span>
                        </button>
                    </div>
                </div>
        )}
        </div>
    )
}