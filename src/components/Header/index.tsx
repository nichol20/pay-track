import styles from './style.module.scss'

export const Header = () => {
    return (
        <header className={styles.header}>
            <h1 className={styles.title}>Resumo das cobranças</h1>

            <div className={styles.userInfo}>
                <div className={styles.userImg}>LR</div>
                <span className={styles.userName}>Lorena</span>
                <div className={styles.options}></div>
            </div>
        </header>
    )
}