import { CSSProperties } from 'react'
import { Charge } from '@/types/charge'

import styles from './style.module.scss'
import Image from 'next/image'
import { pencilIcon, trashCanIcon } from '@/assets/images'
import { centsToReal } from '@/utils/money'
import { translateChargeStatus } from '@/utils/translation'

export type ChargeListColumn =
    | "client"
    | "chargeId"
    | "value"
    | "dueDate"
    | "status"
    | "description"
    | "options"

interface ChargeListProps {
    columns: ChargeListColumn[]
    rows: Charge[]
}

const columnStyles: Record<ChargeListColumn, string> = {
    client: "minmax(120px, 1fr)",
    chargeId: "minmax(120px, 1fr)",
    value: "minmax(120px, 1fr)",
    dueDate: "minmax(120px, 1fr)",
    status: "minmax(100px, 1fr)",
    description: "minmax(180px, 1fr)",
    options: "minmax(120px, 1fr)"
}

const columnHeaders: Record<ChargeListColumn, string> = {
    client: "Cliente",
    chargeId: "ID Cob.",
    value: "Valor",
    dueDate: "Data de venc.",
    status: "Status",
    description: "Descrição",
    options: ""
}

const fieldNames: Omit<Record<ChargeListColumn, keyof Charge>, "options"> = {
    client: "cliente_nome",
    chargeId: "id_cob",
    value: "valor",
    dueDate: "data_venc",
    status: "status",
    description: "descricao",
}

const columnsOrder: ChargeListColumn[] = ["client", "chargeId", "value", "dueDate", "status", "description", "options"]

export const ChargeList = ({ columns, rows }: ChargeListProps) => {
    const sortedColumns = columnsOrder.filter(column => columns.includes(column))
    const headerStyle: CSSProperties = {
        gridTemplateColumns: sortedColumns
            .map(column => `[ ${column} ] ${columnStyles[column]}`)
            .join(' ')
    }

    const renderRow = (row: Charge, columnName: ChargeListColumn) => {
        if (columnName === "options") return
        let content = row[fieldNames[columnName]]
        let contentClassName = styles.content

        if (columnName === "value") {
            content = centsToReal(content as number, true)
        }

        if (columnName === "status") {
            contentClassName += ` ${styles[translateChargeStatus(row.status)]}`
        }

        return (
            <div key={columnName} className={`${styles[`${columnName}RowItem`]} ${styles.rowItem}`}>
                <span className={contentClassName}>{content}</span>
            </div>
        )
    }

    return (
        <div className={styles.chargeList}>
            <div className={styles.header} style={headerStyle}>
                {sortedColumns.map(column => (
                    <div key={column} className={`${styles[`${column}Col`]} ${styles.col}`}>
                        <span className={styles.name}>{columnHeaders[column]}</span>
                    </div>
                ))}
            </div>
            <div className={styles.rows}>
                {rows.map(row => (
                    <div key={row.id_cob} className={styles.chargeRow} style={headerStyle}>
                        {sortedColumns.map(column => renderRow(row, column))}
                        {sortedColumns.includes("options") &&
                            <div className={`${styles.optionsRowItem} ${styles.rowItem}`}>
                                <button className={styles.editBtn}>
                                    <Image src={pencilIcon} alt='pencil' />
                                    <span>Editar</span>
                                </button>
                                <button className={styles.deleteBtn}>
                                    <Image src={trashCanIcon} alt='trash can' />
                                    <span>Excluir</span>
                                </button>
                            </div>}
                    </div>
                ))}
            </div>
        </div>
    )
}
