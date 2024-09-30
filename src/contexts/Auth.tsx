"use client"
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import * as api from '../utils/api'
import { User } from "../types/user";
import { http } from "../utils/http";
import { getFromCache, removeFromCache, SessionStorageKeys, setToCache } from "../utils/sessionStorage";

interface AuthContext {
    user: User | null
    token: string | null
    login: (email: string, password: string) => Promise<void>
    logout: () => void
    refreshUser: () => Promise<void>
}

interface AuthProviderProps {
    children: React.ReactNode
}

export const AuthContext = createContext({} as AuthContext)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    const login = async (email: string, password: string) => {
        const res = await api.login(email, password)
        setToCache(SessionStorageKeys.TOKEN, res.token)
        setToCache(SessionStorageKeys.USER_ID, res.user.id)
        setToken(res.token)
        setUser(res.user)
        router.push("/")
    }

    const logout = () => {
        removeFromCache(SessionStorageKeys.TOKEN)
        setUser(null)
        router.push("/login")
    }

    const refreshUser = async () => {
        try {
            const t = getFromCache<string>(SessionStorageKeys.TOKEN) ?? ""
            const userId = getFromCache<number>(SessionStorageKeys.USER_ID) ?? -1
            setToken(t)

            const res = await api.getUser(userId, t)
            setUser({
                id: userId,
                ...res.user
            })
        }
        catch (err) { }
        finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        refreshUser()
    }, [])

    useEffect(() => {
        const requestIntercept = http.interceptors.request.use(
            config => {
                if (!config.headers.Authorization) {
                    config.headers.Authorization = `Bearer ${token}`
                }
                return config
            }, (error) => Promise.reject(error)
        )

        const responseIntercept = http.interceptors.response.use(
            response => response,
            async error => {
                if (error?.response?.status === 403 || error?.response?.status === 401) {
                    router.push("/login")
                }
                return Promise.reject(error)
            }
        )

        return () => {
            http.interceptors.request.eject(requestIntercept)
            http.interceptors.response.eject(responseIntercept)
        }
    }, [token, router])

    if (isLoading) return <>Loading...</>

    return (
        <AuthContext.Provider value={{ user, token, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    )
}