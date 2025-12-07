import { useState, useEffect } from "react";
import { apiClient } from "../../lib/api/auth";
import { likeReview, getReviewById, dislikeReview } from "../../lib/api/reviews";
import { getUser } from "../../lib/api/user";
import { Review } from "../../lib/models/review";
import { Button } from "./button";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../spinner/spinner";
import { ReviewOptionsMenu } from "./reviewOptionsMenu";

interface ReviewContentProps {
    review: Review;
    onDelete?: () => void;
    viewMode?: 'short' | 'full';
}

export const ReviewContent = ({ review, onDelete, viewMode = 'short' }: ReviewContentProps) => {
    const [user, setUser] = useState<any>(null);
    const [reviewState, setReviewState] = useState<Review>(review);
    const navigate = useNavigate();
    const [isAuthorLoaded, setIsAuthorLoaded] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const user = await apiClient.auth.getSession(true);
            setUser(user);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchAuthor = async () => {
            try {
                const authorData = await getUser(review.authorId);
                setReviewState((prevState) => ({
                    ...prevState,
                    authorName: authorData.username,
                }));
            } catch (error) {
                setReviewState((prevState) => ({
                    ...prevState,
                    authorName: "Unknown",
                }));
            } finally {
                setIsAuthorLoaded(true);
            }
        };

        fetchAuthor();
    }, [review]);

    const like = async (reviewId: string) => {
        await likeReview(reviewId);
        const updatedReview = await getReviewById(reviewId);
        setReviewState({...reviewState, likes: updatedReview.likes, dislikes: updatedReview.dislikes, isLikedByUser: updatedReview.isLikedByUser, isDislikedByUser: updatedReview.isDislikedByUser });
    };

    const dislike = async (reviewId: string) => {
        await dislikeReview(reviewId);
        const updatedReview = await getReviewById(reviewId);
        setReviewState({...reviewState, likes: updatedReview.likes, dislikes: updatedReview.dislikes, isDislikedByUser: updatedReview.isDislikedByUser, isLikedByUser: updatedReview.isLikedByUser });
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
        <>
            { !isAuthorLoaded && <Spinner /> }
            { isAuthorLoaded && (
                <>
                    {viewMode === 'short' ? (
                        // Short View - Original Layout
                        <div className="flex overflow-hidden w-full gap-5">
                            <div className="rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                    className="flex-[0_0_auto] h-[300px] w-[210px] object-cover"
                                    alt="Entity photo"
                                    src={reviewState.media?.posterUrl || "/entity-photo.svg"}
                                />
                            </div>

                            <div className="flex flex-col h-[300px] items-start gap-2.5 pt-2.5 pb-0 px-2.5 flex-1">
                                <div className="flex flex-1 w-full">
                                    <h2 className="mt-[-1.00px] [font-family:'Jura',Helvetica] font-bold text-white text-4xl tracking-[0] leading-[normal] whitespace-nowrap">
                                        {reviewState.media?.title}
                                    </h2>
                                    {user && user.data.session?.user.id == reviewState.authorId && (
                                        <ReviewOptionsMenu 
                                            reviewId={reviewState.id} 
                                            onDelete={onDelete}
                                        />
                                    )}
                                </div>
                                <span className="mt-[-1.00px] [font-family:'Jura',Helvetica] text-gray-400 tracking-[0] leading-[normal] whitespace-nowrap">
                                    by {reviewState.authorName}
                                </span>

                                {renderStars(reviewState.rating)}

                                <div className="flex flex-col h-full items-end justify-end gap-2.5 pl-0 pr-[30px] py-0 w-full">
                                    <div className="flex flex-col items-start gap-2.5 w-full h-full">
                                        <p className="[font-family:'Jura',Helvetica] font-normal text-white text-sm tracking-[0] leading-[14.0px] overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:6] [-webkit-box-orient:vertical]">
                                            {reviewState.content}
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-2.5 w-full">
                                        <Button
                                            onClick={() => navigate(`/reviews/${reviewState.id}`)}
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
                                    <button 
                                        className={`inline-flex gap-[3px] items-center bg-transparent border-0 cursor-pointer ${reviewState.isLikedByUser ? 'opacity-50' : ''}`}
                                        onClick={() => like(reviewState.id)}
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

                                    <button 
                                        className={`inline-flex gap-[3px] items-center bg-transparent border-0 cursor-pointer ${reviewState.isDislikedByUser ? 'opacity-50' : ''}`}
                                        onClick={() => dislike(reviewState.id)}
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
                        </div>
                    ) : (
                        // Full View - New Layout
                        <div className="flex flex-col w-full h-full gap-6">
                            {/* Main Review Section */}
                            <section className="flex gap-5 w-full">
                                {/* Left - Poster */}
                                <div className="flex-shrink-0">
                                    <img
                                        className="w-[210px] h-[300px] object-cover rounded-lg"
                                        alt="Entity photo"
                                        src={reviewState.media?.posterUrl || "/entity-photo.svg"}
                                    />
                                </div>

                                {/* Right - Content */}
                                <div className="flex flex-col flex-1 gap-3 min-w-0">
                                    {/* Title with options */}
                                    <div className="flex items-start justify-between gap-2">
                                        <h2 className="[font-family:'Jura',Helvetica] font-bold text-white text-4xl tracking-[0] leading-tight">
                                            {reviewState.media?.title}
                                        </h2>
                                        {user && user.data.session?.user.id == reviewState.authorId && (
                                            <ReviewOptionsMenu 
                                                reviewId={reviewState.id} 
                                                onDelete={onDelete}
                                            />
                                        )}
                                    </div>

                                    {/* Author */}
                                    <span className="[font-family:'Jura',Helvetica] text-gray-400 text-base">
                                        by {reviewState.authorName}
                                    </span>

                                    {/* Rating */}
                                    <div className="flex items-center">
                                        {renderStars(reviewState.rating)}
                                    </div>

                                    {/* Review Content - Scrollable */}
                                    <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-[#7167fa] scrollbar-track-[#1a1b3a] hover:scrollbar-thumb-[#8b7ff8]">
                                        <p className="[font-family:'Jura',Helvetica] font-normal text-white text-base leading-[1.8] whitespace-pre-wrap">
                                            {reviewState.content}
                                        </p>
                                    </div>

                                    {/* Likes/Dislikes - Fixed at bottom */}
                                    <div className="flex justify-end gap-4 pt-3 pr-4 border-t border-slate-700/50">
                                        <button 
                                            className={`inline-flex gap-2 items-center bg-transparent border-0 cursor-pointer transition-opacity ${reviewState.isLikedByUser ? 'opacity-50' : 'hover:opacity-80'}`}
                                            onClick={() => like(reviewState.id)}
                                        >
                                            <img
                                                className="w-6 h-6"
                                                alt="Like"
                                                src="/icon-park-outline-like.svg"
                                            />
                                            <span className="[font-family:'Jura',Helvetica] font-normal text-white text-sm">
                                                {reviewState.likes}
                                            </span>
                                        </button>

                                        <button 
                                            className={`inline-flex gap-2 items-center bg-transparent border-0 cursor-pointer transition-opacity ${reviewState.isDislikedByUser ? 'opacity-50' : 'hover:opacity-80'}`}
                                            onClick={() => dislike(reviewState.id)}
                                        >
                                            <img
                                                className="w-6 h-6"
                                                alt="Dislike"
                                                src="/icon-park-outline-dislike.svg"
                                            />
                                            <span className="[font-family:'Jura',Helvetica] font-normal text-white text-sm">
                                                {reviewState.dislikes}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </section>

                            {/* Comments Section */}
                            <hr className="border-slate-700/50" />
                            <section className="flex flex-col gap-4 w-full">
                                <h3 className="[font-family:'Jura',Helvetica] font-bold text-white text-2xl">
                                    Comments
                                </h3>
                                <div className="flex flex-col items-center justify-center py-12 px-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                                    <span className="[font-family:'Jura',Helvetica] font-light text-slate-400 text-lg">
                                        💬 Comments coming soon
                                    </span>
                                    <span className="[font-family:'Jura',Helvetica] font-light text-slate-500 text-sm mt-2">
                                        Stay tuned for community discussions!
                                    </span>
                                </div>
                            </section>
                        </div>
                    )}
                </>
            )}
        </>
    )
}