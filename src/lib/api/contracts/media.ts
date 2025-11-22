/**
 * Data transfer object for media details (e.g., movie or TV show)
 */
export type MediaDetailsDTO = {
    id: number;
    title: string;
    overview: string;
    posterUrl: string | null;
    releaseDate: string | null; // ISO 8601 date string
}
