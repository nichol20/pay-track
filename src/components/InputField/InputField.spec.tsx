import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { InputField } from './index'

describe('InputField Component', () => {
    const defaultProps = {
        title: 'Password',
        name: 'password',
        type: 'password',
        inputId: 'password-input',
        placeholder: 'Enter password',
        errorMessage: ''
    }

    test('renders the input field with the correct label and placeholder', () => {
        render(<InputField {...defaultProps} />)

        const label = screen.getByLabelText(defaultProps.title)
        const input = screen.getByPlaceholderText(defaultProps.placeholder)

        expect(label).toBeInTheDocument()
        expect(input).toBeInTheDocument()
        expect(input).toHaveAttribute('type', 'password')
    })

    test('toggles password visibility when eye icon is clicked', () => {
        render(<InputField {...defaultProps} />)

        const button = screen.getByRole('button')
        const input = screen.getByLabelText(defaultProps.title)

        // Initial state: password should be hidden
        expect(input).toHaveAttribute('type', 'password')
        fireEvent.click(button)

        // After click: password should be visible
        expect(input).toHaveAttribute('type', 'text')
        fireEvent.click(button)

        // After second click: password should be hidden again
        expect(input).toHaveAttribute('type', 'password')
    })

    test('displays the error message if provided', () => {
        const errorMessage = 'This field is required'
        render(<InputField {...defaultProps} errorMessage={errorMessage} />)

        const errorElement = screen.getByText(errorMessage)
        expect(errorElement).toBeInTheDocument()
        expect(errorElement).toHaveClass('errorMessage')
    })

    test('calls onChange when the input value changes', () => {
        const handleChange = jest.fn()
        render(<InputField {...defaultProps} onChange={handleChange} />)

        const input = screen.getByLabelText(defaultProps.title)
        fireEvent.change(input, { target: { value: 'new-password' } })

        expect(handleChange).toHaveBeenCalledTimes(1)
    })

    test('renders the prefix if provided', () => {
        render(<InputField {...defaultProps} prefix="$" />)

        const prefixElement = screen.getByText('$')
        expect(prefixElement).toBeInTheDocument()
    })
})
