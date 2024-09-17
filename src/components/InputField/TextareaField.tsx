import styles from './style.module.scss'

interface TextareaFieldProps {
    textareaId: string
    placeholder?: string
    defaultValue?: string | number | readonly string[]
    title: string
}

export const TextareaField = ({ textareaId, title, defaultValue, placeholder }: TextareaFieldProps) => {

    return (
        <div className={styles.inputField}>
            <label htmlFor={textareaId}>{title}</label>
            <div className={styles.inputBox}>
                <textarea
                    id={textareaId}
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                    spellCheck={false}
                />
            </div>
        </div>
    )
}