import { User, UserDetails } from "@/types/user"
import { http } from "./http"
import { Charge, ChargesDashboard, ChargeStatus } from "@/types/charge"
import { Client, ClientDetails, ClientRequest, ClientsDashboard } from "@/types/client"

// ESSE BACKEND TA UMA BAGUNÇA

// ------------ USER ------------
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

interface UpdateUserResponse {
    mensagem: string
    user: User
}

interface UpdateUserArgs extends Omit<User, "id"> {
    senha: string
}

export const updateUser = async (newUser: UpdateUserArgs): Promise<UpdateUserResponse> => {
    const res = await http.put<UpdateUserResponse>("/updateUser", newUser)
    return res.data
}

// ------------ CLIENTS ------------

export const getClientsDashboard = async (): Promise<ClientsDashboard> => {
    const res = await http.get<ClientsDashboard>("/dashboardClients")
    return res.data
}

export const getClientDetails = async (id: number | string): Promise<ClientDetails> => {
    const res = await http.get<ClientDetails>(`/clientDetails/${id}`)
    return res.data
}

export interface RegisterClientResponse {
    mensagem: string,
    Cliente: Client
}

export const registerClient = async (client: ClientRequest): Promise<RegisterClientResponse> => {
    const res = await http.post<RegisterClientResponse>(`/registerClient`, client)
    return res.data
}

export interface UpdateClientResponse {
    mensagem: string,
    Cliente: Client
}

export const updateClient = async (id: number | string, client: ClientRequest): Promise<UpdateClientResponse> => {
    const res = await http.put<UpdateClientResponse>(`/updateClient/${id}`, client)
    return res.data
}

export const getClients = async () => {
    const res = await http.get<Client[]>("/consultClient")
    return res.data
}

// ------------ CHARGES  ------------

export const getChargesDashboard = async (): Promise<ChargesDashboard> => {
    const res = await http.get<ChargesDashboard>("/dashboardCharges")
    return res.data
}

export const getCharges = async (): Promise<Charge[]> => {
    const res = await http.get<Charge[]>(`/allCharges`)
    return res.data
}

export interface AddChargeArgs {
    cliente_id: number
    descricao: string
    data_venc: string
    valor: number
    status: ChargeStatus
}

export interface AddChargeResponse {
    mensagem: string
    cobranca: Charge[]
}

export const addCharge = async (charge: AddChargeArgs): Promise<AddChargeResponse> => {
    const res = await http.post<AddChargeResponse>(`/addCharge`, charge)
    return res.data
}

export interface UpdateChargeArgs {
    cliente_id: number
    id_cob: string
    descricao: string
    data_venc: string
    valor: number
    status: ChargeStatus
}

export interface UpdateChargeResponse {
    mensagem: string
    cobranca: {
        cliente_id: number
        id_cob: string
        valor: number
        data_registro: string
        data_venc: string
        status: ChargeStatus
        descricao: string
    }
}

export const updateCharge = async (charge: UpdateChargeArgs): Promise<UpdateChargeResponse> => {
    const res = await http.put<UpdateChargeResponse>(`/updateCharge`, charge)
    return res.data
}

export interface DeleteChargeResponse {
    mensagem: string
}

export const deleteCharge = async (id: string): Promise<DeleteChargeResponse> => {
    const res = await http.delete<DeleteChargeResponse>(`/deleteCharge/${id}`)
    return res.data
}