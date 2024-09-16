"use client"
import Link from 'next/link'
import Image from 'next/image'

import { clientsIcon, fileIcon, homeIcon } from '@/assets/images'

import styles from './style.module.scss'
import { usePathname } from 'next/navigation'

export const Aside = () => {
    const pathname = usePathname()

    const getLinkClass = (path: string) => {
        let className = styles.link
        if (path === "/") {
            className += pathname === path ? ` ${styles.active}` : ''
            return className
        }

        if (pathname.includes(path)) {
            className += ` ${styles.active}`
        }

        return className
    }

    return (
        <aside className={styles.aside}>
            <nav className={styles.navigationMenu}>
                <Link href="/" className={getLinkClass("/")}>
                    <Image src={homeIcon} alt="home" />
                    <span className={styles.linkName}>Home</span>
                </Link>
                <Link href="/clients" className={getLinkClass("/clients")}>
                    <Image src={clientsIcon} alt="clients" />
                    <span className={styles.linkName}>Clientes</span>
                </Link>
                <Link href="/charges" className={getLinkClass("/charges")}>
                    <Image src={fileIcon} alt="file" />
                    <span className={styles.linkName}>Cobranças</span>
                </Link>
            </nav>
        </aside>
    )
}