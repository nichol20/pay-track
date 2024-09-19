"use client"
import Image from 'next/image';

import { fileIcon, filterIcon } from '@/assets/images';
import { ChargeList } from '@/components/ChargeList';
import { SearchInput } from '@/components/SearchInput';
import { Charge } from '@/types/charge';

import styles from '@/styles/Charges.module.scss';
import { useEffect, useState } from 'react';
import { getCharges } from '@/utils/api';

export default function ChargesPage() {
    const [charges, setCharges] = useState<Charge[]>([])

    const fetchData = async () => {
        const data = await getCharges()
        setCharges(data)
    }

    useEffect(() => {
        fetchData()
    }, [])

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
                    <SearchInput onChange={() => { }} delay={400} />
                </div>
            </div>
            <ChargeList rows={charges} refresh={fetchData} />
        </div>
    )
}