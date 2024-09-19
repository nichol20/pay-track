"use client"
import Image from 'next/image'
import { useEffect, useState } from 'react'

import { ClientList } from '@/components/ClientList'
import { clientsIcon, filterIcon } from '@/assets/images'
import { SearchInput } from '@/components/SearchInput'
import { ClientForm } from '@/components/ClientForm'

import styles from '@/styles/Clients.module.scss'
import { getClients } from '@/utils/api'
import { Client } from '@/types/client'

export default function ClientsPage() {
    const [showAddClientForm, setShowAddClientForm] = useState(false)
    const [clients, setClients] = useState<Client[]>([])

    const fetchData = async () => {
        const data = await getClients()
        setClients(data)
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className={styles.clientsPage}>
            <div className={styles.header}>
                <div className={styles.titleBox}>
                    <Image src={clientsIcon} alt="clients" />
                    <h1>Clientes</h1>
                </div>
                <div className={styles.actions}>
                    <button className={styles.addClientBtn} onClick={() => setShowAddClientForm(true)}>+ Adicionar cliente</button>
                    <button className={styles.filterBtn}>
                        <Image src={filterIcon} alt="filter" />
                    </button>
                    <SearchInput onChange={() => { }} delay={400} />
                </div>
            </div>
            {showAddClientForm && <ClientForm close={() => setShowAddClientForm(false)} onSubmit={fetchData} />}
            <ClientList rows={clients} columns={["client", "addCharge", "cpf", "email", "phone", "status"]} />
        </div>
    )
}