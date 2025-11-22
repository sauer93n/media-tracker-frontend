/**
 * Generic interface for paginated API responses
 */
export type PagedResult<T> = {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

/**
 * Enum for different types of media references
 */
export type ReferenceType = 'Movie' | 'TV';
