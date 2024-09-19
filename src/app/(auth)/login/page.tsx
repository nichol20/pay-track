"use client"
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'

import { loginPageImg } from '@/assets/images'
import { ErrorMessage } from '@/components/ErrorMessage'
import { InputField } from '@/components/InputField'
import { useAuth } from '@/contexts/AuthContext'

import styles from '@/styles/Login.module.scss'

export default function Login() {
    const [invalidPasswordOrEmailError, setInvalidPasswordOrEmailError] = useState(false)
    const { login, user } = useAuth()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)

        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            await login(email, password)
        } catch (error: any) {
            console.log(error)
            if (error.response?.status === 404 || error.response?.status === 401) {
                setInvalidPasswordOrEmailError(true)
            }
        }
    }

    useEffect(() => {
        if (user) {
            redirect("/")
        }
    }, [user])

    return (
        <div className={styles.login}>
            <aside className={styles.aside}>
                <h1 className={styles.title}>Gerencie todos os pagamentos da sua empresa em um só lugar.</h1>
                <Image src={loginPageImg} alt="notebook" />
            </aside>
            <main className={styles.content}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <h2 className={styles.formTitle}>Faça seu login!</h2>
                    <InputField
                        inputId='email'
                        title='E-mail'
                        name="email"
                        type='email'
                        placeholder='Digite seu e-mail'
                        required
                    />
                    <div className={styles.passwordField}>
                        <InputField
                            inputId='password'
                            title='Senha'
                            name="password"
                            type='password'
                            placeholder='Digite sua senha'
                            required
                        />
                        <Link href="#" className={styles.forgotPasswordLink}>Esqueceu a senha?</Link>
                    </div>
                    {invalidPasswordOrEmailError && <ErrorMessage message='Senha ou email inválido' />}
                    <button type='submit' className={styles.submitBtn}>Entrar</button>
                </form>
                <span className={styles.registerMessage}>
                    {"Ainda não possui uma conta? "}
                    <Link href="/signup">Cadastre-se</Link>
                </span>
            </main>
        </div>
    )
}