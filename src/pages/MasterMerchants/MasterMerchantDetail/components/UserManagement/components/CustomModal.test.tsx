import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CustomModal from './CustomModal'

describe('CustomModal', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('visibility', () => {
    it('should not render when isOpen is false', () => {
      const { container } = render(
        <CustomModal isOpen={false} onClose={mockOnClose} title="Test Modal">
          <div>Modal Content</div>
        </CustomModal>
      )

      expect(container.firstChild).toBeNull()
    })

    it('should render when isOpen is true', () => {
      render(
        <CustomModal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <div>Modal Content</div>
        </CustomModal>
      )

      expect(screen.getByText('Test Modal')).toBeInTheDocument()
      expect(screen.getByText('Modal Content')).toBeInTheDocument()
    })
  })

  describe('content', () => {
    it('should render title', () => {
      render(
        <CustomModal isOpen={true} onClose={mockOnClose} title="Test Modal Title">
          <div>Content</div>
        </CustomModal>
      )

      expect(screen.getByText('Test Modal Title')).toBeInTheDocument()
    })

    it('should render children content', () => {
      render(
        <CustomModal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <div data-testid="custom-content">Custom Content</div>
        </CustomModal>
      )

      expect(screen.getByTestId('custom-content')).toBeInTheDocument()
      expect(screen.getByText('Custom Content')).toBeInTheDocument()
    })
  })

  describe('close behavior', () => {
    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <CustomModal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <div>Content</div>
        </CustomModal>
      )

      const closeButton = screen.getByRole('button')
      await user.click(closeButton)

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('should call onClose when backdrop is clicked', async () => {
      const user = userEvent.setup()
      render(
        <CustomModal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <div>Content</div>
        </CustomModal>
      )

      // Click on the backdrop (the outer div with backdrop)
      const backdrop = screen.getByText('Test Modal').parentElement?.parentElement?.parentElement
      if (backdrop) {
        await user.click(backdrop)
        expect(mockOnClose).toHaveBeenCalledTimes(1)
      }
    })

    it('should not call onClose when modal content is clicked', async () => {
      const user = userEvent.setup()
      render(
        <CustomModal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <div>Content</div>
        </CustomModal>
      )

      const content = screen.getByText('Content')
      await user.click(content)

      expect(mockOnClose).not.toHaveBeenCalled()
    })
  })

  describe('sizes', () => {
    it('should apply sm size class', () => {
      const { container } = render(
        <CustomModal isOpen={true} onClose={mockOnClose} title="Test Modal" size="sm">
          <div>Content</div>
        </CustomModal>
      )

      const modalPanel = container.querySelector('.max-w-md')
      expect(modalPanel).toBeInTheDocument()
    })

    it('should apply md size class', () => {
      const { container } = render(
        <CustomModal isOpen={true} onClose={mockOnClose} title="Test Modal" size="md">
          <div>Content</div>
        </CustomModal>
      )

      const modalPanel = container.querySelector('.max-w-lg')
      expect(modalPanel).toBeInTheDocument()
    })

    it('should apply lg size class by default', () => {
      const { container } = render(
        <CustomModal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <div>Content</div>
        </CustomModal>
      )

      const modalPanel = container.querySelector('.max-w-2xl')
      expect(modalPanel).toBeInTheDocument()
    })

    it('should apply xl size class', () => {
      const { container } = render(
        <CustomModal isOpen={true} onClose={mockOnClose} title="Test Modal" size="xl">
          <div>Content</div>
        </CustomModal>
      )

      const modalPanel = container.querySelector('.max-w-4xl')
      expect(modalPanel).toBeInTheDocument()
    })
  })

  describe('styling', () => {
    it('should have backdrop with blur', () => {
      const { container } = render(
        <CustomModal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <div>Content</div>
        </CustomModal>
      )

      const backdrop = container.querySelector('.backdrop-blur-sm')
      expect(backdrop).toBeInTheDocument()
    })

    it('should have header border', () => {
      const { container } = render(
        <CustomModal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <div>Content</div>
        </CustomModal>
      )

      const header = container.querySelector('.border-b')
      expect(header).toBeInTheDocument()
    })

    it('should have shadow on modal panel', () => {
      const { container } = render(
        <CustomModal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <div>Content</div>
        </CustomModal>
      )

      const panel = container.querySelector('.shadow-2xl')
      expect(panel).toBeInTheDocument()
    })
  })
})
