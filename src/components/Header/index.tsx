"use client"
import { usePathname } from 'next/navigation'
import styles from './style.module.scss'
import Link from 'next/link'
import Image from 'next/image'
import { chevronDownIcon, exitIcon, pencilIcon } from '@/assets/images'
import { Modal } from '../Modal'
import { useState } from 'react'
import { InputField } from '../InputField'
import { ClosableElement } from '../ClosableElement'

export const Header = () => {
    const pathname = usePathname()
    const [showEditForm, setShowEditForm] = useState(false)
    const [showOptions, setShowOptions] = useState(false)

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
                <div className={styles.userImg}>LR</div>
                <span className={styles.userName}>Lorena</span>
                <div className={styles.optionsContainer}>
                    <button className={styles.showOptionsBtn} onClick={() => setShowOptions(true)}>
                        <Image src={chevronDownIcon} alt="chevron down" />
                    </button>
                    <ClosableElement isOpen={showOptions} close={() => setShowOptions(false)} className={styles.options}>
                        <button className={styles.editUserBtn} onClick={handleEditUserBtnClick}>
                            <Image src={pencilIcon} alt="pencil" />
                            <span>Editar</span>
                        </button>
                        <button className={styles.logoutBtn}>
                            <Image src={exitIcon} alt="exit" />
                            <span>Sair</span>
                        </button>
                    </ClosableElement>
                </div>
            </div>
            {showEditForm && <Modal close={() => setShowEditForm(false)}>
                <form className={styles.editForm}>
                    <span className={styles.formTitle}>Edite seu cadastro</span>
                    <InputField
                        inputId='name'
                        title='Nome*'
                        name="name"
                        type='text'
                        placeholder='Digite seu nome'
                        required
                    />
                    <InputField
                        inputId='email'
                        title='E-mail*'
                        name="email"
                        type='email'
                        placeholder='Digite seu e-mail'
                        required
                    />
                    <div className={styles.fieldGroup}>
                        <InputField
                            inputId='cpf'
                            title='CPF'
                            name="cpf"
                            type='text'
                            placeholder='Digite seu CPF'
                        />
                        <InputField
                            inputId='phone'
                            title='Telefone'
                            name="phone"
                            type='text'
                            placeholder='Digite seu Telefone'
                        />
                    </div>
                    <InputField
                        inputId='password'
                        title='Nova Senha'
                        name="password"
                        type='password'
                        placeholder='••••••••'
                        required
                    />
                    <InputField
                        inputId='confirmPassword'
                        title='Confirmar Senha*'
                        name="confirmPassword"
                        type='password'
                        placeholder='••••••••'
                        required
                    />
                    <button className={styles.submitBtn}>Aplicar</button>
                </form>
            </Modal>}
        </header>
    )
}