import { CSSProperties } from 'react'
import Image from 'next/image'

import { Client } from '@/types/client'
import { translateClientStatus } from '@/utils/translation'

import styles from './style.module.scss'
import { addFileIcon } from '@/assets/images'
import Link from 'next/link'

export type ClientListColumn =
    | "client"
    | "cpf"
    | "email"
    | "phone"
    | "status"
    | "addCharge"
    | "clientId"

interface ClientListProps {
    columns?: ClientListColumn[]
    rows: Client[]
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
    const sortedColumns = columns ? columnsOrder.filter(column => columns.includes(column)) : columnsOrder
    const headerStyle: CSSProperties = {
        gridTemplateColumns: sortedColumns
            .map(column => `[ ${column} ] ${columnStyles[column]}`)
            .join(' ')
    }

    const renderRow = (row: Client, columnName: ClientListColumn) => {
        if (columnName === "addCharge") return
        const content = row[fieldNames[columnName]]
        let contentClassName = styles.content

        if (columnName === "status") {
            contentClassName += ` ${styles[translateClientStatus(row.status)]}`
        }

        let contentElement = <span className={contentClassName}>{content}</span>

        if (columnName === "client") {
            contentElement = <Link href={`clients/${row.id}`} className={contentClassName}>{content}</Link>
        }

        return (
            <div key={columnName} className={`${styles[`${columnName}RowItem`]} ${styles.rowItem}`}>
                {contentElement}
            </div>
        )
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
            <div className={styles.rows}>
                {rows.map(row => (
                    <div key={row.id} className={styles.clientRow} style={headerStyle}>
                        {sortedColumns.map(column => renderRow(row, column))}
                        {sortedColumns.includes("addCharge") &&
                            <div className={`${styles.addChargeRowItem} ${styles.rowItem}`}>
                                <button className={styles.addChargeBtn}>
                                    <Image src={addFileIcon} alt="add file" />
                                    <span>Cobrança</span>
                                </button>
                            </div>}
                    </div>
                ))}
            </div>
        </div>
    )
}
