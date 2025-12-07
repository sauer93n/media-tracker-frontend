import { MoreHorizontal, TrashIcon, PencilIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteReview } from "../../lib/api/reviews";
import { Button } from "./button";

interface ReviewOptionsMenuProps {
    reviewId: string;
    onDelete?: () => void;
}

export const ReviewOptionsMenu = ({ reviewId, onDelete }: ReviewOptionsMenuProps) => {
    const [showOptions, setShowOptions] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="relative ml-auto">
            <Button
                onClick={() => setShowOptions(!showOptions)}
                variant="ghost"
                size="icon"
                className="hover:bg-white/10 rounded-full"
            >
                <MoreHorizontal className="w-6 h-6 text-white" />
            </Button>
            {showOptions && (
                <>
                    {/* Backdrop to close on outside click */}
                    <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowOptions(false)}
                    />
                    
                    {/* Dropdown menu */}
                    <div className="absolute right-0 top-full mt-2 min-w-[160px] bg-[#1a1b3a] rounded-lg shadow-xl border border-[#2b41ae] overflow-hidden z-20">
                        <Button 
                            onClick={async () => {
                                await deleteReview(reviewId);
                                setShowOptions(false);
                                onDelete?.();
                            }}
                            variant="ghost"
                            className="w-full justify-start gap-3 px-4 py-3 h-auto rounded-none hover:bg-red-500/20 text-white border-0 border-b border-[#2b41ae]"
                        >
                            <TrashIcon className="w-4 h-4 text-red-400" />
                            <span className="[font-family:'Jura',Helvetica] font-normal text-sm">
                                Delete
                            </span>
                        </Button>
                        
                        <Button 
                            onClick={() => {
                                navigate(`/edit-review/${reviewId}`);
                                setShowOptions(false);
                            }}
                            variant="ghost"
                            className="w-full justify-start gap-3 px-4 py-3 h-auto rounded-none hover:bg-blue-500/20 text-white border-0"
                        >
                            <PencilIcon className="w-4 h-4 text-blue-400" />
                            <span className="[font-family:'Jura',Helvetica] font-normal text-sm">
                                Edit
                            </span>
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};
