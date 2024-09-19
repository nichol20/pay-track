"use client"
import { clientsIcon, pencilIcon } from '@/assets/images'
import { ChargeForm } from '@/components/ChargeForm'
import { ChargeList } from '@/components/ChargeList'
import { ClientForm } from '@/components/ClientForm'
import styles from '@/styles/Client.module.scss'
import { Client, ClientDetails, ClientWithoutId } from '@/types/client'
import { getClientDetails } from '@/utils/api'
import { translateClientProperty } from '@/utils/translation'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

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
    const params = useParams<{ id: string }>()
    const [clientDetails, setClientDetails] = useState<ClientDetails | null>(null)
    const [showEditClientForm, setShowEditClientForm] = useState(false)
    const [showAddChargeForm, setShowAddChargeForm] = useState(false)

    const renderTableFields = (k: string) => {
        const key = k as keyof ClientWithoutId

        if (["id", "usuario_id", "nome", "status"].includes(key)) return

        return (
            <div key={key} className={styles.field} style={{ gridArea: translateClientProperty(key) }}>
                <span className={styles.title}>{tableTitles[key as keyof TableTitles]}</span>
                <span className={styles.content}>
                    {!clientDetails?.client[key] ? "-" : clientDetails?.client[key]}
                </span>
            </div>
        )

    }

    const fetchData = useCallback(async () => {
        const clientD = await getClientDetails(params.id)
        setClientDetails(clientD)
    }, [params.id])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return (
        <div className={styles.clientPage}>
            <div className={styles.titleBox}>
                <Image src={clientsIcon} alt="clients" />
                <h1>{clientDetails?.client.nome}</h1>
            </div>

            <div className={styles.clientTableInfo}>
                <div className={styles.tableHeader}>
                    <span className={styles.tableTitle}>Dados do cliente</span>
                    <button className={styles.editClientBtn} onClick={() => setShowEditClientForm(true)}>
                        <Image src={pencilIcon} alt="pencil" />
                        <span>Editar Cliente</span>
                    </button>
                </div>

                <div className={styles.info}>
                    {Object.keys(clientDetails ? clientDetails?.client : {}).map(renderTableFields)}
                </div>
                {showEditClientForm &&
                    <ClientForm
                        client={clientDetails ? {
                            ...clientDetails.client,
                            id: parseInt(params.id),
                        } : undefined}
                        close={() => setShowEditClientForm(false)}
                        onSubmit={fetchData}
                    />}
            </div>

            <div className={styles.chargeListBox}>
                <div className={styles.titleBox}>
                    <span className={styles.title}>Cobranças do Cliente</span>
                    <button
                        className={styles.addChargeBtn}
                        onClick={() => setShowAddChargeForm(true)}
                    >+ Nova cobrança</button>
                </div>
                <ChargeList
                    className={styles.list}
                    rows={clientDetails ? clientDetails.charges : []}
                    columns={["chargeId", "value", "status", "description", "dueDate", "options"]}
                    refresh={fetchData}
                />
                {showAddChargeForm && <ChargeForm
                    client={{ id: parseInt(params.id), name: clientDetails ? clientDetails.client.nome : "" }}
                    close={() => setShowAddChargeForm(false)}
                />}
            </div>
        </div>
    )
}