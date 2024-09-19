"use client"
import Image from 'next/image'
import { CSSProperties, useState } from 'react'

import { TextareaField } from './TextareaField'
import { eyeIcon, blockedEyeIcon } from '@/assets/images'

import styles from './style.module.scss'
import { ErrorMessage } from '../ErrorMessage'

interface InputFieldProps {
    title: string
    name: string
    type: React.HTMLInputTypeAttribute
    inputId: string
    className?: string
    required?: boolean
    placeholder?: string
    defaultValue?: string | number | readonly string[] | null
    prefix?: string
    min?: string | number
    step?: string | number
    onChange?: React.ChangeEventHandler<HTMLInputElement>
    errorMessage?: string
    readOnly?: boolean
}

const InputField = ({
    title,
    name,
    type,
    inputId,
    className,
    required,
    placeholder,
    defaultValue,
    prefix,
    min,
    step,
    onChange,
    errorMessage = "",
    readOnly = false
}: InputFieldProps) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === "password"
    const inputBoxStyle: CSSProperties | undefined = errorMessage.length > 0 ? { borderColor: "#E70000" } : undefined

    const getType = (): React.HTMLInputTypeAttribute => {
        if (isPassword) {
            return showPassword ? "text" : "password"
        }

        return type
    }

    return (
        <div className={`${styles.inputField} ${className}`}>
            <label htmlFor={inputId}>{title}</label>
            <div className={styles.inputBox} style={inputBoxStyle}>
                {prefix && <span className={styles.prefix}>{prefix}</span>}
                <input
                    type={getType()}
                    name={name}
                    id={inputId}
                    placeholder={placeholder}
                    spellCheck={false}
                    defaultValue={defaultValue ?? undefined}
                    min={min}
                    step={step}
                    onChange={onChange}
                    required={required}
                    readOnly={readOnly}
                />
                {isPassword && (
                    <button
                        className={styles.showPasswordBtn}
                        onClick={() => setShowPassword(prev => !prev)}
                        type='button'
                    >
                        <Image
                            src={showPassword ? eyeIcon : blockedEyeIcon}
                            alt={showPassword ? "eye" : "blocked eye"}
                        />
                    </button>
                )}
            </div>
            <ErrorMessage message={errorMessage} />
        </div>
    )
}

export {
    InputField,
    TextareaField
}