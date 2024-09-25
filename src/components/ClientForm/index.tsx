
import { Client, ClientRequest } from '@/types/client'
import styles from './style.module.scss'
import { Modal } from '../Modal'
import { InputField } from '../InputField'
import Image from 'next/image'
import { clientsIcon } from '@/assets/images'
import { useState } from 'react'
import { registerClient, updateClient } from '@/utils/api'
import { useToast } from '@/contexts/Toast'

interface ClientFormProps {
    client?: Client
    close: () => void
    onSubmit?: () => void
}

const requiredFields = ["name", "email", "cpf", "phone"]

export const ClientForm = ({ client, close, onSubmit }: ClientFormProps) => {
    const toast = useToast()
    const [formErrors, setFormErrors] = useState({
        missingFields: [] as string[],
        emailExists: false,
        cpfExists: false,
        invalidEmail: false
    })

    const validateForm = (formData: FormData) => {
        const missingFields = requiredFields.filter(field => !formData.get(field))
        if (missingFields.length > 0) {
            setFormErrors(prev => ({ ...prev, missingFields }))
            return false
        }

        return true
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)

        if (!validateForm(formData)) return

        const newClient: ClientRequest = {
            bairro: formData.get("neighborhood") as string,
            cep: formData.get("cep") as string,
            cidade: formData.get("city") as string,
            complemento: formData.get("complement") as string,
            cpf: formData.get("cpf") as string,
            email: formData.get("email") as string,
            endereco: formData.get("address") as string,
            nome: formData.get("name") as string,
            telefone: formData.get("phone") as string,
            uf: formData.get("uf") as string
        }

        try {
            if (client) {
                await updateClient(client.id, newClient)
                onSubmit && onSubmit()
                close()
                toast({ message: "Cliente alterado com sucesso!", status: "success" })
                return
            }

            await registerClient(newClient)
            onSubmit && onSubmit()
            close()
            toast({ message: "Cliente adicionado com sucesso!", status: "success" })
        } catch (error: any) {
            const message = error?.response?.data?.mensagem
            const emailExists = message === "O e-mail já cadastrado"
            const cpfExists = message === "CPF já cadastrado!"
            const invalidEmail = message === "Digite um e-mail válido"
            setFormErrors(prev => ({
                ...prev,
                emailExists,
                cpfExists,
                invalidEmail
            }))
            if (emailExists || cpfExists || invalidEmail) return
            const toastMessage = client ? "Falha na alteração do cliente!" : "Falha ao cadastrar cliente!"
            toast({ message: toastMessage, status: "error" })
        }
    }

    const getErrorMessage = (inputName: string): string => {
        const { missingFields, emailExists, cpfExists, invalidEmail } = formErrors

        if (inputName === "email") {
            if (emailExists) return "E-mail já cadastrado"
            if (invalidEmail) return "E-mail inválido"
        }
        if (inputName === "cpf" && cpfExists) return "CPF já cadastrado"
        if (missingFields.includes(inputName)) return "Esse campo deve ser preenchido"

        return ""
    }

    const resetError = (inputName: string) => {
        setFormErrors(prev => ({
            ...prev,
            missingFields: prev.missingFields.filter(field => field !== inputName),
            emailExists: inputName === "email" ? false : prev.emailExists,
            cpfExists: inputName === "cpf" ? false : prev.cpfExists,
            invalidEmail: inputName === "email" ? false : prev.invalidEmail
        }))
    }

    return (
        <Modal close={close}>
            <form className={styles.clientForm} onSubmit={handleSubmit}>
                <div className={styles.titleBox}>
                    <Image src={clientsIcon} alt="clients" />
                    {<span className={styles.title}>{client ? "Editar Cliente" : "Cadastro do Cliente"}</span>}
                </div>
                <InputField
                    inputId='name'
                    title='Nome*'
                    name="name"
                    type='text'
                    placeholder='Digite o Nome'
                    defaultValue={client?.nome}
                    errorMessage={getErrorMessage("name")}
                    onChange={() => resetError("name")}
                />
                <InputField
                    inputId='email'
                    title='E-mail*'
                    name="email"
                    type='email'
                    placeholder='Digite o E-mail'
                    defaultValue={client?.email}
                    errorMessage={getErrorMessage("email")}
                    onChange={() => resetError("email")}
                />
                <div className={styles.fieldGroup}>
                    <InputField
                        inputId='cpf'
                        title='CPF*'
                        name="cpf"
                        type='text'
                        placeholder='Digite o CPF'
                        defaultValue={client?.cpf}
                        errorMessage={getErrorMessage("cpf")}
                        onChange={() => resetError("cpf")}
                    />
                    <InputField
                        inputId='phone'
                        title='Telefone*'
                        name="phone"
                        type='text'
                        placeholder='Digite o Telefone'
                        defaultValue={client?.telefone}
                        errorMessage={getErrorMessage("phone")}
                        onChange={() => resetError("phone")}
                    />
                </div>
                <InputField
                    inputId='address'
                    title='Endereço'
                    name="address"
                    type='text'
                    placeholder='Digite o Endereço'
                    defaultValue={client?.endereco ? client?.endereco : undefined}
                />
                <InputField
                    inputId='complement'
                    title='Complemento'
                    name="complement"
                    type='text'
                    placeholder='Digite o Complemento'
                    defaultValue={client?.complemento ? client?.complemento : undefined}
                />
                <div className={styles.fieldGroup}>
                    <InputField
                        inputId='cep'
                        title='CEP'
                        name="cep"
                        type='text'
                        placeholder='Digite o CEP'
                        defaultValue={client?.cep ? client?.cep : undefined}
                    />
                    <InputField
                        inputId='neighborhood'
                        title='Bairro'
                        name="neighborhood"
                        type='text'
                        placeholder='Digite o Bairro'
                        defaultValue={client?.endereco ? client?.endereco : undefined}
                    />
                </div>
                <div className={styles.fieldGroup}>
                    <InputField
                        inputId='city'
                        title='Cidade'
                        name="city"
                        type='text'
                        placeholder='Digite a Cidade'
                        className={styles.cityField}
                        defaultValue={client?.cidade ? client?.cidade : undefined}
                    />
                    <InputField
                        inputId='uf'
                        title='UF'
                        name="uf"
                        type='text'
                        placeholder='Digite a UF'
                        className={styles.ufField}
                        defaultValue={client?.uf ? client?.uf : undefined}
                    />
                </div>
                <div className={styles.actions}>
                    <button className={styles.cancelBtn} onClick={close}>Cancelar</button>
                    <button className={styles.submitBtn}>Aplicar</button>
                </div>
            </form>

        </Modal>
    )
}