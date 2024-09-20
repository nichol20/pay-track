"use client"
import { Charge } from '@/types/charge'
import { Modal } from '../Modal'

import styles from './style.module.scss'
import { InputField, TextareaField } from '../InputField'
import { centsToReal, realToCents } from '@/utils/money'
import { CheckMark } from '../CheckMark'
import Image from 'next/image'
import { fileIcon } from '@/assets/images'
import { useState } from 'react'
import { addCharge, updateCharge } from '@/utils/api'
import { formatToInputDate } from '@/utils/date'
import { useToast } from '@/contexts/Toast'

interface ChargeFormProps {
    client: {
        id: number
        name: string
    }
    charge?: Charge | null
    onSubmit?: () => void
    close: () => void
}

const requiredFields = ["description", "date"]

export const ChargeForm = ({ client, charge, close, onSubmit }: ChargeFormProps) => {
    const [requiredFieldsMissing, setRequiredFieldsMissing] = useState<string[]>([])
    const toast = useToast()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        const fieldsMissing: string[] = []
        requiredFields.forEach(fieldName => {
            const field = formData.get(fieldName) as string
            if (field.length === 0) {
                fieldsMissing.push(fieldName)
            }
        })
        if (fieldsMissing.length > 0) {
            setRequiredFieldsMissing(fieldsMissing)
            return
        }

        const description = formData.get("description") as string
        const date = formData.get("date") as string
        const value = formData.get("value") as string
        const status = formData.get("status") as string

        try {
            if (charge) {
                await updateCharge({
                    cliente_id: client.id,
                    data_venc: date,
                    descricao: description,
                    id_cob: charge.id_cob,
                    status: status === "paid" ? "Paga" : "Pendente",
                    valor: realToCents(value)
                })
                onSubmit && onSubmit()
                close()
                toast({ message: "Cobrança alterada com sucesso!", status: "success" })
                return
            }

            await addCharge({
                cliente_id: client.id,
                data_venc: date,
                descricao: description,
                status: status === "paid" ? "Paga" : "Pendente",
                valor: realToCents(value)
            })
            onSubmit && onSubmit()
            close()
            toast({ message: "Cobrança adicionada com sucesso!", status: "success" })
        } catch (error: any) {
            const toastMessage = charge ? "Falha na alteração da cobrança!" : "Falha na criação da cobrança!"
            toast({ message: toastMessage, status: "error" })
        }
    }

    const getErrorMessage = (inputName: string): string => {
        if (requiredFieldsMissing.includes(inputName)) {
            return "Esse campo deve ser preenchido"
        }

        return ""
    }

    const handleInputChange = (inputName: string) => {
        // reset errors
        setRequiredFieldsMissing(prev => prev.filter(n => n !== inputName))
    }

    const handleMoneyInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const currentValue = event.target.value
        if (currentValue.split(".")[1]?.length > 2) {
            event.target.value = parseFloat(currentValue).toFixed(2)
        }
    }

    return (
        <Modal close={close}>
            <form className={styles.chargeForm} onSubmit={handleSubmit}>
                <div className={styles.titleBox}>
                    <Image src={fileIcon} alt="file" />
                    {<span className={styles.title}>{charge ? "Edição de Cobrança" : "Cadastro de Cobrança"}</span>}
                </div>
                <InputField
                    inputId='name'
                    title='Nome'
                    name="name"
                    type='text'
                    placeholder='Digite o Nome'
                    defaultValue={client.name}
                    readOnly
                />

                <TextareaField
                    textareaId="description"
                    name='description'
                    title='Descrição*'
                    placeholder='Digite a descrição'
                    defaultValue={charge?.descricao}
                    errorMessage={getErrorMessage("description")}
                    onChange={() => handleInputChange("description")}
                />
                <div className={styles.fieldGroup}>
                    <InputField
                        inputId='date'
                        title='Vencimento*'
                        name="date"
                        type='date'
                        placeholder='Data de Vencimento'
                        defaultValue={charge ? formatToInputDate(charge.data_venc) : undefined}
                        errorMessage={getErrorMessage("date")}
                        onChange={() => handleInputChange("date")}
                    />
                    <InputField
                        inputId='value'
                        title='Valor*'
                        name="value"
                        type='number'
                        min='0.01'
                        step='0.01'
                        defaultValue={charge ? centsToReal(charge.valor, false) : 1.00}
                        prefix='R$'
                        onChange={handleMoneyInputChange}
                    />
                </div>
                <div className={styles.radioInput}>
                    <span className={styles.title}>Status*</span>
                    <label className={styles.paidLabel}>
                        <div className={styles.checkMarkBox}>
                            <CheckMark size={12} thickness={2} className={styles.checkMark} />
                        </div>
                        Cobrança Paga
                        <input
                            type="radio"
                            name="status"
                            value="paid"
                            defaultChecked={charge ? charge.status === "Paga" : true}
                        />
                    </label>
                    <label className={styles.pendingLabel}>
                        <div className={styles.checkMarkBox}>
                            <CheckMark size={12} thickness={2} className={styles.checkMark} />
                        </div>
                        Cobrança Pendente
                        <input
                            type="radio"
                            name="status"
                            value="pending"
                            defaultChecked={charge?.status === "Pendente"}
                        />
                    </label>
                </div>
                <div className={styles.actions}>
                    <button className={styles.cancelBtn} onClick={close}>Cancelar</button>
                    <button className={styles.submitBtn}>Aplicar</button>
                </div>
            </form>
        </Modal>
    )
}