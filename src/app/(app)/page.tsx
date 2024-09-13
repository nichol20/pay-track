import { fileUnderAttentionIcon, invalidFileIcon, validFileIcon } from '@/assets/images'
import { ChargeList } from '@/components/ChargeList'
import { Charge } from '@/types/charge'
import Image from 'next/image'
import styles from '@/styles/Home.module.scss'

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

export default function Home() {
  return (
    <div className={styles.home}>
      <div className={styles.chargeSummary}>
        <div className={styles.payedCharges}>
          <Image src={validFileIcon} alt="valid file" />
          <div className={styles.info}>
            <span className={styles.title}>Cobranças pagas</span>
            <span className={styles.totalAmount}>R$ 30.000</span>
          </div>
        </div>
        <div className={styles.overdueCharges}>
          <Image src={invalidFileIcon} alt="invalid file" />
          <div className={styles.info}>
            <span className={styles.title}>Cobranças vencidas</span>
            <span className={styles.totalAmount}>R$ 7.000</span>
          </div>
        </div>
        <div className={styles.expectedCharges}>
          <Image src={fileUnderAttentionIcon} alt="invalid file" />
          <div className={styles.info}>
            <span className={styles.title}>Cobranças previstas</span>
            <span className={styles.totalAmount}>R$ 10.000</span>
          </div>
        </div>
      </div>
      <ChargeList rows={charges} columns={['client', 'status', 'chargeId', 'dueDate', 'value', 'options', 'description',]} />
    </div>
  )
}