"use client"
import { fileUnderAttentionIcon, invalidClientIcon, invalidFileIcon, validClientIcon, validFileIcon } from '@/assets/images'
import { ChargeList } from '@/components/ChargeList'
import { ChargesDashboard } from '@/types/charge'
import Image from 'next/image'
import styles from '@/styles/Home.module.scss'
import { ClientsDashboard } from '@/types/client'
import { ClientList } from '@/components/ClientList'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getChargesDashboard, getClientsDashboard } from '@/utils/api'
import { centsToReal } from '@/utils/money'

export default function Home() {
  const [chargesDashboard, setChargesDashboard] = useState<ChargesDashboard | null>(null)
  const [clientsDashboard, setClientsDashboard] = useState<ClientsDashboard | null>(null)

  useEffect(() => {
    const getData = async () => {
      const chargesD = await getChargesDashboard()
      setChargesDashboard(chargesD)
      const clientsD = await getClientsDashboard()
      setClientsDashboard(clientsD)
    }

    getData()
  }, [])

  return (
    <div className={styles.home}>
      <div className={styles.chargeSummary}>
        <div className={styles.paidCharges}>
          <Image src={validFileIcon} alt="valid file" />
          <div className={styles.info}>
            <span className={styles.title}>Cobranças pagas</span>
            <span className={styles.totalAmount}>{centsToReal(chargesDashboard?.Paga.total ?? 0, true)}</span>
          </div>
        </div>
        <div className={styles.expectedCharges}>
          <Image src={fileUnderAttentionIcon} alt="invalid file" />
          <div className={styles.info}>
            <span className={styles.title}>Cobranças previstas</span>
            <span className={styles.totalAmount}>{centsToReal(chargesDashboard?.Pendente.total ?? 0, true)}</span>
          </div>
        </div>
        <div className={styles.overdueCharges}>
          <Image src={invalidFileIcon} alt="invalid file" />
          <div className={styles.info}>
            <span className={styles.title}>Cobranças vencidas</span>
            <span className={styles.totalAmount}>{centsToReal(chargesDashboard?.Vencida.total ?? 0, true)}</span>
          </div>
        </div>
      </div>
      <div className={styles.chargeTables}>
        <div className={`${styles.chargeTable} ${styles.paidChargesTable}`}>
          <div className={styles.chargeTableTitleBox}>
            <span className={styles.chargeTableTitle}>Cobranças Pagas</span>
            <span className={styles.rowAmount}>{chargesDashboard?.Paga.quantidade}</span>
          </div>
          <ChargeList
            rows={chargesDashboard ? chargesDashboard.Paga.charges : []}
            columns={["client", "chargeId", "value"]}
            className={styles.chargeList}
          />
          <div className={styles.tableFooter}>
            <Link href="/charges" className={styles.checkAllLink}>Ver todos</Link>
          </div>
        </div>
        <div className={`${styles.chargeTable} ${styles.pendingChargesTable}`}>
          <div className={styles.chargeTableTitleBox}>
            <span className={styles.chargeTableTitle}>Cobranças Previstas</span>
            <span className={styles.rowAmount}>{chargesDashboard?.Pendente.quantidade}</span>
          </div>
          <ChargeList
            rows={chargesDashboard ? chargesDashboard.Pendente.charges : []}
            columns={["client", "chargeId", "value"]}
            className={styles.chargeList}
          />
          <div className={styles.tableFooter}>
            <Link href="/charges" className={styles.checkAllLink}>Ver todos</Link>
          </div>
        </div>
        <div className={`${styles.chargeTable} ${styles.overdueChargesTable}`}>
          <div className={styles.chargeTableTitleBox}>
            <span className={styles.chargeTableTitle}>Cobranças Vencidas</span>
            <span className={styles.rowAmount}>{chargesDashboard?.Vencida.quantidade}</span>
          </div>
          <ChargeList
            rows={chargesDashboard ? chargesDashboard.Vencida.charges : []}
            columns={["client", "chargeId", "value"]}
            className={styles.chargeList}
          />
          <div className={styles.tableFooter}>
            <Link href="/charges" className={styles.checkAllLink}>Ver todos</Link>
          </div>
        </div>

      </div>

      <div className={styles.clientTables}>
        <div className={`${styles.clientTable} ${styles.upToDateClientTable}`}>
          <div className={styles.clientTableTitleBox}>
            <Image src={validClientIcon} alt="valid client" />
            <span className={styles.clientTableTitle}>Clientes em dia</span>
            <span className={styles.rowAmount}>{clientsDashboard?.clientesEmdia.quantidade}</span>
          </div>
          <ClientList
            rows={clientsDashboard ? clientsDashboard.clientesEmdia.clientes : []}
            columns={["client", "clientId", "cpf"]}
            className={styles.clientList}
          />
          <div className={styles.tableFooter}>
            <Link href="/clients" className={styles.checkAllLink}>Ver todos</Link>
          </div>
        </div>
        <div className={`${styles.clientTable} ${styles.defaulterClientTable}`}>
          <div className={styles.clientTableTitleBox}>
            <Image src={invalidClientIcon} alt="invalid client" />
            <span className={styles.clientTableTitle}>Clientes Inadimplentes</span>
            <span className={styles.rowAmount}>{clientsDashboard?.clientesInadimplentes.quantidade}</span>
          </div>
          <ClientList
            rows={clientsDashboard ? clientsDashboard.clientesInadimplentes.clientes : []}
            columns={["client", "clientId", "cpf"]}
            className={styles.clientList}
          />
          <div className={styles.tableFooter}>
            <Link href="/clients" className={styles.checkAllLink}>Ver todos</Link>
          </div>
        </div>
      </div>
    </div>
  )
}