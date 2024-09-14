import { ChargeStatus } from "@/types/charge";
import { ClientStatus } from "@/types/client";

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