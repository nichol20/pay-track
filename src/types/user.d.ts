export interface User {
    id: number
    nome: string
    email: string
    cpf: string | null
    telefone: string | null
}

export type UserDetails = Omit<User, "id">