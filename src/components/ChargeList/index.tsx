"use client"
import { CSSProperties, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Charge, ClientDetailsCharge, SimpleCharge } from '@/types/charge'
import { attentionIcon, pencilIcon, trashCanIcon } from '@/assets/images'
import { centsToReal } from '@/utils/money'
import { translateChargeStatus } from '@/utils/translation'
import { ChargeForm } from '../ChargeForm'
import { Modal } from '../Modal'

import styles from './style.module.scss'
import { deleteCharge } from '@/utils/api'

export type ChargeListColumn =
    | "client"
    | "chargeId"
    | "value"
    | "dueDate"
    | "status"
    | "description"
    | "options"

type Row = Charge | SimpleCharge | ClientDetailsCharge

interface ChargeListProps {
    columns?: ChargeListColumn[]
    rows: Row[]
    className?: string
    refresh?: () => void
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
    client: "nome",
    chargeId: "id_cob",
    value: "valor",
    dueDate: "data_venc",
    status: "status",
    description: "descricao",
}

const columnsOrder: ChargeListColumn[] = ["client", "chargeId", "dueDate", "value", "status", "description", "options"]

export const ChargeList = ({ columns, rows, className, refresh }: ChargeListProps) => {
    const [showDeletionConfimationBox, setShowDeletionConfirmationBox] = useState(false)
    const [showEditChargeForm, setShowEditChargeForm] = useState(false)
    const [currentCharge, setCurrentCharge] = useState<Charge | null>(null)
    const [currentClient, setCurrentClient] = useState<{ id: number, name: string } | null>(null)
    const sortedColumns = columns ? columnsOrder.filter(column => columns.includes(column)) : columnsOrder
    const headerStyle: CSSProperties = {
        gridTemplateColumns: sortedColumns
            .map(column => `[ ${column} ] ${columnStyles[column]}`)
            .join(' ')
    }

    const renderRow = (row: Row, columnName: ChargeListColumn) => {
        if (columnName === "options") return

        let content
        const fieldName = fieldNames[columnName]
        if (fieldName in row) {
            // @ts-expect-error ...
            content = row[fieldName]
        }
        let contentClassName = styles.content

        if (columnName === "value" && typeof content === "number") {
            content = centsToReal(content, true)
        }

        if (columnName === "dueDate") {
            content = new Date(content).toLocaleDateString()
        }

        if (columnName === "status" && typeof row.status === "string") {
            contentClassName += ` ${styles[translateChargeStatus(row.status)]}`
        }

        let contentElement = <span className={contentClassName}>{content}</span>

        if (columnName === "client" && "id" in row) {
            contentElement = <Link href={`clients/${row.id}`} className={contentClassName}>{content}</Link>
        }

        return (
            <div key={columnName} className={`${styles[`${columnName}RowItem`]} ${styles.rowItem}`}>
                {contentElement}
            </div>
        )
    }

    const handleEditChargeBtnClick = (charge: Row) => {
        if (!(("id") in charge)) return

        setCurrentCharge(charge)
        setCurrentClient({
            id: charge.id,
            name: charge.nome
        })
        setShowEditChargeForm(true)
    }

    const handleDeleteChargeBtnClick = (charge: Row) => {
        if (!(("id") in charge)) return

        setShowDeletionConfirmationBox(true)
        setCurrentCharge(charge)
        setCurrentClient({
            id: charge.id,
            name: charge.nome
        })
    }

    const handleChargeDeletion = async () => {
        setShowDeletionConfirmationBox(false)
        if (currentCharge) {
            try {
                await deleteCharge(currentCharge.id_cob)
                refresh && refresh()
            } catch (error: any) {
                if (error?.response?.data?.mensagem === "Essa cobrança não pode ser deletada") {
                    // can't delete paid  or overdue charge
                }
            }
        }
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
                                <button className={styles.deleteBtn} onClick={() => handleDeleteChargeBtnClick(row)}>
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
                            <button
                                className={styles.confirmationBtn}
                                onClick={handleChargeDeletion}
                            >Sim</button>
                        </div>
                    </Modal>}
                {showEditChargeForm &&
                    <ChargeForm
                        client={currentClient!}
                        charge={currentCharge}
                        close={() => setShowEditChargeForm(false)}
                        onSubmit={refresh}
                    />}
            </div>
        </div>
    )
}
