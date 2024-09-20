import { ChargeStatus } from "@/types/charge";
import { Client, ClientStatus } from "@/types/client";

export const translateChargeStatus = (status: ChargeStatus) => {
    const s = status.toLocaleLowerCase()
    if (s === "paga") return "paid"
    else if (s === "pendente") return "pending"
    else if (s === "vencida") return "overdue"
    else return ""
}

export const translateClientStatus = (status: ClientStatus) => {
    const s = status.toLocaleLowerCase()
    if (s === "em dia") return "upToDate"
    else if (s === "inadimplente") return "defaulter"
    else return ""
}

export const translateClientProperty = (key: keyof Client) => {
    switch (key) {
        case "id":
        case "nome":
            return "name"
        case "cpf":
            return "cpf"
        case "email":
            return "email"
        case "telefone":
            return "phone"
        case "endereco":
            return "address"
        case "complemento":
            return "complement"
        case "cep":
            return "cep"
        case "bairro":
            return "neighborhood"
        case "cidade":
            return "city"
        case "uf":
            return "uf"
        case "status":
            return "status"
        case "usuario_id":
        default:
            return ""
    }
}