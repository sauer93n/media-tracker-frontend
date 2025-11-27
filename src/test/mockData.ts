import { Review } from '../lib/models/review'
import { MediaDetailsDTO } from '../lib/api/contracts/media'

// Mock user data
export const mockUser = {
  id: '1',
  email: 'test@example.com',
  username: 'testuser',
}

// Mock media details
export const mockMediaDetails: MediaDetailsDTO = {
  id: 1,
  title: 'Inception',
  overview: 'A thief who steals corporate secrets through dream-sharing technology.',
  releaseDate: '2010-07-16',
  posterUrl: '/test-poster.jpg',
}

// Mock review
export const mockReview: Review = {
  id: '1',
  authorId: '1',
  referenceId: '550',
  referenceType: 'Movie',
  rating: 9,
  content: 'Amazing movie! The plot was intricate and engaging.',
  likes: 42,
  dislikes: 3,
  isLikedByUser: false,
  isDislikedByUser: false,
  media: mockMediaDetails,
}

// Mock multiple reviews
export const mockReviews: Review[] = [
  mockReview,
  {
    ...mockReview,
    id: '2',
    referenceId: '13',
    rating: 8,
    content: 'Great show with compelling characters.',
    likes: 28,
    dislikes: 1,
    media: {
      ...mockMediaDetails,
      id: 2,
      title: 'Breaking Bad',
    },
  },
  {
    ...mockReview,
    id: '3',
    referenceId: '238',
    rating: 10,
    content: 'A masterpiece! One of the best movies ever made.',
    likes: 156,
    dislikes: 2,
    media: {
      ...mockMediaDetails,
      id: 3,
      title: 'The Godfather',
    },
  },
]

// Mock search results
export const mockSearchResults = [
  {
    id: 1,
    title: 'Inception',
    releaseDate: 2010,
    description: 'A thief who steals corporate secrets.',
  },
  {
    id: 2,
    title: 'Interstellar',
    releaseDate: 2014,
    description: 'A team of explorers travel through a wormhole.',
  },
]
