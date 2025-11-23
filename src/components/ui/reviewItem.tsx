import { useNavigate } from "react-router-dom";
import { likeReview, dislikeReview, getReviewById } from "../../lib/api/reviews";
import { Review } from "../../lib/models/review";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { useState } from "react";

interface ReviewProps {
    review: Review;
}

export const ReviewItem = ({ review }: ReviewProps) => {
    const navigate = useNavigate();
    const [reviewState, setReviewState] = useState<Review>(review);

    const like = async (reviewId: string) => {
        await likeReview(reviewId);
        const updatedReview = await getReviewById(reviewId);
        setReviewState({...reviewState, likes: updatedReview.likes});
    };

    const dislike = async (reviewId: string) => {
        await dislikeReview(reviewId);
        const updatedReview = await getReviewById(reviewId);
        setReviewState({...reviewState, dislikes: updatedReview.dislikes});
    };

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 10 - fullStars - (hasHalfStar ? 1 : 0);

        return (
        <div className="inline-flex items-center justify-center gap-[5px]">
            {Array.from({ length: fullStars }).map((_, index) => (
            <img
                key={`full-${index}`}
                className="w-6 h-6"
                alt="Star"
                src="/ic-baseline-star.svg"
            />
            ))}
            {hasHalfStar && (
            <img
                className="w-6 h-6"
                alt="Half star"
                src="/ic-baseline-star-half.svg"
            />
            )}
            {Array.from({ length: emptyStars }).map((_, index) => (
            <img
                key={`empty-${index}`}
                className="w-6 h-6"
                alt="Empty star"
                src="/ic-baseline-star-border.svg"
            />
            ))}
            <span className="[font-family:'Jura',Helvetica] font-normal text-white text-xs tracking-[0] leading-[normal] whitespace-nowrap">
            {rating}/10
            </span>
        </div>
        );
    };

    return (
        <Card
            key={reviewState.id}
            className="flex h-[340px] flex-shrink-0 items-start gap-2.5 p-5 w-full bg-[#0c0d27] rounded-lg overflow-hidden shadow-[4px_4px_4px_#00000040] border-0"
        >
            <CardContent className="flex items-start gap-2.5 p-0 w-full h-full">
            <img
                className="flex-[0_0_auto] h-[300px]"
                alt="Entity photo"
                src={reviewState.media?.posterUrl || "/entity-photo.svg"}
            />

            <div className="flex flex-col h-[300px] items-start gap-2.5 pt-2.5 pb-0 px-2.5 flex-1">
                <h2 className="mt-[-1.00px] [font-family:'Jura',Helvetica] font-bold text-white text-4xl tracking-[0] leading-[normal] whitespace-nowrap">
                {reviewState.media?.title}
                </h2>

                {renderStars(reviewState.rating)}

                <div className="flex flex-col h-full items-end justify-end gap-2.5 pl-0 pr-[30px] py-0 w-full">
                <div className="flex flex-col items-start gap-2.5 w-full h-full">
                    <p className="[font-family:'Jura',Helvetica] font-normal text-white text-sm tracking-[0] leading-[14.0px] overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:6] [-webkit-box-orient:vertical]">
                    {reviewState.content}
                    </p>
                </div>

                <div className="flex items-start gap-2.5 w-full">
                    <Button
                    onClick={() => {
                        navigate(`/reviews/${reviewState.id}`);
                    }}
                    variant="link"
                    className="inline-flex items-end gap-2.5 overflow-hidden border-b [border-bottom-style:solid] border-[#0004ff] h-auto p-0 rounded-none"
                    >
                    <span className="mt-[-2.00px] ml-[-1.00px] [font-family:'Jura',Helvetica] font-bold text-[#0004ff] text-xs tracking-[0] leading-[normal] whitespace-nowrap">
                        Read full
                    </span>
                    </Button>
                </div>
                </div>

                <div className="flex justify-end gap-2.5 px-2.5 py-0 w-full items-center">
                <button className="inline-flex gap-[3px] items-center bg-transparent border-0 cursor-pointer"
                    onClick={() => {
                        like(reviewState.id);
                    }}
                    >
                    <img
                    className="w-6 h-6"
                    alt="Like"
                    src="/icon-park-outline-like.svg"
                    />
                    <span className="[font-family:'Jura',Helvetica] font-normal text-white text-xs tracking-[0] leading-[normal] whitespace-nowrap">
                    {reviewState.likes}
                    </span>
                </button>

                <button className="inline-flex gap-[3px] items-center bg-transparent border-0 cursor-pointer"
                    onClick={() => {
                        dislike(reviewState.id);
                    }}
                >
                    <img
                    className="w-6 h-6"
                    alt="Dislike"
                    src="/icon-park-outline-dislike.svg"
                    />
                    <span className="[font-family:'Jura',Helvetica] font-normal text-white text-xs tracking-[0] leading-[normal] whitespace-nowrap">
                    {reviewState.dislikes}
                    </span>
                </button>
                </div>
            </div>
            </CardContent>
        </Card>
    )
}