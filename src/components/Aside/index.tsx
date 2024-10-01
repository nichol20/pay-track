"use client"
import Link from 'next/link'
import Image from 'next/image'

import { clientsIcon, fileIcon, homeIcon } from '@/assets/images'

import styles from './style.module.scss'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect } from 'react'

export const Aside = () => {
    const pathname = usePathname()

    const getLinkClass = (path: string) => {
        let className = styles.link

        if (isCurrentPath(path)) {
            className += ` ${styles.active}`
        }

        return className
    }

    const isCurrentPath = useCallback((path: string) => {
        if (path === "/") {
            return pathname === path
        }

        if (pathname.includes(path)) return true

        return false
    }, [pathname])

    useEffect(() => {
        const animateIndicator = () => {
            const indicatorEl = document.querySelector(`.${styles.indicator}`) as HTMLDivElement
            const transform = window.getComputedStyle(indicatorEl).transform

            let destination = 0

            if (isCurrentPath("/clients")) destination = 140
            if (isCurrentPath("/charges")) destination = 280

            if (transform !== 'none') {
                const matrixValues = transform.match(/matrix.*\((.+)\)/)
                if (matrixValues) {
                    const values = matrixValues[1].split(',')
                    const currentTranslateY = parseFloat(values[5])

                    const translateY60 = currentTranslateY > destination ? destination - 20 : destination + 20
                    const translateY80 = currentTranslateY > destination ? destination + 10 : destination - 10

                    indicatorEl.animate([
                        { transform: `translateY(${currentTranslateY}px)` },
                        { transform: `translateY(${translateY60}px)`, offset: 0.6 },
                        { transform: `translateY(${translateY80}px)`, offset: 0.8 },
                        { transform: `translateY(${destination}px)` },
                    ], {
                        duration: 600,
                        fill: "forwards",
                        easing: "cubic-bezier(0, 0, 0.58, 1)", // ease-out
                        iterations: 1,
                    })
                }
            }
        }

        animateIndicator()
    }, [isCurrentPath])

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
                <div className={styles.indicator}></div>
            </nav>
        </aside>
    )
}