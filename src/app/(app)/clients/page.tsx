"use client"
import Image from 'next/image'
import { useState } from 'react'

import { ClientList } from '@/components/ClientList'
import { Client } from '@/types/client'
import { clientsIcon, filterIcon } from '@/assets/images'
import { SearchInput } from '@/components/SearchInput'
import { ClientForm } from '@/components/ClientForm'

import styles from '@/styles/Clients.module.scss'

const clients: Client[] = [
    {
        id: 1,
        nome: "Andressa",
        email: "andressa@emaill.com",
        telefone: "93218 0139",
        status: "Inadimplente",
        usuario_id: 1,
        cpf: "123.456.789-00",
        cep: null,
        bairro: null,
        cidade: null,
        complemento: null,
        endereco: null,
        uf: null,
    },
    {
        id: 2,
        nome: "Jorge",
        email: "Jorge@emaill.com",
        telefone: "93218 0139",
        status: "Inadimplente",
        usuario_id: 2,
        cpf: "123.456.789-00",
        cep: null,
        bairro: null,
        cidade: null,
        complemento: null,
        endereco: null,
        uf: null,
    },
    {
        id: 3,
        nome: "Juão",
        email: "Juão@emaill.com",
        telefone: "93218 0139",
        status: "Em dia",
        usuario_id: 3,
        cpf: "123.456.789-00",
        cep: null,
        bairro: null,
        cidade: null,
        complemento: null,
        endereco: null,
        uf: null,
    },
]

export default function ClientsPage() {
    const [showAddClientForm, setShowAddClientForm] = useState(false)

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
            {showAddClientForm && <ClientForm close={() => setShowAddClientForm(false)} />}
            <ClientList rows={clients} columns={["client", "addCharge", "cpf", "email", "phone", "status"]} />
        </div>
    )
}