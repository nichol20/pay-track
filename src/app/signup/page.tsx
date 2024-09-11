"use client"
import { CheckMark } from '@/components/CheckMark'
import { InputField } from '@/components/InputField'
import styles from '@/styles/SignUp.module.scss'
import { FormEvent, useState } from 'react'

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
    const [isLoadingResult, setIsLoadingResult] = useState(true)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        updateStep(currentStep + 1)
        setIsLoadingResult(true)
        await new Promise(resolve => setTimeout(resolve, 4000))
        setIsLoadingResult(false)
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
        if (index + 1 === steps.length && !isLoadingResult) {
            className += ` ${styles.done}`
        } else if (index === currentStep) {
            className += ` ${styles.current}`
        } else if (index < currentStep) {
            className += ` ${styles.done}`
        }
        return className
    }

    const renderInstructionStepCheckMark = (index: number) => {
        if (index < currentStep || (index + 1 === steps.length && !isLoadingResult)) {
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
                        />
                        <InputField
                            inputId='email'
                            title='E-mail*'
                            name="email"
                            type='email'
                            placeholder='Digite seu e-mail'
                            required
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
                        />
                        <InputField
                            inputId='confirmPassword'
                            title='Repita a senha*'
                            name="confirmPassword"
                            type='password'
                            placeholder='••••••••'
                            required
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
                            <div className={`${styles.feedbackCheckMarkBox} ${isLoadingResult ? styles.loading : ""}`}>
                                {!isLoadingResult && <CheckMark size={56} thickness={4} className={styles.checkMark} />}
                            </div>
                            <span className={styles.feedbackMessage}>
                                {isLoadingResult ? "Carregando..." : "Cadastro realizado com sucesso!"}
                            </span>
                        </div>
                        <a
                            href="/login"
                            className={`${styles.loginLink} ${isLoadingResult ? styles.disable : ""}`}
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