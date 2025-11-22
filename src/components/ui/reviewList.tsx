import { useNavigate } from "react-router-dom";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { Review } from "../../lib/models/review";

export interface ReviewListProps {
    reviews: Review[];
}

export const ReviewList = ({ reviews }: ReviewListProps) => {
    const navigate = useNavigate();

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
        <div className="flex flex-col items-center gap-2.5 p-2.5 w-full overflow-y-auto h-full scroll-smooth scrollbar-thin scrollbar-thumb-[#7167fa] scrollbar-track-[#1a1b3a] hover:scrollbar-thumb-[#8b7ff8] scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
          {reviews.length === 0 && (
            <p className="[font-family:'Jura',Helvetica] font-light text-white text-xl tracking-[0] leading-[normal]">
              No reviews found.
            </p>
          )}
          {reviews.map((review) => (
            <Card
              key={review.id}
              className="flex h-[340px] flex-shrink-0 items-start gap-2.5 p-5 w-full bg-[#0c0d27] rounded-lg overflow-hidden shadow-[4px_4px_4px_#00000040] border-0"
            >
              <CardContent className="flex items-start gap-2.5 p-0 w-full h-full">
                <img
                  className="flex-[0_0_auto] h-[300px]"
                  alt="Entity photo"
                  src={review.media?.posterUrl || "/entity-photo.svg"}
                />

                <div className="flex flex-col h-[300px] items-start gap-2.5 pt-2.5 pb-0 px-2.5 flex-1">
                  <h2 className="mt-[-1.00px] [font-family:'Jura',Helvetica] font-bold text-white text-4xl tracking-[0] leading-[normal] whitespace-nowrap">
                    {review.media?.title}
                  </h2>

                  {renderStars(review.rating)}

                  <div className="flex flex-col h-full items-end justify-end gap-2.5 pl-0 pr-[30px] py-0 w-full">
                    <div className="flex flex-col items-start gap-2.5 w-full h-full">
                      {/* <h3 className="mt-[-1.00px] [font-family:'Jura',Helvetica] font-normal text-white text-2xl tracking-[0] leading-[normal] whitespace-nowrap">
                        {review.reviewTitle}
                      </h3> */}

                      <p className="[font-family:'Jura',Helvetica] font-normal text-white text-sm tracking-[0] leading-[14.0px] overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:6] [-webkit-box-orient:vertical]">
                        {review.content}
                      </p>
                    </div>

                    <div className="flex items-start gap-2.5 w-full">
                      <Button
                        onClick={() => {
                          navigate(`/reviews/${review.id}`);
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
                    <button className="inline-flex gap-[3px] items-center bg-transparent border-0 cursor-pointer">
                      <img
                        className="w-6 h-6"
                        alt="Like"
                        src="/icon-park-outline-like.svg"
                      />
                      <span className="[font-family:'Jura',Helvetica] font-normal text-white text-xs tracking-[0] leading-[normal] whitespace-nowrap">
                        {review.likes}
                      </span>
                    </button>

                    <button className="inline-flex gap-[3px] items-center bg-transparent border-0 cursor-pointer">
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
              </CardContent>
            </Card>
          ))}
      </div>
    );
}