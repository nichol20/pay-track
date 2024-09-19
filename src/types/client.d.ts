import { ClientDetailsCharge } from "./charge"

export type ClientStatus = "Em dia" | "Inadimplente"

export interface Client {
    id: number
    nome: string
    cpf: string
    email: string
    telefone: string
    endereco: string | null
    complemento: string | null
    cep: string | null
    bairro: string | null
    cidade: string | null
    uf: string | null
    status: ClientStatus
    usuario_id: number
}

export type ClientWithoutId = Omit<Client, "id">

export interface SearchedClient {
    id: number
    nome: string
    cpf: string
    email: string
    telefone: string
    status: ClientStatus
}

export interface ClientRequest {
    nome: string
    cpf: string
    email: string
    telefone: string
    endereco?: string | null
    complemento?: string | null
    cep?: string | null
    bairro?: string | null
    cidade?: string | null
    uf?: string | null
}

export interface ClientDetails {
    client: Omit<Client, "id">
    charges: ClientDetailsCharge[]
}

export interface SimpleClient {
    id: number
    nome: string
    cpf: string
}

export interface ClientsDashboardItem {
    clientes: SimpleClient[]
    quantidade: number
}
export interface ClientsDashboard {
    clientesEmdia: ClientsDashboardItem
    clientesInadimplentes: ClientsDashboardItem
}