"use client"
import { CSSProperties, useState } from 'react'
import { Charge } from '@/types/charge'

import styles from './style.module.scss'
import Image from 'next/image'
import { attentionIcon, pencilIcon, trashCanIcon } from '@/assets/images'
import { centsToReal } from '@/utils/money'
import { translateChargeStatus } from '@/utils/translation'
import Link from 'next/link'
import { ChargeForm } from '../ChargeForm'
import { Modal } from '../Modal'

export type ChargeListColumn =
    | "client"
    | "chargeId"
    | "value"
    | "dueDate"
    | "status"
    | "description"
    | "options"

interface ChargeListProps {
    columns?: ChargeListColumn[]
    rows: Charge[]
    className?: string
}

const columnStyles: Record<ChargeListColumn, string> = {
    client: "minmax(100px, 1fr)",
    chargeId: "minmax(100px, 1fr)",
    value: "minmax(100px, 1fr)",
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

const columnsOrder: ChargeListColumn[] = ["client", "chargeId", "dueDate", "value", "status", "description", "options"]

export const ChargeList = ({ columns, rows, className }: ChargeListProps) => {
    const [showDeletionConfimationBox, setShowDeletionConfirmationBox] = useState(false)
    const [showEditChargeForm, setShowEditChargeForm] = useState(false)
    const [currentCharge, setCurrentCharge] = useState<Charge | null>(null)
    const sortedColumns = columns ? columnsOrder.filter(column => columns.includes(column)) : columnsOrder
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

    const handleEditChargeBtnClick = (charge: Charge) => {
        setCurrentCharge(charge)
        setShowEditChargeForm(true)
    }

    return (
        <div className={`${styles.chargeList} ${className}`}>
            <div className={styles.header} style={headerStyle}>
                {sortedColumns.map(column => (
                    <div key={column} className={`${styles[`${column}Col`]} ${styles.col}`}>
                        <span className={styles.name}>{columnHeaders[column]}</span>
                    </div>
                ))}
            </div>
            <div className={styles.rows}>
                {rows.map((row, i) => (
                    <div key={i} className={styles.chargeRow} style={headerStyle}>
                        {sortedColumns.map(column => renderRow(row, column))}
                        {sortedColumns.includes("options") &&
                            <div className={`${styles.optionsRowItem} ${styles.rowItem}`}>
                                <button className={styles.editBtn} onClick={() => handleEditChargeBtnClick(row)}>
                                    <Image src={pencilIcon} alt='pencil' />
                                    <span>Editar</span>
                                </button>
                                <button className={styles.deleteBtn} onClick={() => setShowDeletionConfirmationBox(true)}>
                                    <Image src={trashCanIcon} alt='trash can' />
                                    <span>Excluir</span>
                                </button>
                            </div>}
                    </div>
                ))}
                {showDeletionConfimationBox &&
                    <Modal className={styles.confirmationBox} close={() => setShowDeletionConfirmationBox(false)}>
                        <Image src={attentionIcon} alt="attention" />
                        <span className={styles.deletionMessage}>Tem certeza que deseja excluir esta cobrança?</span>
                        <div className={styles.actions}>
                            <button
                                className={styles.cancelBtn}
                                onClick={() => setShowDeletionConfirmationBox(false)}
                            >Não</button>
                            <button className={styles.confirmationBtn}>Sim</button>
                        </div>
                    </Modal>}
                {showEditChargeForm &&
                    <ChargeForm
                        client={currentCharge ? { id: currentCharge.id, name: currentCharge.cliente_nome } : null}
                        close={() => setShowEditChargeForm(false)}
                    />}
            </div>
        </div>
    )
}
