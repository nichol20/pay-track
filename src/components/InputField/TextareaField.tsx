import { CSSProperties } from 'react'
import styles from './style.module.scss'
import { ErrorMessage } from '../ErrorMessage'

interface TextareaFieldProps {
    textareaId: string
    name: string
    placeholder?: string
    defaultValue?: string | number | readonly string[]
    title: string
    errorMessage?: string
    onChange?: React.ChangeEventHandler<HTMLTextAreaElement>
}

export const TextareaField = ({
    textareaId,
    name,
    title,
    defaultValue = "",
    placeholder,
    errorMessage = "",
    onChange
}: TextareaFieldProps) => {
    const inputBoxStyle: CSSProperties | undefined = errorMessage.length > 0 ? { borderColor: "#E70000" } : undefined

    return (
        <div className={styles.inputField}>
            <label htmlFor={textareaId}>{title}</label>
            <div className={styles.inputBox} style={inputBoxStyle}>
                <textarea
                    id={textareaId}
                    name={name}
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                    spellCheck={false}
                    onChange={onChange}
                />
            </div>
            <ErrorMessage message={errorMessage} />
        </div>
    )
}