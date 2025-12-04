import { useParams } from 'react-router-dom';
import { useCombobox } from 'downshift';
import { useDebounce } from '../../hooks/useDebounce';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useMediaSearch } from '../../hooks/useMediaSearch';
import { Button } from '../../components/ui/button';
import { MediaDetailsDTO } from '../../lib/api/contracts/media';
import { createReview } from '../../lib/api/reviews';
import { GoToDashboard } from '../../components/ui/goToDashboard';
import toast from 'react-hot-toast';
import { StarRating } from '../../components/starRating';
import { ReferenceType } from '../../lib/api/contracts/common';

const CreateReviewContent = () => {
  const { mediaType } = useParams<{ mediaType: string }>();

  const [mediaSearch, setMediaSearch] = useLocalStorage('review_mediaSearch', '');
  const [selectedMedia, setSelectedMedia] = useLocalStorage<MediaDetailsDTO | null>('review_selectedMedia', null);
  const [rating, setRating] = useLocalStorage('review_rating', 0);
  const [reviewContent, setReviewContent] = useLocalStorage('review_content', '');
  
  const debouncedSearchTerm = useDebounce(mediaSearch, 500);
  const { searchResults, isSearching } = useMediaSearch(debouncedSearchTerm, mediaType);

  const {
    isOpen,
    getInputProps,
    getItemProps,
    getMenuProps,
    highlightedIndex,
  } = useCombobox({
    items: searchResults,
    itemToString: (item) => (item ? item.title : ''),
    inputValue: mediaSearch,
    onInputValueChange: ({ inputValue: newInputValue }) => {
      setMediaSearch(newInputValue);
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        handleSelectMedia(selectedItem);
      }
    }
  });

  const handleSelectMedia = (media: MediaDetailsDTO) => {
    setSelectedMedia(media);
  }

  const handleSave = () => {
    if (!selectedMedia) {
      toast.error("Please select a media item to review.", { id: 'no-media', toasterId: 'page-layout' });
      return;
    }
    if (rating === 0) {
      toast.error("Please provide a rating.", { id: 'no-rating', toasterId: 'page-layout' });
      return;
    }
    if (!reviewContent.trim()) {
      toast.error("Please write a review.", { id: 'no-review', toasterId: 'page-layout' });
      return;
    }

    let refType = mediaType![0].toUpperCase() + mediaType!.slice(1).toLowerCase();

    const reviewData = {
      referenceId: selectedMedia.id.toString(),
      referenceType: ReferenceType[refType as keyof typeof ReferenceType],
      rating,
      content: reviewContent,
    };

    // Here you would call your API to save the review
    createReview(reviewData)
    .then(() => {
      // Clear local storage after saving
      localStorage.removeItem('review_mediaSearch');
      localStorage.removeItem('review_selectedMedia');
      localStorage.removeItem('review_rating');
      localStorage.removeItem('review_content');
      toast.success("Review saved successfully!", { id: 'review-saved', toasterId: 'page-layout' });
      clearData();
    })
    .catch(() => {
      toast.error("Failed to save review. Please try again.", { id: 'review-failed', toasterId: 'page-layout' });
    });
  };

  const clearData = () => {
    setMediaSearch("");
    setRating(0);
    setReviewContent("");
    setSelectedMedia(null);
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center overflow-auto p-10 text-white">
        <div className="w-full max-w-4xl flex flex-col gap-6">
            <div>
                <GoToDashboard />
            </div>
            <h1 className="[font-family:'Jura',Helvetica] font-bold text-4xl mb-2">Create a New Review</h1>
            <p className="text-lg mb-6">
                You are reviewing a: <span className="font-bold capitalize bg-purple-600 px-2 py-1 rounded">{mediaType}</span>
            </p>

            <div className="space-y-6">
                <div>
                    <label htmlFor="media-search" className="block text-sm font-medium mb-2">Search for a {mediaType}</label>
                    <div className="relative">
                        <input
                            {...getInputProps({
                                id: 'media-search',
                                type: 'text',
                                placeholder: `Search for a ${mediaType}... e.g., "Inception"`,
                                className: 'w-full p-3 rounded bg-slate-800 border border-slate-600 focus:border-purple-500 focus:outline-none text-white',
                                autoComplete: 'off',
                            })}
                        />
                        {isSearching && (
                            <div className="absolute top-[calc(50%-0.625rem)] right-3 w-5 h-5 border-2 border-t-transparent border-purple-500 rounded-full animate-spin"></div>
                        )}
                        {isOpen && searchResults.length > 0 && (
                            <ul
                                {...getMenuProps()}
                                className="absolute z-20 w-full bg-slate-900 border border-slate-600 rounded-lg mt-2 max-h-96 overflow-y-auto shadow-lg"
                            >
                                {searchResults.map((media, index) => (
                                    <li 
                                        {...getItemProps({
                                            item: media,
                                            index,
                                        })}
                                        key={`${media.id}-${index}`}
                                        className={`p-3 cursor-pointer flex items-start gap-3 border-b border-slate-700 last:border-b-0 transition-colors ${
                                            highlightedIndex === index ? 'bg-slate-700' : 'hover:bg-slate-800'
                                        }`}
                                    >
                                        <img 
                                            src={media.posterUrl ?? "/entity-photo.svg"} 
                                            alt={media.title} 
                                            className="w-12 h-16 object-cover rounded flex-shrink-0"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = '/entity-photo.svg';
                                            }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-white truncate">{media.title}</p>
                                            <p className="text-sm text-slate-400">{new Date(media.releaseDate ?? 0).getFullYear()}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {isOpen && mediaSearch && !isSearching && searchResults.length === 0 && (
                            <div className="absolute z-20 w-full bg-slate-900 border border-slate-600 rounded-lg mt-2 p-4 text-center text-slate-400">
                                No {mediaType}s found. Try a different search.
                            </div>
                        )}
                    </div>
                </div>

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

                <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
                    Save Review
                </Button>
            </div>
        </div>
    </div>
  );
};

export const CreateReview = (): JSX.Element => {
  return (
    <CreateReviewContent />
  )
};
