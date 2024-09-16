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