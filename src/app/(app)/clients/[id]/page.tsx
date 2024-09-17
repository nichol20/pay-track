"use client"
import { clientsIcon, pencilIcon } from '@/assets/images'
import { ChargeList } from '@/components/ChargeList'
import styles from '@/styles/Client.module.scss'
import { Client } from '@/types/client'
import { translateClientProperty } from '@/utils/translation'
import Image from 'next/image'
import { useState } from 'react'

const charges = [
    {
        id: 1,
        cliente_nome: "Andressa",
        data_venc: "2001-20-12",
        descricao: "paosodjjap odjsap odjasop dosaihd saoi hdosai hdosia hdoias hdoiah soidh asoi",
        id_cob: "d8as0d98-da8sd09a8a-312d1s12-s12s212",
        status: "Paga",
        valor: 900
    },
    {
        id: 1,
        cliente_nome: "Andressa",
        data_venc: "2001-20-12",
        descricao: "paosodjjap odjsap odjasop dosaihd saoi hdosai hdosia hdoias hdoiah soidh asoi",
        id_cob: "d8as0d98-da8sd09a8a-312d1s12-s12s212",
        status: "Pendente",
        valor: 900
    },
    {
        id: 999,
        cliente_nome: "Andressa",
        data_venc: "2001-20-12",
        descricao: "paosodjjap odjsap odjasop dosaihd saoi hdosai hdosia hdoias hdoiah soidh asoi",
        id_cob: "d8as0d98-da8sd09a8a-312d1s12-s12s212",
        status: "Vencida",
        valor: 900
    },
]

type TableTitles = Omit<Record<keyof Client, string>, "id" | "usuario_id" | "nome" | "status">

const tableTitles: TableTitles = {
    email: "E-mail",
    telefone: "Telefone",
    cpf: "CPF",
    endereco: "Endereço",
    bairro: "Bairro",
    complemento: "Complemento",
    cep: "CEP",
    cidade: "Cidade",
    uf: "UF"
}

export default function ClientPage() {
    const [client, setClient] = useState<Client>({
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
    })

    const renderTableFields = (k: string) => {
        const key = k as keyof Client

        if (["id", "usuario_id", "nome", "status"].includes(key)) return

        return (
            <div key={key} className={styles.field} style={{ gridArea: translateClientProperty(key) }}>
                <span className={styles.title}>{tableTitles[key as keyof TableTitles]}</span>
                <span className={styles.content}>{client[key] === null ? "-" : client[key]}</span>
            </div>
        )

    }
    return (
        <div className={styles.clientPage}>
            <div className={styles.titleBox}>
                <Image src={clientsIcon} alt="clients" />
                <h1>Sara Lage Silva</h1>
            </div>

            <div className={styles.clientTableInfo}>
                <div className={styles.tableHeader}>
                    <span className={styles.tableTitle}>Dados do cliente</span>
                    <button className={styles.editClientBtn}>
                        <Image src={pencilIcon} alt="pencil" />
                        <span>Editar Cliente</span>
                    </button>
                </div>

                <div className={styles.info}>
                    {Object.keys(client).map(renderTableFields)}
                </div>
            </div>

            <ChargeList rows={charges} columns={["chargeId", "value", "status", "description", "dueDate"]} />
        </div>
    )
}