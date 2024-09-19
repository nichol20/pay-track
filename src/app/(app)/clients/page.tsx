"use client"
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

import { ClientList } from '@/components/ClientList'
import { clientsIcon, filterIcon } from '@/assets/images'
import { SearchInput } from '@/components/SearchInput'
import { ClientForm } from '@/components/ClientForm'

import styles from '@/styles/Clients.module.scss'
import { getClients, searchClient } from '@/utils/api'
import { Client, SearchedClient } from '@/types/client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function ClientsPage() {
    const [showAddClientForm, setShowAddClientForm] = useState(false)
    const [clients, setClients] = useState<Client[] | SearchedClient[]>([])
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const searchQuery = searchParams.get('q') || ""
    const router = useRouter()

    const fetchData = async () => {
        const data = await getClients()
        setClients(data)
    }

    const handleSearch = useCallback(async (query: string) => {
        const params = new URLSearchParams(searchParams.toString())

        const searchRes = await searchClient({ searchTerm: query })
        setClients(searchRes)
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
                    <SearchInput onChange={handleSearch} defaultValue={searchQuery} delay={400} />
                </div>
            </div>
            {showAddClientForm && <ClientForm close={() => setShowAddClientForm(false)} onSubmit={fetchData} />}
            <ClientList rows={clients} columns={["client", "addCharge", "cpf", "email", "phone", "status"]} />
        </div>
    )
}