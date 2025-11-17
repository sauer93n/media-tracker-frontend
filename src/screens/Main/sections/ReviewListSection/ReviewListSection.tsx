import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../../../../components/ui/tabs";

const categories = [
  { id: "movies", label: "Movies" },
  { id: "series", label: "Series" },
  { id: "anime", label: "Anime" },
  { id: "cartoons", label: "Cartoons" },
  { id: "games", label: "Games" },
  { id: "actors", label: "Actors" },
];

const reviews = [
  {
    id: 1,
    entityPhoto: "/entity-photo.svg",
    title: "Inception (2010)",
    rating: 8.5,
    reviewTitle: "Review Title",
    reviewContent:
      "Review contentReview contentReview contentReview contentReview Review contentReview contentReview contentReview contentReview contentReview contentReview contentReview Review contentReview contentReview contentReview contentReview contentReview contentReview contentReview Review contentReview contentReview content",
    likes: 555,
    dislikes: "1.1k",
  },
  {
    id: 2,
    entityPhoto: "/entity-photo.svg",
    title: "Inception (2010)",
    rating: 8.5,
    reviewTitle: "Review Title",
    reviewContent:
      "Review contentReview contentReview contentReview contentReview Review contentReview contentReview contentReview contentReview contentReview contentReview contentReview Review contentReview contentReview contentReview contentReview contentReview contentReview contentReview Review contentReview contentReview content",
    likes: 555,
    dislikes: "1.1k",
  },
  {
    id: 3,
    entityPhoto: "/entity-photo.svg",
    title: "Inception (2010)",
    rating: 8.5,
    reviewTitle: "Review Title",
    reviewContent:
      "Review contentReview contentReview contentReview contentReview Review contentReview contentReview contentReview contentReview contentReview contentReview contentReview Review contentReview contentReview contentReview contentReview contentReview contentReview contentReview Review contentReview contentReview content",
    likes: 555,
    dislikes: "1.1k",
  },
];

export const ReviewListSection = (): JSX.Element => {
  const [activeCategory, setActiveCategory] = useState("movies");

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
    <section className="flex flex-col items-start gap-2.5 px-40 py-2.5 w-full">
      <nav className="flex items-center justify-center gap-[123px] px-0 py-2.5 w-full">
        <Tabs
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="overflow-hidden"
        >
          <TabsList className="inline-flex items-start gap-2.5 px-0 py-px bg-transparent h-auto">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className={`inline-flex items-center justify-center gap-2.5 px-8 py-[11px] rounded-lg overflow-hidden border-b [border-bottom-style:solid] h-auto ${
                  activeCategory === category.id
                    ? "border-[#7167fa]"
                    : "border-[#2b41ae]"
                } data-[state=active]:bg-transparent data-[state=active]:shadow-none`}
              >
                <span className="[font-family:'Jura',Helvetica] font-light text-white text-xl tracking-[0] leading-[normal] whitespace-nowrap">
                  {category.label}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex w-[138px] items-start gap-2.5 px-0 py-px overflow-hidden">
          <Button
            variant="ghost"
            className="flex-1 border-[#2b41ae] items-center justify-center gap-2.5 px-8 py-[11px] rounded-lg overflow-hidden border-b [border-bottom-style:solid] h-auto hover:bg-transparent"
          >
            <span className="[font-family:'Jura',Helvetica] font-light text-white text-xl tracking-[0] leading-[normal] whitespace-nowrap">
              Reviews
            </span>
          </Button>
        </div>
      </nav>

      <div className="flex flex-col items-center gap-2.5 p-2.5 flex-1 w-full overflow-hidden">
        {reviews.map((review) => (
          <Card
            key={review.id}
            className="flex h-[340px] items-start gap-2.5 p-5 w-full bg-[#0c0d27] rounded-lg overflow-hidden shadow-[4px_4px_4px_#00000040] border-0"
          >
            <CardContent className="flex items-start gap-2.5 p-0 w-full h-full">
              <img
                className="flex-[0_0_auto] h-[300px]"
                alt="Entity photo"
                src={review.entityPhoto}
              />

              <div className="flex flex-col h-[300px] items-start gap-2.5 pt-2.5 pb-0 px-2.5 flex-1">
                <h2 className="mt-[-1.00px] [font-family:'Jura',Helvetica] font-bold text-white text-4xl tracking-[0] leading-[normal] whitespace-nowrap">
                  {review.title}
                </h2>

                {renderStars(review.rating)}

                <div className="flex flex-col items-end justify-end gap-2.5 pl-0 pr-[30px] py-0 w-full">
                  <div className="flex flex-col items-start gap-2.5 w-full">
                    <h3 className="mt-[-1.00px] [font-family:'Jura',Helvetica] font-normal text-white text-2xl tracking-[0] leading-[normal] whitespace-nowrap">
                      {review.reviewTitle}
                    </h3>

                    <p className="[font-family:'Jura',Helvetica] font-normal text-white text-sm tracking-[0] leading-[14.0px] overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:6] [-webkit-box-orient:vertical]">
                      {review.reviewContent}
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5 w-full">
                    <Button
                      variant="link"
                      className="inline-flex items-end gap-2.5 overflow-hidden border-b [border-bottom-style:solid] border-[#0004ff] h-auto p-0 rounded-none"
                    >
                      <span className="mt-[-2.00px] ml-[-1.00px] [-webkit-text-stroke:1px_#000000] [font-family:'Jura',Helvetica] font-bold text-white text-xs tracking-[0] leading-[normal] whitespace-nowrap">
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
    </section>
  );
};
