import { User, UserDetails } from "@/types/user"
import { http } from "./http"

export interface LoginResponse {
    user: User
    token: string
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    const res = await http.post<LoginResponse>('/login', { email, senha: password })
    return res.data
}

export interface SignUpResponse {
    mensagem: string
    usuario: {
        id: number,
        nome: string
        email: string
    }
}

export const signUp = async (name: string, email: string, password: string): Promise<SignUpResponse> => {
    const res = await http.post<SignUpResponse>('/signup', { nome: name, email, senha: password })
    return res.data
}

export interface GetUserResponse {
    user: UserDetails
}

export const getUser = async (id: number, token: string): Promise<GetUserResponse> => {
    const res = await http.get<GetUserResponse>(`/userDetails/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}