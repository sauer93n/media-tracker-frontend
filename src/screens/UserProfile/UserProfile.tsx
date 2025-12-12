import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient, type User } from "../../lib/api/auth";
import { Spinner } from "../../components/spinner/spinner";
import { Button } from "../../components/ui/button";
import { UserIcon, MailIcon, CalendarIcon, EditIcon, BookOpenIcon } from "lucide-react";
import { KinopoiskImportModal } from "../../components/ui/kinopoiskImportModal";

export const UserProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [showKinopoiskModal, setShowKinopoiskModal] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const session = await apiClient.auth.getSession(true);
                if (session?.data?.session?.user) {
                    setUser(session.data.session.user as User);
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
    }, [navigate]);

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
            <section className="flex flex-col gap-4">
                <h2 className="[font-family:'Jura',Helvetica] font-bold text-white text-2xl">
                    My Reviews
                </h2>
                <div className="flex flex-col items-center justify-center py-12 px-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                    <BookOpenIcon className="w-12 h-12 text-slate-500 mb-4" />
                    <span className="[font-family:'Jura',Helvetica] font-light text-slate-400 text-lg">
                        No reviews yet
                    </span>
                    <span className="[font-family:'Jura',Helvetica] font-light text-slate-500 text-sm mt-2">
                        Start writing reviews to see them here!
                    </span>
                    <Button
                        onClick={() => navigate("/create-review/movie")}
                        className="mt-4 bg-[#2b41ae] rounded-lg inline-flex items-center justify-center gap-2 px-4 py-2 h-auto hover:opacity-90"
                    >
                        <span className="[font-family:'Jura',Helvetica] font-light text-white text-sm">
                            Write a Review
                        </span>
                    </Button>
                </div>
            </section>

            {/* Kinopoisk Import Modal */}
            <KinopoiskImportModal 
                isOpen={showKinopoiskModal} 
                onClose={() => setShowKinopoiskModal(false)} 
            />
        </div>
    );
};
