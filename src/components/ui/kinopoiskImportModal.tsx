import { useState } from "react";
import { Button } from "./button";
import { XIcon, Loader2Icon } from "lucide-react";
import { importKinopoiskRatings } from "../../lib/api/kinopoisk";
import toast from "react-hot-toast";

interface KinopoiskImportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const KinopoiskImportModal = ({ isOpen, onClose }: KinopoiskImportModalProps) => {
    const [userId, setUserId] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleImport = async () => {
        if (!userId.trim()) {
            toast.error("Please enter your Kinopoisk user ID");
            return;
        }

        setLoading(true);
        try {
            const result = await importKinopoiskRatings(userId.trim());
            toast.success(result.message || `Successfully imported ratings from Kinopoisk!`);
            onClose();
            setUserId("");
        } catch (error) {
            toast.error("Failed to import ratings. Please check your user ID and try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={handleBackdropClick}
        >
            <div className="relative w-full max-w-md mx-4 bg-[#1a1a2e] rounded-xl border border-[#ff6600]/30 shadow-2xl shadow-[#ff6600]/10">
                {/* Header with Kinopoisk branding */}
                <div className="flex items-center justify-between p-4 border-b border-[#ff6600]/20 bg-gradient-to-r from-[#ff6600] to-[#ff8533] rounded-t-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                            <span className="text-[#ff6600] font-bold text-sm">КП</span>
                        </div>
                        <h2 className="[font-family:'Jura',Helvetica] font-bold text-white text-xl">
                            Import from Kinopoisk
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white transition-colors"
                    >
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="[font-family:'Jura',Helvetica] text-slate-300 text-sm mb-4">
                        Enter your Kinopoisk user ID to import your movie ratings. You can find your ID in your Kinopoisk profile URL.
                    </p>
                    
                    <div className="flex flex-col gap-2 mb-6">
                        <label className="[font-family:'Jura',Helvetica] text-slate-400 text-sm">
                            Kinopoisk User ID
                        </label>
                        <input
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="e.g., 19530776"
                            className="w-full px-4 py-3 bg-[#0d0d1a] border border-[#ff6600]/30 rounded-lg text-white [font-family:'Jura',Helvetica] placeholder:text-slate-500 focus:outline-none focus:border-[#ff6600] focus:ring-1 focus:ring-[#ff6600]/50 transition-colors"
                        />
                        <span className="[font-family:'Jura',Helvetica] text-slate-500 text-xs">
                            Example: kinopoisk.ru/user/<span className="text-[#ff6600]">19530776</span>/
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <Button
                            onClick={onClose}
                            className="flex-1 bg-slate-700 hover:bg-slate-600 rounded-lg py-3 h-auto transition-colors"
                        >
                            <span className="[font-family:'Jura',Helvetica] font-normal text-white">
                                Cancel
                            </span>
                        </Button>
                        <Button
                            onClick={handleImport}
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-[#ff6600] to-[#ff8533] hover:from-[#ff7722] hover:to-[#ff9955] rounded-lg py-3 h-auto transition-all disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2Icon className="w-5 h-5 text-white animate-spin" />
                            ) : (
                                <span className="[font-family:'Jura',Helvetica] font-bold text-white">
                                    Import Ratings
                                </span>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
