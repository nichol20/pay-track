import { render, screen, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '../Auth'
import * as api from '@/utils/api'
import { SessionStorageKeys, setToCache, removeFromCache } from '@/utils/sessionStorage'
import { useRouter } from 'next/navigation'
import { act } from 'react'

jest.mock('@/utils/api')
jest.mock('@/utils/sessionStorage')
jest.mock('next/navigation', () => ({
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

describe('AuthProvider', () => {
    const mockUser = { id: 1, email: 'test@example.com' }
    const mockToken = 'mockToken';

    const mockApiLogin = api.login as jest.Mock

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({
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

        render(
            <AuthProvider>
                <MockComponent />
            </AuthProvider>
        )

        await act(async () => {
            screen.getByText('Login').click()
        })

        await waitFor(() => {
            expect(screen.getByText(`User: ${mockUser.email}`)).toBeInTheDocument()
        })

        expect(setToCache).toHaveBeenCalledWith(SessionStorageKeys.TOKEN, mockToken)
        expect(setToCache).toHaveBeenCalledWith(SessionStorageKeys.USER_ID, mockUser.id)

        expect(mockRouterPush).toHaveBeenCalledWith('/')
    })

    test('logout clears the user and token, then redirects to login page', async () => {
        render(
            <AuthProvider>
                <MockComponent />
            </AuthProvider>
        )

        await act(async () => {
            screen.getByText('Logout').click()
        })

        expect(screen.getByText('No user logged in')).toBeInTheDocument()

        expect(removeFromCache).toHaveBeenCalledWith(SessionStorageKeys.TOKEN)

        expect(mockRouterPush).toHaveBeenCalledWith('/login')
    })
})
