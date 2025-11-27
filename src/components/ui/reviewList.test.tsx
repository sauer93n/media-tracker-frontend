import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ReviewList } from './reviewList'
import { mockReviews } from '../../test/mockData'


const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('ReviewList Component', () => {
  it('renders "No reviews found" when reviews array is empty', () => {
    render(<ReviewList reviews={[]} />)
    expect(screen.getByText(/no reviews found/i)).toBeInTheDocument()
  })

  it('renders list of reviews', () => {
    render(<ReviewList reviews={mockReviews} />)
    
    expect(screen.getByText('Inception')).toBeInTheDocument()
    expect(screen.getByText('Breaking Bad')).toBeInTheDocument()
    expect(screen.getByText('The Godfather')).toBeInTheDocument()
  })

  it('displays correct ratings for reviews', () => {
    render(<ReviewList reviews={mockReviews} />)
    
    expect(screen.getByText('9/10')).toBeInTheDocument()
    expect(screen.getByText('8/10')).toBeInTheDocument()
    expect(screen.getByText('10/10')).toBeInTheDocument()
  })

  it('displays review content', () => {
    render(<ReviewList reviews={mockReviews} />)
    
    expect(screen.getByText(/amazing movie/i)).toBeInTheDocument()
    expect(screen.getByText(/great show/i)).toBeInTheDocument()
  })

  it('displays like and dislike counts', () => {
    render(<ReviewList reviews={mockReviews} />)
    
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders poster images', () => {
    render(<ReviewList reviews={mockReviews} />)
    
    const images = screen.getAllByRole('img')
    expect(images.length).toBeGreaterThan(0)
  })

  it('navigates to review detail on "Read full" click', async () => {
    const user = (await import('@testing-library/user-event')).default.setup()
    render(<ReviewList reviews={[mockReviews[0]]} />)
    
    const readFullButton = screen.getByText(/read full/i)
    await user.click(readFullButton)
    
    expect(mockNavigate).toHaveBeenCalledWith('/reviews/1')
  })
})
