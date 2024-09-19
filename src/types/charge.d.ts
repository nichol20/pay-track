export type ChargeStatus = "Vencida" | "Pendente" | "Paga"

export interface Charge {
    id: number //client id
    nome: string // client name
    id_cob: string
    valor: number
    data_venc: string
    status: ChargeStatus
    descricao: string
}

export type ChargeDetails = Omit<Charge, "id">

export type ClientDetailsCharge = Omit<Charge, "id" | "cliente_nome">

export interface SimpleCharge {
    nome: string // client name
    id_cob: string
    valor: number
    status: ChargeStatus
}

export interface ChargesDashboardItem {
    charges: SimpleCharge[]
    total: number
    quantidade: number
}

export interface ChargesDashboard {
    Pendente: ChargesDashboardItem
    Paga: ChargesDashboardItem
    Vencida: ChargesDashboardItem
}