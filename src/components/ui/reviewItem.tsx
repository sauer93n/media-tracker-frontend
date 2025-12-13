import { Review } from "../../lib/models/review";
import { Card, CardContent } from "./card";
import { ReviewContent } from "./reviewContent";

interface ReviewProps {
    review: Review;
    onDelete?: () => void;
}

export const ReviewItem = ({ review, onDelete }: ReviewProps) => {
    

    return (
        <Card
            key={review.id}
            className="flex h-[380px] flex-shrink-0 items-start gap-2.5 p-5 w-full bg-[#0c0d27] rounded-lg overflow-hidden shadow-[4px_4px_4px_#00000040] border-0 relative"
        >
            <CardContent className="flex items-start gap-2.5 p-0 w-full h-full">
                <ReviewContent review={review} onDelete={onDelete} viewMode="short"/>
            </CardContent>
        </Card>
    )
}