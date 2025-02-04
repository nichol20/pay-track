"use client"
import { CSSProperties, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Client, SimpleClient } from '@/types/client'
import { translateClientStatus } from '@/utils/translation'
import { addFileIcon } from '@/assets/images'
import { ChargeForm } from '../ChargeForm'

import styles from './style.module.scss'

export type ClientListColumn =
    | "client"
    | "cpf"
    | "email"
    | "phone"
    | "status"
    | "addCharge"
    | "clientId"

type Row = Client | SimpleClient
interface ClientListProps {
    columns?: ClientListColumn[]
    rows: Row[]
    className?: string
}

const columnStyles: Record<ClientListColumn, string> = {
    client: "minmax(120px, 1fr)",
    clientId: "minmax(120px, 1fr)",
    cpf: "minmax(120px, 1fr)",
    email: "minmax(120px, 1fr)",
    phone: "minmax(120px, 1fr)",
    status: "minmax(100px, 1fr)",
    addCharge: "minmax(100px, 1fr)",
}

const columnHeaders: Record<ClientListColumn, string> = {
    client: "Cliente",
    clientId: "ID do Clie.",
    cpf: "CPF",
    email: "E-mail",
    phone: "Telefone",
    status: "Status",
    addCharge: "Criar Cobrança",
}

const fieldNames: Omit<Record<ClientListColumn, keyof Client>, "addCharge"> = {
    client: "nome",
    clientId: "id",
    cpf: "cpf",
    email: "email",
    phone: "telefone",
    status: "status",
}

const columnsOrder: ClientListColumn[] = ["client", "clientId", "cpf", "email", "phone", "status", "addCharge"]

export const ClientList = ({ columns, rows, className }: ClientListProps) => {
    const [showAddChargeForm, setShowAddChargeForm] = useState(false)
    const [currentClient, setCurrentClient] = useState<Row | null>(null)
    const sortedColumns = columns ? columnsOrder.filter(column => columns.includes(column)) : columnsOrder
    const headerStyle: CSSProperties = {
        gridTemplateColumns: sortedColumns
            .map(column => `[ ${column} ] ${columnStyles[column]}`)
            .join(' ')
    }

    const renderRow = (row: Row, columnName: ClientListColumn) => {
        if (columnName === "addCharge") return
        let content
        let contentClassName = styles.content
        const fieldName = fieldNames[columnName]

        if (fieldName in row) {
            // @ts-expect-error ...
            content = row[fieldName]
        }

        if (columnName === "status" && "status" in row) {
            contentClassName += ` ${styles[translateClientStatus(row.status)]}`
        }

        let contentElement = <span className={contentClassName}>{content}</span>

        if (columnName === "client") {
            contentElement = <Link href={`clients/${row.id}`} className={contentClassName} data-testid="clientLink">{content}</Link>
        }

        return (
            <div key={columnName} className={`${styles[`${columnName}RowItem`]} ${styles.rowItem}`}>
                {contentElement}
            </div>
        )
    }

    const handleAddChargeBtnClick = (client: Row) => {
        setCurrentClient(client)
        setShowAddChargeForm(true)
    }

    return (
        <div className={`${styles.clientList} ${className}`}>
            <div className={styles.header} style={headerStyle}>
                {sortedColumns.map(column => (
                    <div key={column} className={`${styles[`${column}Col`]} ${styles.col}`}>
                        <span className={styles.name}>{columnHeaders[column]}</span>
                    </div>
                ))}
            </div>
            <div className={styles.rows} data-testid="clientRows">
                {rows.map(row => (
                    <div key={row.id} className={styles.clientRow} style={headerStyle}>
                        {sortedColumns.map(column => renderRow(row, column))}
                        {sortedColumns.includes("addCharge") &&
                            <div className={`${styles.addChargeRowItem} ${styles.rowItem}`}>
                                <button className={styles.addChargeBtn} onClick={() => handleAddChargeBtnClick(row)}>
                                    <Image src={addFileIcon} alt="add file" />
                                    <span>Cobrança</span>
                                </button>
                            </div>}
                    </div>
                ))}
                {showAddChargeForm && currentClient &&
                    <ChargeForm
                        client={{ id: currentClient.id, name: currentClient.nome }}
                        close={() => setShowAddChargeForm(false)}
                    />}
            </div>
        </div>
    )
}
