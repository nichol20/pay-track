
import { Client, ClientRequest } from '@/types/client'
import styles from './style.module.scss'
import { Modal } from '../Modal'
import { InputField } from '../InputField'
import Image from 'next/image'
import { clientsIcon } from '@/assets/images'
import { useState } from 'react'
import { registerClient, updateClient } from '@/utils/api'

interface ClientFormProps {
    client?: Client
    close: () => void
    onSubmit?: () => void
}

const requiredFields = ["name", "email", "cpf", "phone"]

export const ClientForm = ({ client, close, onSubmit }: ClientFormProps) => {
    const [requiredFieldsMissing, setRequiredFieldsMissing] = useState<string[]>([])
    const [emailAlreadyExists, setEmailAlreadyExists] = useState(false)
    const [cpfAlreadyExists, setCpfAlreadyExists] = useState(false)

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

        const name = formData.get("name") as string
        const email = formData.get("email") as string
        const cpf = formData.get("cpf") as string
        const phone = formData.get("phone") as string
        const address = formData.get("address") as string
        const complement = formData.get("complement") as string
        const cep = formData.get("cep") as string
        const neighborhood = formData.get("neighborhood") as string
        const city = formData.get("city") as string
        const uf = formData.get("uf") as string

        const newClient: ClientRequest = {
            bairro: neighborhood,
            cep,
            cidade: city,
            complemento: complement,
            cpf,
            email,
            endereco: address,
            nome: name,
            telefone: phone,
            uf
        }

        try {
            if (client) {
                await updateClient(client.id, newClient)
                onSubmit && onSubmit()
                close()
                return
            }

            await registerClient(newClient)
            onSubmit && onSubmit()
            close()
        } catch (error: any) {
            if (error?.response?.data?.mensagem === "O e-mail já cadastrado") {
                setEmailAlreadyExists(true)
            }
            if (error?.response?.data?.mensagem === "O cpf já cadastrado") {
                setCpfAlreadyExists(true)
            }
        }
    }

    const getErrorMessage = (inputName: string): string => {
        if (inputName === "email" && emailAlreadyExists) {
            return "E-mail já cadastrado"
        }
        if (inputName === "cpf" && cpfAlreadyExists) {
            return "CPF já cadastrado"
        }
        if (requiredFieldsMissing.includes(inputName)) {
            return "Esse campo deve ser preenchido"
        }

        return ""
    }

    const handleInputChange = (inputName: string) => {
        // reset errors
        setRequiredFieldsMissing(prev => prev.filter(n => n !== inputName))

        if (inputName === "email") setEmailAlreadyExists(false)
        if (inputName === "cpf") setCpfAlreadyExists(false)
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
                    onChange={() => handleInputChange("name")}
                />
                <InputField
                    inputId='email'
                    title='E-mail*'
                    name="email"
                    type='email'
                    placeholder='Digite o E-mail'
                    defaultValue={client?.email}
                    errorMessage={getErrorMessage("email")}
                    onChange={() => handleInputChange("email")}
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
                        onChange={() => handleInputChange("cpf")}
                    />
                    <InputField
                        inputId='phone'
                        title='Telefone*'
                        name="phone"
                        type='text'
                        placeholder='Digite o Telefone'
                        defaultValue={client?.telefone}
                        errorMessage={getErrorMessage("phone")}
                        onChange={() => handleInputChange("phone")}
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