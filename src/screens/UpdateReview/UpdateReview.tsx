import { useEffect, useState } from "react";
import { StarRating } from "../../components/starRating";
import { Button } from "../../components/ui/button";
import { GoToDashboard } from "../../components/ui/goToDashboard";
import { MediaDetailsDTO } from "../../lib/api/contracts/media";
import { useNavigate, useParams } from "react-router-dom";
import { getReviewById, updateReview } from "../../lib/api/reviews";
import toast from "react-hot-toast";
import { fetchAndEnrichSingleReview } from "../../lib/utils/reviewUtils";

interface UpdateReviewProps {
    reviewId: string;
    selectedMedia: MediaDetailsDTO;
    rating: number;
    reviewContent: string;
}

const UpdateReviewContent = (props: UpdateReviewProps) => {
    const { selectedMedia, rating: initialRating, reviewContent: initialReviewContent } = props;
    const [rating, setRating] = useState(initialRating);
    const [reviewContent, setReviewContent] = useState(initialReviewContent);
    const navigate = useNavigate();

    useEffect(() => {
        setRating(initialRating);
        setReviewContent(initialReviewContent);
    }, [initialRating, initialReviewContent]);

    const handleCancel = () => {
        resetFields();
        navigate(-1);
    }

    const resetFields = () => {
        setRating(initialRating);
        setReviewContent(initialReviewContent);
    }

    const handleSave = async () => {
        try {
            await updateReview(props.reviewId, reviewContent, rating);
            toast.success("Review updated successfully!", { id: 'update-review-success', toasterId: 'page-layout' });
        } 
        catch (error) {
            toast.error(`Error updating review: ${error}`, { id: 'update-review-error', toasterId: 'page-layout' });
        }
    }

    return (
        <div className="flex-1 w-full flex flex-col items-center overflow-hidden p-10 text-white">
        <div className="w-full max-w-4xl flex flex-col gap-6">
            <div>
                <GoToDashboard />
            </div>
            <div className="space-y-6">
                {selectedMedia && (
                    <div className="bg-slate-800 p-4 rounded flex items-center">
                        <img src={selectedMedia.posterUrl ?? "/entity-photo.svg"} alt={`${selectedMedia.title} (${new Date(selectedMedia.releaseDate ?? 0).getFullYear()})`} className="w-16 h-24 mr-4"/>
                        <div>
                            <h3 className="font-bold text-xl">{selectedMedia.title}</h3>
                            <p>{new Date(selectedMedia.releaseDate ?? 0).getFullYear()}</p>
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium mb-1">Rating</label>
                    <StarRating rating={rating} setRating={setRating} />
                </div>

                <div>
                    <label htmlFor="review-content" className="block text-sm font-medium mb-1">Your Review</label>
                    <textarea
                        id="review-content"
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                        rows={10}
                        className="w-full p-2 rounded bg-slate-800 border border-slate-700"
                        placeholder="What did you think?"
                    />
                </div>

                <div className="flex gap-4 justify-end">
                    <Button onClick={handleCancel} className="bg-blue-600 hover:bg-blue-700">
                        Cancel
                    </Button>

                    <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
                        Save Review
                    </Button>
                </div>
            </div>
        </div>
    </div>
    )
}

export const UpdateReview = () => {
    const { reviewId } = useParams<{ reviewId: string }>();
    const [selectedMedia, setSelectedMedia] = useState<MediaDetailsDTO | null>(null);
    const [rating, setRating] = useState(0);
    const [reviewContent, setReviewContent] = useState("");
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchReviewData = async () => {
            try {
                setLoading(true);
                const review = await fetchAndEnrichSingleReview(() => getReviewById(reviewId!));
                console.log('Fetched review:', review);
                if (review) {
                    setSelectedMedia(review.media);
                    setRating(review.rating);
                    setReviewContent(review.content);
                } else {
                    toast.error("Review not found");
                }
            } catch (error) {
                console.error('Error loading review:', error);
                toast.error("Failed to load review");
            } finally {
                setLoading(false);
            }
        }
    
        if (reviewId) {
            fetchReviewData();
        }
        else {
            toast.error("No review ID provided");
            setLoading(false);
        }
    }, [reviewId])

    if (loading || !selectedMedia) {
        return (
        <div className="flex justify-center items-center w-full h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7167fa]"></div>
          <span className="ml-3 [font-family:'Jura',Helvetica] font-light text-white text-sm tracking-[0] leading-[normal]">Loading...</span>
        </div>
        )
    }

    return (
        <UpdateReviewContent reviewId={reviewId!} selectedMedia={selectedMedia} rating={rating} reviewContent={reviewContent} />
    )
}