import { useEffect, useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { getAllReviews, getMyReviews } from "../../../../lib/api/reviews";
import { ReviewList } from "../../../../components/ui/reviewList";
import { Review } from "../../../../lib/models/review";
import { transformReview } from "../../../../lib/transformers/reviewTransformer";
import { getMediaDetails, getPosterImage } from "../../../../lib/api/media";
import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const categories = [
  { id: "movies", label: "Movies" },
  { id: "series", label: "Series" }
];

export const MyReviewsListSection = (): JSX.Element => {
  const [activeCategory, setActiveCategory] = useState("movies");
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const reviews: Review[] = (await getAllReviews()).data.map(transformReview);
        await Promise.all(reviews.map(async (review) => {
          // Fetch media details for each review
          // This assumes you have a function to get media details by ID
          const mediaDetails = await getMediaDetails(review.referenceId, review.referenceType);
          const poster = await getPosterImage(review.referenceType, review.referenceId);
          review.media = mediaDetails;
          review.media.posterUrl = poster;
        }));

        setReviews(reviews);
      } catch (error) {
        console.error(`Error fetching reviews: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [activeCategory]);

  return (
    <section className="flex flex-col items-start gap-2.5 px-40 py-2.5 w-full flex-1 overflow-hidden">
      <nav className="flex items-center justify-center gap-[123px] px-0 py-2.5 w-full flex-shrink-0">
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

      {loading ? (
        <div className="flex justify-center items-center w-full h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7167fa]"></div>
          <span className="ml-3 [font-family:'Jura',Helvetica] font-light text-white text-sm tracking-[0] leading-[normal]">Loading...</span>
        </div>
      ) : (
        <ReviewList reviews={[...reviews, ...reviews, ...reviews, ...reviews, ...reviews]} />
      )}

      <div className="flex self-end w-full max-h-max px-0 py-2.5">
        <Button
          onClick={() => {
            navigate("/create-review");
          }}
          className="bg-[#00116a] rounded-lg inline-flex items-center justify-center gap-2.5 p-2 h-auto hover:opacity-90 flex-1"
        >
          <PlusIcon className="w-6 h-6 text-white" />
          <span className="[font-family:'Jura',Helvetica] font-light text-white text-xl tracking-[0] leading-[normal]">
            Add Review
          </span>
        </Button>
      </div>
    </section>
  );
};
