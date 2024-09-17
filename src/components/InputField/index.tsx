"use client"
import Image from 'next/image'
import { useState } from 'react'

import { eyeIcon, blockedEyeIcon } from '@/assets/images'

import styles from './style.module.scss'

interface InputFieldProps {
    title: string
    name: string
    type: React.HTMLInputTypeAttribute
    inputId: string
    className?: string
    required?: boolean
    placeholder?: string
    defaultValue?: string | number | readonly string[]
    prefix?: string
    min?: string | number
    step?: string | number
    onChange?: React.ChangeEventHandler<HTMLInputElement>
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
    onChange
}: InputFieldProps) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === "password"

    const getType = (): React.HTMLInputTypeAttribute => {
        if (isPassword) {
            return showPassword ? "text" : "password"
        }

        return type
    }

    return (
        <div className={`${styles.inputField} ${className}`}>
            <label htmlFor={inputId}>{title}</label>
            <div className={styles.inputBox}>
                {prefix && <span className={styles.prefix}>{prefix}</span>}
                <input
                    type={getType()}
                    name={name}
                    id={inputId}
                    placeholder={placeholder}
                    spellCheck={false}
                    defaultValue={defaultValue}
                    min={min}
                    step={step}
                    onChange={onChange}
                    required={required}
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
        </div>
    )
}

export {
    InputField,
}