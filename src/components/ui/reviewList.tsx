import { Review } from "../../lib/models/review";
import { ReviewItem } from "./reviewItem";

export interface ReviewListProps {
  reviews: Review[];
  onDelete?: (deletedReviewId: string) => void;
  observerTarget?: React.RefObject<HTMLDivElement>;
  showLoadTrigger: boolean;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
}

export const ReviewList = ({ reviews, onDelete, observerTarget, showLoadTrigger, scrollContainerRef }: ReviewListProps) => {
  return (
      <div 
        ref={scrollContainerRef}
        className="flex flex-col items-center gap-2.5 p-2.5 w-full overflow-y-auto h-full scroll-smooth scrollbar-thin scrollbar-thumb-[#7167fa] scrollbar-track-[#1a1b3a] hover:scrollbar-thumb-[#8b7ff8] scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
      >
        {reviews.length === 0 && (
          <p className="[font-family:'Jura',Helvetica] font-light text-white text-xl tracking-[0] leading-[normal]">
            No reviews found.
          </p>
        )}
        {reviews.map((review) => (
          <ReviewItem key={review.id} review={review} onDelete={() => onDelete?.(review.id)} />
        ))}
        {showLoadTrigger && <div ref={observerTarget} className="w-full h-20" />}
    </div>
  );
}