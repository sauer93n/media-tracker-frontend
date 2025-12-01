import { useState } from "react";

const enum StarFill
{
  Empty,
  Half,
  Filled
} 

const Star = ({ 
  filled, 
  onLeftClick, 
  onRightClick 
}: { 
  filled: StarFill; 
  onLeftClick: () => void;
  onRightClick: () => void;
}) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const halfWidth = rect.width / 2;
    
    if (clickX < halfWidth) 
      onLeftClick();
    else
      onRightClick();
  };

  return (
    <div 
      className="w-8 h-8 cursor-pointer inline-block"
      onClick={handleClick}
    >
      <img
        src={
          filled === StarFill.Filled 
            ? "/ic-baseline-star.svg" 
            : filled === StarFill.Half 
            ? "/ic-baseline-star-half.svg" 
            : "/ic-baseline-star-border.svg"
        }
        alt={
          filled === StarFill.Filled 
            ? "filled star" 
            : filled === StarFill.Half 
            ? "half filled star" 
            : "empty star"
        }
        className="w-full h-full pointer-events-none"
      />
    </div>
  );
};

export const StarRating = ({ rating, setRating }: { rating: number; setRating: (rating: number) => void }) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const getStarFill = (starIndex: number): StarFill => {
    const currentRating = hoverRating ?? rating;
    if (currentRating >= starIndex + 1) {
      return StarFill.Filled;
    } else if (currentRating >= starIndex + 0.5 && currentRating < starIndex + 1) {
      return StarFill.Half;
    } else {
      return StarFill.Empty;
    }
  };

  return (
    <div 
      className="flex gap-1 items-center"
      onMouseLeave={() => setHoverRating(null)}
    >
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const halfWidth = rect.width / 2;
            setHoverRating(mouseX < halfWidth ? i + 0.5 : i + 1);
          }}
          className={hoverRating !== null ? "opacity-70" : ""}
        >
          <Star 
            filled={getStarFill(i)}
            onLeftClick={() => setRating(i + 0.5)}
            onRightClick={() => setRating(i + 1)}
          />
        </div>
      ))}
      <span className="ml-2 text-sm text-slate-400">
        {hoverRating !== null ? `${hoverRating}/10` : `${rating}/10`}
      </span>
    </div>
  );
};