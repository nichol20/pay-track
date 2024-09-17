import { ChargeStatus } from "@/types/charge";
import { Client, ClientStatus } from "@/types/client";

export const translateChargeStatus = (status: ChargeStatus) => {
    if (status === "Paga") return "paid"
    else if (status === "Pendente") return "pending"
    else if (status === "Vencida") return "overdue"
    else return ""
}

export const translateClientStatus = (status: ClientStatus) => {
    if (status === "Em dia") return "upToDate"
    else if (status === "Inadimplente") return "defaulter"
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