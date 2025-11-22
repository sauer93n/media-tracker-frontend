import { MediaDetailsDTO } from "../api/contracts/media";
import { ReviewDTO } from "../api/contracts/review";

export type Review = ReviewDTO & {
    media: MediaDetailsDTO
}