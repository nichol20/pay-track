import { loginPageImg } from '@/assets/images'
import { ErrorMessage } from '@/components/ErrorMessage'
import { InputField } from '@/components/InputField'
import styles from '@/styles/Login.module.scss'
import Image from 'next/image'
import Link from 'next/link'

export default function Login() {
    return (
        <div className={styles.login}>
            <aside className={styles.aside}>
                <h1 className={styles.title}>Gerencie todos os pagamentos da sua empresa em um só lugar.</h1>
                <Image src={loginPageImg} alt="notebook" />
            </aside>
            <main className={styles.content}>
                <form className={styles.form}>
                    <h3 className={styles.formTitle}>Faça seu login!</h3>
                    <InputField
                        inputId='email'
                        title='e-mail'
                        name="email"
                        type='email'
                        placeholder='Digite seu e-mail'
                    />
                    <div className={styles.passwordField}>
                        <InputField
                            inputId='password'
                            title='password'
                            name="password"
                            type='password'
                            placeholder='Digite sua senha'
                        />
                        <Link href="#" className={styles.forgotPasswordLink}>Esqueceu a senha?</Link>
                    </div>
                    <ErrorMessage message='Senha ou email inválido' />
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