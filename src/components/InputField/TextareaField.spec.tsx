import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TextareaField } from './TextareaField'

describe('TextareaField Component', () => {
    const defaultProps = {
        textareaId: 'test-textarea',
        name: 'testName',
        title: 'Test Textarea',
    }

    test('renders the title label and textarea correctly', () => {
        render(<TextareaField {...defaultProps} />)

        const labelElement = screen.getByLabelText(defaultProps.title)
        expect(labelElement).toBeInTheDocument()

        const textareaElement = screen.getByRole('textbox')
        expect(textareaElement).toBeInTheDocument()
        expect(textareaElement).toHaveAttribute('id', defaultProps.textareaId)
        expect(textareaElement).toHaveAttribute('name', defaultProps.name)
    })

    test('renders with defaultValue and placeholder', () => {
        const props = {
            ...defaultProps,
            defaultValue: 'Default text',
            placeholder: 'Enter your text here',
        }
        render(<TextareaField {...props} />)

        const textareaElement = screen.getByRole('textbox')
        expect(textareaElement).toHaveValue(props.defaultValue)
        expect(textareaElement).toHaveAttribute('placeholder', props.placeholder)
    })

    test('renders the error message if provided', () => {
        const props = {
            ...defaultProps,
            errorMessage: 'This field is required',
        }
        render(<TextareaField {...props} />)

        const errorMessageElement = screen.getByText(props.errorMessage)
        expect(errorMessageElement).toBeInTheDocument()
    })

    test('triggers the onChange handler when input changes', () => {
        const handleChange = jest.fn()
        render(<TextareaField {...defaultProps} onChange={handleChange} />)

        const textareaElement = screen.getByRole('textbox')

        fireEvent.change(textareaElement, { target: { value: 'New input' } })

        expect(handleChange).toHaveBeenCalledTimes(1)
        expect(textareaElement).toHaveValue('New input')
    })
})
