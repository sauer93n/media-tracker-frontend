import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient, type User } from "../../lib/api/auth";
import { Spinner } from "../../components/spinner/spinner";
import { Button } from "../../components/ui/button";
import { UserIcon, MailIcon, CalendarIcon, EditIcon, BookOpenIcon } from "lucide-react";
import { KinopoiskImportModal } from "../../components/ui/kinopoiskImportModal";
import { getMyReviews, getUserReviews } from "../../lib/api/reviews";
import { getUser } from "../../lib/api/user";
import { ReviewList } from "../../components/ui/reviewList";
import { Review } from "../../lib/models/review";
import { fetchAndEnrichReviews } from "../../lib/utils/reviewUtils";

export const UserProfile = () => {
    const navigate = useNavigate();
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [showKinopoiskModal, setShowKinopoiskModal] = useState(false);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [moreLoading, setMoreLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    
    const observerTarget = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const isLoadingRef = useRef(false);
    const currentPageRef = useRef(1);
    const hasMoreRef = useRef(true);

    const handleDeleteReview = (deletedReviewId: string) => {
        setReviews((prevReviews) => prevReviews.filter((review) => review.id !== deletedReviewId));
    };

    const loadMoreReviews = useCallback(async () => {
        if (isLoadingRef.current || !hasMoreRef.current || !user) {
            return;
        }

        isLoadingRef.current = true;
        setMoreLoading(true);

        try {
            const nextPage = currentPageRef.current + 1;
            
            const reviewsApiCall = isOwnProfile 
                ? () => getMyReviews("movie", nextPage, 10)
                : () => getUserReviews(user.id, nextPage, 10);
            
            const newReviews = await fetchAndEnrichReviews(reviewsApiCall);

            if (newReviews.length > 0) {
                currentPageRef.current = nextPage;
                setReviews((prev) => [...prev, ...newReviews]);
                const hasMoreData = newReviews.length === 10;
                hasMoreRef.current = hasMoreData;
                setHasMore(hasMoreData);
            } else {
                hasMoreRef.current = false;
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error loading more reviews:", error);
        } finally {
            isLoadingRef.current = false;
            setMoreLoading(false);
        }
    }, [user, isOwnProfile]);

    // Load initial reviews when user data is available
    useEffect(() => {
        const fetchInitialReviews = async () => {
            if (!user) {
                return;
            }
            
            setReviewsLoading(true);
            currentPageRef.current = 1;
            
            try {
                const reviewsApiCall = isOwnProfile 
                    ? () => getMyReviews("movie", 1, 10)
                    : () => getUserReviews(user.id, 1, 10);
                
                const enrichedReviews = await fetchAndEnrichReviews(reviewsApiCall);
                setReviews(enrichedReviews);
                
                const hasMoreData = enrichedReviews.length === 10;
                setHasMore(hasMoreData);
                hasMoreRef.current = hasMoreData;
                currentPageRef.current = 1;
            } catch (error) {
                console.error("Error fetching initial reviews:", error);
                setReviews([]);
                setHasMore(false);
            } finally {
                setReviewsLoading(false);
            }
        };

        fetchInitialReviews();
    }, [user, isOwnProfile]);

    // Setup Intersection Observer for infinite scroll
    useEffect(() => {
        if (!scrollContainerRef.current || !observerTarget.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoadingRef.current && hasMoreRef.current) {
                    loadMoreReviews();
                }
            },
            {
                root: scrollContainerRef.current,
                threshold: 0.1,
                rootMargin: "50px",
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
    }, [loadMoreReviews, hasMore, scrollContainerRef.current, observerTarget.current]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Get current user session to check if this is their own profile
                const session = await apiClient.auth.getSession(true);
                const currentUserData = session?.data?.session?.user as User | undefined;

                // If userId is provided, fetch that user's data
                // Otherwise, fetch the current user's data
                if (userId) {
                    const userData = await getUser(userId);
                    
                    // Use userId from params as id if it's not in the response
                    const userToSet = {
                        ...userData,
                        id: (userData as any).id || userId
                    } as User;
                    
                    setUser(userToSet);
                    const isOwn = currentUserData?.id === userId;
                    setIsOwnProfile(isOwn);
                } else if (currentUserData) {
                    setUser(currentUserData);
                    setIsOwnProfile(true);
                } else {
                    // Not logged in, redirect to login
                    navigate("/login");
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [navigate, userId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Spinner />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto p-6">
            {/* Profile Header */}
            <section className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 bg-slate-800/30 rounded-xl border border-slate-700/50">
                {/* Avatar */}
                <div className="flex items-center justify-center w-32 h-32 bg-[#2b41ae] rounded-full">
                    <UserIcon className="w-16 h-16 text-white" />
                </div>

                {/* User Info */}
                <div className="flex flex-col flex-1 gap-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <h1 className="[font-family:'Jura',Helvetica] font-bold text-white text-3xl">
                            {user.username || "User"}
                        </h1>
                        {isOwnProfile && (
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    onClick={() => setShowKinopoiskModal(true)}
                                    className="bg-gradient-to-r from-[#ff6600] to-[#ff8533] hover:from-[#ff7722] hover:to-[#ff9955] rounded-lg inline-flex items-center justify-center gap-2 px-4 py-2 h-auto transition-all shadow-lg shadow-[#ff6600]/20"
                                >
                                    <div className="w-5 h-5 bg-black rounded flex items-center justify-center flex-shrink-0">
                                        <span className="text-[#ff6600] font-bold text-[10px]">КП</span>
                                    </div>
                                    <span className="[font-family:'Jura',Helvetica] font-bold text-white text-sm">
                                        Import from Kinopoisk
                                    </span>
                                </Button>
                                <Button
                                    onClick={() => {/* TODO: Implement edit profile */}}
                                    className="bg-[#2b41ae] rounded-lg inline-flex items-center justify-center gap-2 px-4 py-2 h-auto hover:opacity-90"
                                >
                                    <EditIcon className="w-4 h-4 text-white" />
                                    <span className="[font-family:'Jura',Helvetica] font-light text-white text-sm">
                                        Edit Profile
                                    </span>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* User Details */}
                    <div className="flex flex-col gap-3">
                        {user.email && (
                            <div className="flex items-center gap-3">
                                <MailIcon className="w-5 h-5 text-slate-400" />
                                <span className="[font-family:'Jura',Helvetica] font-normal text-slate-300 text-sm">
                                    {user.email}
                                </span>
                            </div>
                        )}
                        <div className="flex items-center gap-3">
                            <CalendarIcon className="w-5 h-5 text-slate-400" />
                            <span className="[font-family:'Jura',Helvetica] font-normal text-slate-300 text-sm">
                                Member since {user.created_at ? new Date(user.created_at).toLocaleDateString() : "Unknown"}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center gap-2 p-6 bg-slate-800/30 rounded-xl border border-slate-700/50">
                    <BookOpenIcon className="w-8 h-8 text-[#7167fa]" />
                    <span className="[font-family:'Jura',Helvetica] font-bold text-white text-2xl">
                        0
                    </span>
                    <span className="[font-family:'Jura',Helvetica] font-light text-slate-400 text-sm">
                        Reviews Written
                    </span>
                </div>
                <div className="flex flex-col items-center gap-2 p-6 bg-slate-800/30 rounded-xl border border-slate-700/50">
                    <img src="/icon-park-outline-like.svg" alt="Likes" className="w-8 h-8" />
                    <span className="[font-family:'Jura',Helvetica] font-bold text-white text-2xl">
                        0
                    </span>
                    <span className="[font-family:'Jura',Helvetica] font-light text-slate-400 text-sm">
                        Likes Received
                    </span>
                </div>
                <div className="flex flex-col items-center gap-2 p-6 bg-slate-800/30 rounded-xl border border-slate-700/50">
                    <img src="/ic-baseline-star.svg" alt="Rating" className="w-8 h-8" />
                    <span className="[font-family:'Jura',Helvetica] font-bold text-white text-2xl">
                        0.0
                    </span>
                    <span className="[font-family:'Jura',Helvetica] font-light text-slate-400 text-sm">
                        Average Rating
                    </span>
                </div>
            </section>

            {/* My Reviews Section */}
            <section className="flex flex-col gap-4 h-[600px]">
                <h2 className="[font-family:'Jura',Helvetica] font-bold text-white text-2xl">
                    My Reviews
                </h2>
                {reviewsLoading ? (
                    <div className="flex items-center justify-center py-12 px-4 bg-slate-800/30 rounded-lg border border-slate-700/50 flex-1">
                        <Spinner />
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 bg-slate-800/30 rounded-lg border border-slate-700/50 flex-1">
                        <BookOpenIcon className="w-12 h-12 text-slate-500 mb-4" />
                        <span className="[font-family:'Jura',Helvetica] font-light text-slate-400 text-lg">
                            No reviews yet
                        </span>
                        <span className="[font-family:'Jura',Helvetica] font-light text-slate-500 text-sm mt-2">
                            {isOwnProfile ? "Start writing reviews to see them here!" : "No reviews from this user yet."}
                        </span>
                        {isOwnProfile && (
                            <Button
                                onClick={() => navigate("/create-review/movie")}
                                className="mt-4 bg-[#2b41ae] rounded-lg inline-flex items-center justify-center gap-2 px-4 py-2 h-auto hover:opacity-90"
                            >
                                <span className="[font-family:'Jura',Helvetica] font-light text-white text-sm">
                                    Write a Review
                                </span>
                            </Button>
                        )}
                    </div>
                ) : (
                    <>
                        <ReviewList 
                            reviews={reviews} 
                            onDelete={handleDeleteReview}
                            observerTarget={observerTarget}
                            showLoadTrigger={hasMore}
                            scrollContainerRef={scrollContainerRef}
                        />
                        {moreLoading && (
                            <div className="flex items-center justify-center py-4">
                                <Spinner />
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* Kinopoisk Import Modal */}
            <KinopoiskImportModal 
                isOpen={showKinopoiskModal} 
                onClose={() => setShowKinopoiskModal(false)} 
            />
        </div>
    );
};
