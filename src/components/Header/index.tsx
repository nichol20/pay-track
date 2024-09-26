"use client"
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { chevronDownIcon, exitIcon, pencilIcon } from '@/assets/images'
import { Modal } from '../Modal'
import { InputField } from '../InputField'
import { ClosableElement } from '../ClosableElement'
import { useAuth } from '@/contexts/Auth'
import { nameToImageRepresentation } from '@/utils/user'
import { updateUser } from '@/utils/api'
import { useToast } from '@/contexts/Toast'

import styles from './style.module.scss'

const requiredFields = ["name", "email", "password", "confirmationPassword"]

export const Header = () => {
    const pathname = usePathname()
    const [showEditForm, setShowEditForm] = useState(false)
    const [showOptions, setShowOptions] = useState(false)
    const [formErrors, setFormErrors] = useState({
        missingFields: [] as string[],
        passwordMismatch: false,
        emailExists: false,
        cpfExists: false,
        weakPassword: false,
        invalidEmail: false
    })

    const { user, logout, refreshUser } = useAuth()
    const toast = useToast()

    const validateForm = (formData: FormData) => {
        const missingFields = requiredFields.filter(field => !formData.get(field))
        if (missingFields.length > 0) {
            setFormErrors(prev => ({ ...prev, missingFields }))
            return false
        }

        const password = formData.get("password") as string
        const confirmationPassword = formData.get("confirmationPassword") as string
        if (password !== confirmationPassword) {
            setFormErrors(prev => ({ ...prev, passwordMismatch: true }))
            return false
        }

        return true
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        if (!validateForm(formData)) return

        try {
            await updateUser({
                email: formData.get("email") as string,
                senha: formData.get("password") as string,
                nome: formData.get("name") as string,
                cpf: formData.get("cpf")?.toString() || undefined,
                telefone: formData.get("phone")?.toString() || undefined,
            })
            toast({ message: "Cadastro alterado com sucesso!", status: "success" })
            setShowEditForm(false)
            refreshUser()
        } catch (error: any) {
            const message = error?.response?.data?.mensagem

            const emailExists = message === "E-mail já cadastrado!"
            const cpfExists = message === "CPF já cadastrado!"
            const invalidEmail = message === "Digite um e-mail válido"
            const weakPassword = message?.includes("Sua senha deverá conter")
            setFormErrors(prev => ({
                ...prev,
                emailExists,
                cpfExists,
                weakPassword,
                invalidEmail
            }))
            if (emailExists || cpfExists || invalidEmail || weakPassword) return
            toast({ message: "Falha na alteração de cadastro!", status: "error" })
        }
    }

    const getErrorMessage = (inputName: string): string => {
        const { missingFields, passwordMismatch, emailExists, cpfExists, weakPassword, invalidEmail } = formErrors

        if (missingFields.includes(inputName)) return "Esse campo deve ser preenchido"
        if (passwordMismatch) {
            if (inputName === "password") return "As duas senhas precisam ser iguais"
            if (inputName === "confirmationPassword") return " "
        }
        if (weakPassword && inputName === "password") {
            return "Sua senha deverá conter no mínimo 8 caracteres sendo eles: 1 letra maiúscula, 1 número e 1 símbolo @,$,!,%,? ou &"
        }
        if (inputName === "email") {
            if (emailExists) return "E-mail já cadastrado"
            if (invalidEmail) return "E-mail inválido"
        }
        if (cpfExists && inputName === "cpf") return "CPF já cadastrado"

        return ""
    }

    const resetError = (inputName: string) => {
        setFormErrors(prev => ({
            ...prev,
            missingFields: prev.missingFields.filter(field => field !== inputName),
            passwordMismatch: inputName === "password" || inputName === "confirmationPassword" ? false : prev.passwordMismatch,
            emailExists: inputName === "email" ? false : prev.emailExists,
            cpfExists: inputName === "cpf" ? false : prev.cpfExists,
            weakPassword: inputName === "password" ? false : prev.weakPassword,
            invalidEmail: inputName === "email" ? false : prev.invalidEmail
        }))
    }

    const renderPathElement = () => {
        if (pathname === "/clients") {
            return <Link href="/clients" className={styles.pathLink}>Clientes</Link>
        }
        if (pathname.includes("/clients/")) {
            return (
                <>
                    <Link href="/clients" className={styles.pathLink}>Clientes</Link>
                    <span>{">"}</span>
                    <span>Detalhes do cliente</span>
                </>
            )
        }
        if (pathname === "/charges") {
            return <Link href="/charges" className={styles.pathLink}>Cobranças</Link>
        }
        return null
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
                    <button className={styles.showOptionsBtn} data-testid="showOptionsBtn" onClick={() => setShowOptions(!showOptions)}>
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
            {showEditForm && (
                <Modal close={() => setShowEditForm(false)}>
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
                            onChange={() => resetError("name")}
                        />
                        <InputField
                            inputId='email'
                            title='E-mail*'
                            name="email"
                            type='email'
                            placeholder='Digite seu e-mail'
                            defaultValue={user?.email}
                            errorMessage={getErrorMessage("email")}
                            onChange={() => resetError("email")}
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
                            onChange={() => resetError("password")}
                        />
                        <InputField
                            inputId='confirmationPassword'
                            title='Confirmar Senha*'
                            name="confirmationPassword"
                            type='password'
                            placeholder='••••••••'
                            errorMessage={getErrorMessage("confirmationPassword")}
                            onChange={() => resetError("confirmationPassword")}
                        />
                        <button className={styles.submitBtn}>Aplicar</button>
                    </form>
                </Modal>
            )}
        </header>
    )
}
