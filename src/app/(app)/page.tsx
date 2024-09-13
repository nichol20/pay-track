import { fileUnderAttentionIcon, invalidFileIcon, validFileIcon } from '@/assets/images'
import styles from '@/styles/Home.module.scss'
import Image from 'next/image'

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
    </div>
  )
}