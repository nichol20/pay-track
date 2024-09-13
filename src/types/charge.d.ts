export type ChargeStatus = "Vencida" | "Pendente" | "Paga"

export interface Charge {
    cliente_nome: string
    id_cob: string
    valor: number
    data_venc: string
    status: ChargeStatus
    descricao: string
}