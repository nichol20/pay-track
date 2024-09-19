"use client"
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { chevronDownIcon, exitIcon, pencilIcon } from '@/assets/images'
import { Modal } from '../Modal'
import { InputField } from '../InputField'
import { ClosableElement } from '../ClosableElement'
import { useAuth } from '@/contexts/AuthContext'
import { nameToImageRepresentation } from '@/utils/user'

import styles from './style.module.scss'
import { updateUser } from '@/utils/api'

const requiredFields = ["name", "email", "password", "confirmationPassword"]

export const Header = () => {
    const pathname = usePathname()
    const [showEditForm, setShowEditForm] = useState(false)
    const [showOptions, setShowOptions] = useState(false)
    const [requiredFieldsMissing, setRequiredFieldsMissing] = useState<string[]>([])
    const [passwordConfirmationError, setPasswordConfimationError] = useState(false)
    const [emailAlreadyExists, setEmailAlreadyExists] = useState(false)
    const [cpfAlreadyExists, setCpfAlreadyExists] = useState(false)
    const [weakPasswordError, setWeakPasswordError] = useState(false)
    const { user, logout } = useAuth()

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
        const password = formData.get("password") as string
        const confirmationPassword = formData.get("confirmationPassword") as string

        if (password !== confirmationPassword) {
            setPasswordConfimationError(true)
            return
        }

        try {
            await updateUser({
                email,
                senha: password,
                nome: name,
                cpf,
                telefone: phone.length === 0 ? undefined : phone
            })
        } catch (error: any) {
            if (error?.response?.data?.mensagem === "E-mail já cadastrado!") {
                setEmailAlreadyExists(true)
            }
            if (error?.response?.data?.mensagem === "CPF já cadastrado!") {
                setCpfAlreadyExists(true)
            }
            if (error?.response?.data?.mensagem?.includes("Sua senha deverá conter")) {
                setWeakPasswordError(true)
            }
            console.log(error)
        }
    }

    const getErrorMessage = (inputName: string): string => {
        if (requiredFieldsMissing.includes(inputName)) {
            return "Esse campo deve ser preenchido"
        }

        if ((inputName === "password" || inputName === "confirmationPassword") && passwordConfirmationError) {
            return "As duas senhas precisam ser iguais"
        }

        if ((inputName === "password" || inputName === "confirmationPassword") && weakPasswordError) {
            return "Sua senha deverá conter no mínimo 8 caracteres sendo eles: 1 letra maiúscula, 1 número e 1 símbolo @,$,!,%,? ou &"
        }

        if (inputName === "email" && emailAlreadyExists) {
            return "E-mail já cadastrado"
        }
        if (inputName === "cpf" && cpfAlreadyExists) {
            return "CPF já cadastrado"
        }

        return ""
    }

    const handleInputChange = (inputName: string) => {
        // reset errors
        setRequiredFieldsMissing(prev => prev.filter(n => n !== inputName))
        if (inputName === "password" || inputName === "confirmationPassword") {
            setPasswordConfimationError(false)
            setWeakPasswordError(false)
        }
    }

    const renderPathElement = () => {
        let path = <></>
        if (pathname === "/clients") {
            path = <Link href="/clients" className={styles.pathLink}>Clientes</Link>
        }

        if (pathname.includes("/clients/")) {
            path = <>
                <Link href="/clients" className={styles.pathLink}>Clientes</Link>
                <span>{">"}</span>
                <span>Detalhes do cliente</span>
            </>
        }

        if (pathname === "/charges") {
            return <Link href="/charges" className={styles.pathLink}>Cobranças</Link>
        }

        return path
    }

    const handleEditUserBtnClick = () => {
        setShowOptions(false)
        setShowEditForm(true)
    }

    return (
        <header className={styles.header}>
            {pathname === "/"
                ? <h1 className={styles.title}>Resumo das cobranças</h1>
                : <div className={styles.path}>{renderPathElement()}</div>}

            <div className={styles.userInfo}>
                <div className={styles.userImg}>{user ? nameToImageRepresentation(user.nome) : ""}</div>
                <span className={styles.userName}>{user?.nome}</span>
                <div className={styles.optionsContainer}>
                    <button className={styles.showOptionsBtn} onClick={() => setShowOptions(true)}>
                        <Image src={chevronDownIcon} alt="chevron down" />
                    </button>
                    <ClosableElement isOpen={showOptions} close={() => setShowOptions(false)} className={styles.options}>
                        <button className={styles.editUserBtn} onClick={handleEditUserBtnClick}>
                            <Image src={pencilIcon} alt="pencil" />
                            <span>Editar</span>
                        </button>
                        <button className={styles.logoutBtn} onClick={logout}>
                            <Image src={exitIcon} alt="exit" />
                            <span>Sair</span>
                        </button>
                    </ClosableElement>
                </div>
            </div>
            {showEditForm && <Modal close={() => setShowEditForm(false)}>
                <form className={styles.editForm} onSubmit={handleSubmit}>
                    <span className={styles.formTitle}>Edite seu cadastro</span>
                    <InputField
                        inputId='name'
                        title='Nome*'
                        name="name"
                        type='text'
                        placeholder='Digite seu nome'
                        defaultValue={user?.nome}
                        errorMessage={getErrorMessage("name")}
                        onChange={() => handleInputChange("name")}
                    />
                    <InputField
                        inputId='email'
                        title='E-mail*'
                        name="email"
                        type='email'
                        placeholder='Digite seu e-mail'
                        defaultValue={user?.email}
                        errorMessage={getErrorMessage("email")}
                        onChange={() => handleInputChange("email")}
                    />
                    <div className={styles.fieldGroup}>
                        <InputField
                            inputId='cpf'
                            title='CPF'
                            name="cpf"
                            type='text'
                            placeholder='Digite seu CPF'
                            defaultValue={user?.cpf}
                        />
                        <InputField
                            inputId='phone'
                            title='Telefone'
                            name="phone"
                            type='text'
                            placeholder='Digite seu Telefone'
                            defaultValue={user?.telefone}
                        />
                    </div>
                    <InputField
                        inputId='password'
                        title='Nova Senha*'
                        name="password"
                        type='password'
                        placeholder='••••••••'
                        errorMessage={getErrorMessage("password")}
                        onChange={() => handleInputChange("password")}
                    />
                    <InputField
                        inputId='confirmationPassword'
                        title='Confirmar Senha*'
                        name="confirmationPassword"
                        type='password'
                        placeholder='••••••••'
                        errorMessage={getErrorMessage("confirmationPassword")}
                        onChange={() => handleInputChange("confirmationPassword")}
                    />
                    <button className={styles.submitBtn}>Aplicar</button>
                </form>
            </Modal>}
        </header>
    )
}