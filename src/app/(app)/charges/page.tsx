"use client"
import Image from 'next/image';

import { fileIcon, filterIcon } from '@/assets/images';
import { ChargeList } from '@/components/ChargeList';
import { SearchInput } from '@/components/SearchInput';
import { Charge } from '@/types/charge';

import styles from '@/styles/Charges.module.scss';
import { useCallback, useEffect, useState } from 'react';
import { getCharges, searchCharge } from '@/utils/api';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function ChargesPage() {
    const [charges, setCharges] = useState<Charge[]>([])
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const searchQuery = searchParams.get('q') || ""
    const router = useRouter()

    const fetchData = async () => {
        const data = await getCharges()
        setCharges(data)
    }

    const handleSearch = useCallback(async (query: string) => {
        const params = new URLSearchParams(searchParams.toString())

        const searchRes = await searchCharge(query)
        setCharges(searchRes)
        params.set("q", query)
        if (!query) {
            params.delete("q")
        }
        router.replace(`${pathname}?${params.toString()}`)
    }, [pathname, router, searchParams])

    useEffect(() => {
        if (searchQuery) {
            handleSearch(searchQuery)
        } else {
            fetchData()
        }
    }, [searchQuery, handleSearch])

    return (
        <div className={styles.chargesPage}>
            <div className={styles.header}>
                <div className={styles.titleBox}>
                    <Image src={fileIcon} alt="file" />
                    <h1>Cobranças</h1>
                </div>
                <div className={styles.actions}>
                    <button className={styles.filterBtn}>
                        <Image src={filterIcon} alt="filter" />
                    </button>
                    <SearchInput onChange={handleSearch} defaultValue={searchQuery} delay={400} />
                </div>
            </div>
            <ChargeList rows={charges} refresh={fetchData} />
        </div>
    )
}