
import Link from 'next/link'
import styles from './style.module.scss'
import Image from 'next/image'
import { clientsIcon, fileIcon, homeIcon } from '@/assets/images'

export const Aside = () => {
    return (
        <aside className={styles.aside}>
            <nav className={styles.navigationMenu}>
                <Link href="/" className={`${styles.link} ${styles.active}`}>
                    <Image src={homeIcon} alt="home" />
                    <span className={styles.linkName}>Home</span>
                </Link>
                <Link href="/clients" className={styles.link}>
                    <Image src={clientsIcon} alt="clients" />
                    <span className={styles.linkName}>Clientes</span>
                </Link>
                <Link href="/charges" className={styles.link}>
                    <Image src={fileIcon} alt="file" />
                    <span className={styles.linkName}>Cobranças</span>
                </Link>
            </nav>
        </aside>
    )
}