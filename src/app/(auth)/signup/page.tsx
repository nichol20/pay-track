"use client"
import { FormEvent, useState } from 'react'

import { CheckMark } from '@/components/CheckMark'
import { InputField } from '@/components/InputField'
import { signUp } from '@/utils/api'

import styles from '@/styles/SignUp.module.scss'

interface Step {
    title: string
    subtitle: string
}

const steps: Step[] = [
    {
        title: "Cadastre-se",
        subtitle: "Por favor, escreva seu nome e e-mail"
    },
    {
        title: "Escolha uma senha",
        subtitle: "Escolha uma senha segura"
    },
    {
        title: "Cadastro realizado com sucesso",
        subtitle: "E-mail e senha cadastrados com sucesso"
    },
]
const fadeAnimation = `${styles.fade} 250ms ease-in-out forwards`
const slideAnimation = `${styles.slide} 250ms ease-in-out both`

export default function SignUpPage() {
    const [currentStep, setCurrentStep] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)
    const [registeredSuccessfully, setRegisteredSuccessfully] = useState(false)
    const [passwordConfirmationError, setPasswordConfimationError] = useState(false)
    const [emailAlreadyExists, setEmailAlreadyExists] = useState(false)
    const [weakPasswordError, setWeakPasswordError] = useState(false)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget)
        const name = formData.get("name") as string
        const email = formData.get("email") as string
        const password = formData.get("password") as string
        const confirmationPassword = formData.get("confirmationPassword") as string

        if (password !== confirmationPassword) {
            setPasswordConfimationError(true)
            return
        }

        try {
            await signUp(name, email, password)
            updateStep(currentStep + 1)
            setRegisteredSuccessfully(true)
        } catch (error: any) {
            if (error?.response?.data?.mensagem === "Email já cadastrado") {
                setEmailAlreadyExists(true)
            }
            if (error?.response?.data?.mensagem?.includes("Sua senha deverá conter")) {
                setWeakPasswordError(true)
                return
            }
            updateStep(0)
        }
    }

    const getErrorMessage = (inputName: string): string => {
        if (passwordConfirmationError) {
            if (inputName === "password") {
                return "As duas senhas precisam ser iguais"
            }
            if (inputName === "confirmationPassword") {
                return " "
            }
        }

        if (weakPasswordError) {
            if (inputName === "password") {
                return "Sua senha deverá conter no mínimo 8 caracteres sendo eles: 1 letra maiúscula, 1 número e 1 símbolo @,$,!,%,? ou &"
            }
            if (inputName === "confirmationPassword") {
                return " "
            }
        }

        if (inputName === "email" && emailAlreadyExists) {
            return "E-mail já cadastrado"
        }

        return ""
    }

    const handleInputChange = (inputName: string) => {
        // reset errors
        if (inputName === "password" || inputName === "confirmationPassword") {
            setPasswordConfimationError(false)
            setWeakPasswordError(false)
        }
        if (inputName === "email") {
            setEmailAlreadyExists(false)
        }
    }

    const updateStep = (newStep: number) => {
        if (isAnimating) return
        setIsAnimating(true)

        setCurrentStep(newStep)
        const stepElements = document.querySelectorAll(`.${styles.formStep}`) as NodeListOf<HTMLDivElement>
        stepElements.forEach(el => {
            el.onanimationend = (event: AnimationEvent) => {
                const target = event.target as HTMLDivElement
                if (!target || !target.classList.contains(styles.formStep)) return
                target.classList.add("hide")
                stepElements[newStep].classList.remove("hide")
                setIsAnimating(false)
            }
        })

        stepElements[currentStep].style.animation = "none"
        stepElements[newStep].style.animation = "none"

        window.requestAnimationFrame(() => {
            if (newStep < currentStep) {
                stepElements[currentStep].style.animation = slideAnimation + " reverse"
                stepElements[newStep].style.animation = fadeAnimation + " reverse"
                return
            }
            stepElements[currentStep].style.animation = fadeAnimation
            stepElements[newStep].style.animation = slideAnimation
        })
    }

    const nextStep = () => {
        const stepElements = document.querySelectorAll(`.${styles.formStep}`) as NodeListOf<HTMLDivElement>
        const inputs = Array.from(stepElements[currentStep].querySelectorAll("input"))
        const allValid = inputs.every(input => input.reportValidity())
        if (allValid) {
            updateStep(currentStep + 1)
        }
    }

    const getInstructionStepClass = (index: number) => {
        let className = styles.instructionStep
        if (index + 1 === steps.length && registeredSuccessfully) {
            className += ` ${styles.done}`
        } else if (index === currentStep) {
            className += ` ${styles.current}`
        } else if (index < currentStep) {
            className += ` ${styles.done}`
        }
        return className
    }

    const renderInstructionStepCheckMark = (index: number) => {
        if (index < currentStep || (index + 1 === steps.length && registeredSuccessfully)) {
            return <CheckMark size={12} thickness={2} className={styles.checkMark} />
        }
        return <div className={styles.centerBall}></div>
    }

    return (
        <div className={styles.signUp}>
            <aside className={styles.aside}>
                <div className={styles.instructions}>
                    {steps.map((step, i) => (
                        <div key={i} className={getInstructionStepClass(i)}>
                            <div className={styles.progressComponent}>
                                <div className={styles.ball}>
                                    {renderInstructionStepCheckMark(i)}
                                </div>
                                <div className={styles.verticalLine}></div>
                            </div>
                            <div className={styles.description}>
                                <span className={styles.title}>{step.title}</span>
                                <span className={styles.subtitle}>{step.subtitle}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>
            <main className={styles.content}>
                <form onSubmit={handleSubmit} className={styles.signUpForm}>
                    <div className={`${styles.formStep}`}>
                        <h2 className={styles.stepTitle}>Adicione seus dados</h2>
                        <InputField
                            inputId='name'
                            title='Nome*'
                            name="name"
                            type='text'
                            placeholder='Digite seu nome'
                            required
                            errorMessage={getErrorMessage("name")}
                            onChange={() => handleInputChange("name")}
                        />
                        <InputField
                            inputId='email'
                            title='E-mail*'
                            name="email"
                            type='email'
                            placeholder='Digite seu e-mail'
                            required
                            errorMessage={getErrorMessage("email")}
                            onChange={() => handleInputChange("email")}
                        />
                        <button
                            type='button'
                            className={styles.nextBtn}
                            onClick={nextStep}
                        >Continuar</button>
                    </div>
                    <div className={`${styles.formStep} hide`}>
                        <h2 className={styles.stepTitle}>Escolha uma senha</h2>
                        <InputField
                            inputId='password'
                            title='Senha'
                            name="password"
                            type='password'
                            placeholder='••••••••'
                            required
                            errorMessage={getErrorMessage("password")}
                            onChange={() => handleInputChange("password")}
                        />
                        <InputField
                            inputId='confirmationPassword'
                            title='Repita a senha*'
                            name="confirmationPassword"
                            type='password'
                            placeholder='••••••••'
                            required
                            errorMessage={getErrorMessage("confirmationPassword")}
                            onChange={() => handleInputChange("confirmationPassword")}
                        />
                        <div className={styles.actions}>
                            <button
                                type='button'
                                className={styles.previousBtn}
                                onClick={() => updateStep(currentStep - 1)}
                            >Voltar</button>
                            <button type='submit' className={styles.submitBtn}>Enviar</button>
                        </div>
                    </div>
                    <div className={`${styles.formStep} hide`}>
                        <div className={styles.feedbackBox}>
                            <div className={`${styles.feedbackCheckMarkBox} ${!registeredSuccessfully ? styles.loading : ""}`}>
                                {registeredSuccessfully && <CheckMark size={56} thickness={4} className={styles.checkMark} />}
                            </div>
                            <span className={styles.feedbackMessage}>
                                {!registeredSuccessfully ? "Carregando..." : "Cadastro realizado com sucesso!"}
                            </span>
                        </div>
                        <a
                            href="/login"
                            className={`${styles.loginLink} ${!registeredSuccessfully ? styles.disable : ""}`}
                        >Ir para Login</a>
                    </div>
                </form>
                <div className={styles.carousel}>
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={`${styles.carouselItem} ${i === currentStep ? styles.active : ""}`}
                        ></div>
                    ))}
                </div>
            </main>
        </div>
    )
}