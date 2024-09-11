import styles from './style.module.scss'

interface CheckMarkProps {
    size: number
    thickness: number
    className?: string
}

export const CheckMark = ({ size, thickness, className }: CheckMarkProps) => {
    const style = {
        "--size": size + "px",
        "--thickness": thickness + "px",
    } as React.CSSProperties;

    return <div style={style} className={`${styles.checkMark} ${className}`}></div>
}