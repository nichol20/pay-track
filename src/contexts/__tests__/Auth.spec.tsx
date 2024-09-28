import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '../Auth'
import * as api from '@/utils/api'
import { SessionStorageKeys, setToCache, removeFromCache } from '@/utils/sessionStorage'
import { useRouter } from 'next/navigation'
import { act } from 'react'

jest.mock('@/utils/api')
jest.mock('@/utils/sessionStorage')
jest.mock('next/navigation', () => ({
    ...jest.requireActual('next/navigation'),
    useRouter: jest.fn(),
}))

const mockRouterPush = jest.fn()

const MockComponent = () => {
    const { user, login, logout } = useAuth()

    return (
        <div>
            <div>{user ? `User: ${user.email}` : 'No user logged in'}</div>
            <button onClick={() => login('test@example.com', 'password')}>Login</button>
            <button onClick={logout}>Logout</button>
        </div>
    )
}

// It keeps giving an 'act' warning, but I couldn't find a solution
describe('AuthProvider', () => {
    const mockUser = { id: 1, email: 'test@example.com' }
    const mockToken = 'mockToken';

    const mockApiLogin = api.login as jest.Mock
    const mockUseRouter = useRouter as jest.Mock

    beforeEach(() => {
        mockUseRouter.mockReturnValue({
            push: mockRouterPush,
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('renders loading state initially', () => {
        render(
            <AuthProvider>
                <div>Content</div>
            </AuthProvider>
        )
        expect(screen.getByText(/loading.../i)).toBeInTheDocument()
    })

    test('login sets the user and token, then redirects to home', async () => {
        mockApiLogin.mockResolvedValue({
            token: mockToken,
            user: mockUser,
        })

        await act(async () => render(
            <AuthProvider>
                <MockComponent />
            </AuthProvider>
        ))

        const loginBtn = screen.getByRole('button', { name: /login/i })
        fireEvent.click(loginBtn)

        await waitFor(() => {
            expect(screen.getByText(`User: ${mockUser.email}`)).toBeInTheDocument()
        })

        expect(setToCache).toHaveBeenCalledWith(SessionStorageKeys.TOKEN, mockToken)
        expect(setToCache).toHaveBeenCalledWith(SessionStorageKeys.USER_ID, mockUser.id)

        expect(mockRouterPush).toHaveBeenCalledWith('/')
    })

    test('logout clears the user and token, then redirects to login page', async () => {
        await act(async () => render(
            <AuthProvider>
                <MockComponent />
            </AuthProvider>
        ))

        const logoutBtn = screen.getByRole('button', { name: /logout/i })
        fireEvent.click(logoutBtn)

        expect(screen.getByText('No user logged in')).toBeInTheDocument()

        expect(removeFromCache).toHaveBeenCalledWith(SessionStorageKeys.TOKEN)

        expect(mockRouterPush).toHaveBeenCalledWith('/login')
    })
})
