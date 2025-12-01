import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "../../../../components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { getAllReviews, getMyReviews } from "../../../../lib/api/reviews";
import { ReviewList } from "../../../../components/ui/reviewList";
import { Review } from "../../../../lib/models/review";
import { fetchAndEnrichReviews } from "../../../../lib/utils/reviewUtils";
import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const categories = [
  { id: "movie", label: "Movies" },
  { id: "tv", label: "Series" }
];

export const ReviewsListSection = (): JSX.Element => {
  const [activeCategory, setActiveCategory] = useState("movie");
  const [loading, setLoading] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const observerTarget = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);

  const handleDeleteReview = (deletedReviewId: string) => {
    setReviews((prevReviews) => prevReviews.filter((review) => review.id !== deletedReviewId));
    setAllReviews((prevReviews) => prevReviews.filter((review) => review.id !== deletedReviewId));
  }

  const loadMoreReviews = useCallback(async () => {
    if (isLoadingRef.current || !hasMore) return;
    
    isLoadingRef.current = true;
    setMoreLoading(true);
    
    try {
      const newReviews = await fetchAndEnrichReviews(() => getAllReviews(currentPage + 1, 5));
      if (newReviews.length > 0) {
        setAllReviews((prev) => [...prev, ...newReviews]);
        setCurrentPage((prev) => prev + 1);
        setHasMore(newReviews.length === 5);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more reviews:", error);
    } finally {
      isLoadingRef.current = false;
      setMoreLoading(false);
    }
  }, [currentPage, hasMore]);

  useEffect(() => {
    if (activeCategory !== "all" || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingRef.current) {
          loadMoreReviews();
        }
      },
      { 
        root: scrollContainerRef.current,
        threshold: 0.1, 
        rootMargin: '50px' 
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [activeCategory, hasMore, loadMoreReviews]);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const enrichedReviews = await fetchAndEnrichReviews(getMyReviews);
        setReviews(enrichedReviews);
      } catch (error) {
        console.error(`Error fetching my reviews: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [activeCategory]);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const enrichedReviews = await fetchAndEnrichReviews(() => getAllReviews(1, 5));
        setAllReviews(enrichedReviews);
        setHasMore(enrichedReviews.length === 5);
        setCurrentPage(1);
      } catch (error) {
        console.error(`Error fetching all reviews: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

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
            <TabsTrigger
                onClick={() => setActiveCategory("all")}
                key={"all"}
                value={"Reviews"}
                className={`inline-flex items-center justify-center gap-2.5 px-8 py-[11px] rounded-lg overflow-hidden border-b [border-bottom-style:solid] h-auto ${
                  activeCategory === "all"
                    ? "border-[#7167fa]"
                    : "border-[#2b41ae]"
                } data-[state=active]:bg-transparent data-[state=active]:shadow-none`}
              >
                <span className="[font-family:'Jura',Helvetica] font-light text-white text-xl tracking-[0] leading-[normal] whitespace-nowrap">
                  Users' Reviews
                </span>
              </TabsTrigger>
          </TabsList>
        </Tabs>
      </nav>

      {loading ? (
        <div className="flex justify-center items-center w-full h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7167fa]"></div>
          <span className="ml-3 [font-family:'Jura',Helvetica] font-light text-white text-sm tracking-[0] leading-[normal]">Loading...</span>
        </div>
      ) : (
        activeCategory === "all" ? 
          <ReviewList 
            reviews={allReviews} 
            onDelete={handleDeleteReview} 
            observerTarget={observerTarget}
            scrollContainerRef={scrollContainerRef}
            showLoadTrigger={hasMore}
          /> :
          <ReviewList 
            reviews={reviews.filter(review => review.referenceType.toLowerCase() === activeCategory.toLowerCase())} 
            onDelete={handleDeleteReview} 
          />
      )}

      {        
        moreLoading && (
        <div className="flex justify-center items-center w-full h-full bg-transparent absolute bottom-0 left-0">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7167fa] bg-transparent absolute"></div>
        </div>
      )}

      {
        activeCategory !== "all" && (
          <div className="flex self-end w-full max-h-max px-0 py-2.5">
            <Button
              onClick={() => {
                navigate(`/create-review/${activeCategory}`);
              }}
              className="bg-[#00116a] rounded-lg inline-flex items-center justify-center gap-2.5 p-2 h-auto hover:opacity-90 flex-1"
            >
              <PlusIcon className="w-6 h-6 text-white" />
              <span className="[font-family:'Jura',Helvetica] font-light text-white text-xl tracking-[0] leading-[normal]">
                Add Review
              </span>
            </Button>
          </div>
        )
      }
      {/* {
        activeCategory === "all" && hasMore && !moreLoading && (
          <div className="flex self-end w-full max-h-max px-0 py-2.5">
            <Button
              onClick={loadMoreReviews}
              className="bg-[#00116a] rounded-lg inline-flex items-center justify-center gap-2.5 p-2 h-auto hover:opacity-90 flex-1"
            >
              <span className="[font-family:'Jura',Helvetica] font-light text-white text-xl tracking-[0] leading-[normal]">
                Load More Reviews
              </span>
            </Button>
          </div>
        )
      } */}
      {
        activeCategory === "all" && !hasMore && allReviews.length > 0 && (
          <div className="flex justify-center w-full py-4">
            <span className="[font-family:'Jura',Helvetica] font-light text-slate-400 text-sm">
              No more reviews to load
            </span>
          </div>
        )
      }
    </section>
  );
};
