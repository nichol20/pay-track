import { render, screen, fireEvent, waitFor } from '@testing-library/react'

import { Header } from './index'
import { useAuth } from '@/contexts/Auth'
import { useToast } from '@/contexts/Toast'
import { updateUser } from '@/utils/api'
import { usePathname } from 'next/navigation'

// Mocking external dependencies
jest.mock('@/contexts/Auth')
jest.mock('@/contexts/Toast')
jest.mock('@/utils/api')
jest.mock('next/navigation', () => ({
    ...jest.requireActual('next/navigation'),
    usePathname: jest.fn(),
}))

describe('Header Component', () => {
    const mockUser = {
        nome: 'John Doe',
        email: 'john@example.com',
        cpf: '123.456.789-00',
        telefone: '555-5555'
    }

    const mockLogout = jest.fn()
    const mockRefreshUser = jest.fn()
    const mockToast = jest.fn()
    const mockUsePathname = usePathname as jest.Mock
    const mockUseAuth = useAuth as jest.Mock
    const mockUseToast = useToast as jest.Mock

    beforeEach(() => {
        mockUseAuth.mockReturnValue({
            user: mockUser,
            logout: mockLogout,
            refreshUser: mockRefreshUser
        })
        mockUseToast.mockReturnValue(mockToast)
        mockUsePathname.mockReturnValue('/clients')
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('renders user information correctly', () => {
        render(<Header />)

        const showOptionsBtn = screen.getByTestId("showOptionsBtn")
        fireEvent.click(showOptionsBtn)

        expect(screen.getByText(mockUser.nome)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /editar/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /sair/i })).toBeInTheDocument()
    })

    test('logs out the user when "Sair" button is clicked', () => {
        render(<Header />)

        const showOptionsBtn = screen.getByTestId("showOptionsBtn")
        fireEvent.click(showOptionsBtn)

        const logoutBtn = screen.getByRole('button', { name: /sair/i })
        fireEvent.click(logoutBtn)

        expect(mockLogout).toHaveBeenCalledTimes(1)
    })

    test('opens edit form when "Editar" button is clicked', () => {
        render(<Header />)

        const showOptionsBtn = screen.getByTestId("showOptionsBtn")
        fireEvent.click(showOptionsBtn)

        const editBtn = screen.getByRole('button', { name: /editar/i })
        fireEvent.click(editBtn)

        expect(screen.getByText('Edite seu cadastro')).toBeInTheDocument()
    })

    test('shows error if required fields are missing on form submission', async () => {
        render(<Header />)

        const showOptionsBtn = screen.getByTestId("showOptionsBtn")
        fireEvent.click(showOptionsBtn)

        const editBtn = screen.getByRole('button', { name: /editar/i })
        fireEvent.click(editBtn)

        const submitButton = screen.getByRole('button', { name: /aplicar/i })
        fireEvent.click(submitButton)


        await waitFor(() => {
            expect(screen.getAllByText('Esse campo deve ser preenchido'))
        })
    })

    test('submits form successfully with valid data', async () => {
        (updateUser as jest.Mock).mockResolvedValueOnce({})

        render(<Header />)
        const showOptionsBtn = screen.getByTestId("showOptionsBtn")
        fireEvent.click(showOptionsBtn)

        const editBtn = screen.getByRole('button', { name: /editar/i })
        fireEvent.click(editBtn)

        fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'Jane Doe' } })
        fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'jane@example.com' } })
        fireEvent.change(screen.getByLabelText(/nova senha/i), { target: { value: 'StrongPass@123' } })
        fireEvent.change(screen.getByLabelText(/confirmar senha/i), { target: { value: 'StrongPass@123' } })

        const submitButton = screen.getByRole('button', { name: /aplicar/i })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(mockToast).toHaveBeenCalledWith({
                message: 'Cadastro alterado com sucesso!',
                status: 'success',
            })
        })
        expect(mockRefreshUser).toHaveBeenCalledTimes(1)
    })

    test('handles API error responses correctly', async () => {
        (updateUser as jest.Mock).mockRejectedValueOnce({
            response: {
                data: { mensagem: 'E-mail já cadastrado!' }
            }
        })

        render(<Header />)

        const showOptionsBtn = screen.getByTestId("showOptionsBtn")
        fireEvent.click(showOptionsBtn)

        const editBtn = screen.getByRole('button', { name: /editar/i })
        fireEvent.click(editBtn)

        fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'Jane Doe' } })
        fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'jane@example.com' } })
        fireEvent.change(screen.getByLabelText(/nova senha/i), { target: { value: 'StrongPass@123' } })
        fireEvent.change(screen.getByLabelText(/confirmar senha/i), { target: { value: 'StrongPass@123' } })

        const submitButton = screen.getByRole('button', { name: /aplicar/i })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(mockToast).not.toHaveBeenCalled()
        })
        expect(screen.getByText('E-mail já cadastrado')).toBeInTheDocument()
    })
})
