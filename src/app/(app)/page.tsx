import { fileUnderAttentionIcon, invalidClientIcon, invalidFileIcon, validClientIcon, validFileIcon } from '@/assets/images'
import { ChargeList } from '@/components/ChargeList'
import { Charge } from '@/types/charge'
import Image from 'next/image'
import styles from '@/styles/Home.module.scss'
import { Client } from '@/types/client'
import { ClientList } from '@/components/ClientList'
import Link from 'next/link'

const charges: Charge[] = [
  {
    cliente_nome: "Andressa",
    data_venc: "2001-20-12",
    descricao: "paosodjjap odjsap odjasop dosaihd saoi hdosai hdosia hdoias hdoiah soidh asoi",
    id_cob: "d8as0d98-da8sd09a8a-312d1s12-s12s212",
    status: "Paga",
    valor: 900
  },
  {
    cliente_nome: "Andressa",
    data_venc: "2001-20-12",
    descricao: "paosodjjap odjsap odjasop dosaihd saoi hdosai hdosia hdoias hdoiah soidh asoi",
    id_cob: "d8as0d98-da8sd09a8a-312d1s12-s12s212",
    status: "Pendente",
    valor: 900
  },
  {
    cliente_nome: "Andressa",
    data_venc: "2001-20-12",
    descricao: "paosodjjap odjsap odjasop dosaihd saoi hdosai hdosia hdoias hdoiah soidh asoi",
    id_cob: "d8as0d98-da8sd09a8a-312d1s12-s12s212",
    status: "Vencida",
    valor: 900
  },
]

const clients: Client[] = [
  {
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
    nome: "Jorge",
    email: "Jorge@emaill.com",
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
    nome: "Juão",
    email: "Juão@emaill.com",
    telefone: "93218 0139",
    status: "Em dia",
    usuario_id: 1,
    cpf: "123.456.789-00",
    cep: null,
    bairro: null,
    cidade: null,
    complemento: null,
    endereco: null,
    uf: null,
  },
]

export default function Home() {
  return (
    <div className={styles.home}>
      <div className={styles.chargeSummary}>
        <div className={styles.paidCharges}>
          <Image src={validFileIcon} alt="valid file" />
          <div className={styles.info}>
            <span className={styles.title}>Cobranças pagas</span>
            <span className={styles.totalAmount}>R$ 30.000</span>
          </div>
        </div>
        <div className={styles.expectedCharges}>
          <Image src={fileUnderAttentionIcon} alt="invalid file" />
          <div className={styles.info}>
            <span className={styles.title}>Cobranças previstas</span>
            <span className={styles.totalAmount}>R$ 10.000</span>
          </div>
        </div>
        <div className={styles.overdueCharges}>
          <Image src={invalidFileIcon} alt="invalid file" />
          <div className={styles.info}>
            <span className={styles.title}>Cobranças vencidas</span>
            <span className={styles.totalAmount}>R$ 7.000</span>
          </div>
        </div>
      </div>
      <div className={styles.chargeTables}>
        <div className={`${styles.chargeTable} ${styles.paidChargesTable}`}>
          <div className={styles.chargeTableTitleBox}>
            <span className={styles.chargeTableTitle}>Cobranças Pagas</span>
            <span className={styles.rowAmount}>10</span>
          </div>
          <ChargeList rows={charges} columns={["client", "chargeId", "value"]} className={styles.chargeList} />
          <div className={styles.tableFooter}>
            <Link href="#" className={styles.checkAllLink}>Ver todos</Link>
          </div>
        </div>
        <div className={`${styles.chargeTable} ${styles.pendingChargesTable}`}>
          <div className={styles.chargeTableTitleBox}>
            <span className={styles.chargeTableTitle}>Cobranças Previstas</span>
            <span className={styles.rowAmount}>05</span>
          </div>
          <ChargeList rows={charges} columns={["client", "chargeId", "value"]} className={styles.chargeList} />
          <div className={styles.tableFooter}>
            <Link href="#" className={styles.checkAllLink}>Ver todos</Link>
          </div>
        </div>
        <div className={`${styles.chargeTable} ${styles.overdueChargesTable}`}>
          <div className={styles.chargeTableTitleBox}>
            <span className={styles.chargeTableTitle}>Cobranças Vencidas</span>
            <span className={styles.rowAmount}>08</span>
          </div>
          <ChargeList rows={charges} columns={["client", "chargeId", "value"]} className={styles.chargeList} />
          <div className={styles.tableFooter}>
            <Link href="#" className={styles.checkAllLink}>Ver todos</Link>
          </div>
        </div>

      </div>

      <div className={styles.clientTables}>
        <div className={`${styles.clientTable} ${styles.upToDateClientTable}`}>
          <div className={styles.clientTableTitleBox}>
            <Image src={validClientIcon} alt="valid client" />
            <span className={styles.clientTableTitle}>Clientes Inadimplentes</span>
            <span className={styles.rowAmount}>08</span>
          </div>
          <ClientList rows={clients} columns={["client", "clientId", "cpf"]} className={styles.clientList} />
          <div className={styles.tableFooter}>
            <Link href="#" className={styles.checkAllLink}>Ver todos</Link>
          </div>
        </div>
        <div className={`${styles.clientTable} ${styles.defaulterClientTable}`}>
          <div className={styles.clientTableTitleBox}>
            <Image src={invalidClientIcon} alt="invalid client" />
            <span className={styles.clientTableTitle}>Clientes em dia</span>
            <span className={styles.rowAmount}>08</span>
          </div>
          <ClientList rows={clients} columns={["client", "clientId", "cpf"]} className={styles.clientList} />
          <div className={styles.tableFooter}>
            <Link href="#" className={styles.checkAllLink}>Ver todos</Link>
          </div>
        </div>
      </div>
    </div>
  )
}