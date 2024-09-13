import { ChargeStatus } from "@/types/charge";

export const translateChargeStatus = (status: ChargeStatus) => {
    if (status === "Paga") return "payed"
    else if (status === "Pendente") return "pending"
    else if (status === "Vencida") return "overdue"
    else return ""
}