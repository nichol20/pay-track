import { render, screen, fireEvent } from '@testing-library/react'
import { ClosableElement } from './index'

describe('ClosableElement Component', () => {
    const mockClose = jest.fn()

    const TestContent = () => (
        <div>Test Content</div>
    )

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('renders children when isOpen is true', () => {
        render(
            <ClosableElement isOpen={true} close={mockClose}>
                <TestContent />
            </ClosableElement>
        )

        const content = screen.getByText('Test Content')
        expect(content).toBeInTheDocument()
    })

    test('does not render children when isOpen is false', () => {
        render(
            <ClosableElement isOpen={false} close={mockClose}>
                <TestContent />
            </ClosableElement>
        )

        const content = screen.queryByText('Test Content')
        expect(content).not.toBeInTheDocument()
    })

    test('calls close when clicking outside of the element', () => {
        render(
            <div>
                <div data-testid="outside-element">Outside</div>
                <ClosableElement isOpen={true} close={mockClose}>
                    <TestContent />
                </ClosableElement>
            </div>
        )

        const outsideElement = screen.getByTestId('outside-element')
        fireEvent.mouseDown(outsideElement)

        expect(mockClose).toHaveBeenCalled()
    })

    test('does not call close when clicking inside the element', () => {
        render(
            <ClosableElement isOpen={true} close={mockClose}>
                <TestContent />
            </ClosableElement>
        )

        const content = screen.getByText('Test Content')
        fireEvent.mouseDown(content)

        expect(mockClose).not.toHaveBeenCalled()
    })

    test('applies custom class name if provided', () => {
        const customClass = 'custom-class'
        render(
            <ClosableElement isOpen={true} close={mockClose} className={customClass}>
                <TestContent />
            </ClosableElement>
        )

        const wrapper = screen.getByText('Test Content').parentElement
        expect(wrapper).toHaveClass(customClass)
    })
})
