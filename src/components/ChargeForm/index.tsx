
import { Charge } from '@/types/charge'
import { Modal } from '../Modal'

import styles from './style.module.scss'
import { InputField, TextareaField } from '../InputField'
import { centsToReal } from '@/utils/money'
import { CheckMark } from '../CheckMark'
import Image from 'next/image'
import { fileIcon } from '@/assets/images'

interface ChargeFormProps {
    client: {
        id: number
        name: string
    } | null
    charge?: Charge
    close: () => void
}

export const ChargeForm = ({ client, charge, close }: ChargeFormProps) => {

    const handleMoneyInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const currentValue = event.target.value
        if (currentValue.split(".")[1]?.length > 2) {
            event.target.value = parseFloat(currentValue).toFixed(2)
        }
    }

    return (
        <Modal close={close}>
            <form className={styles.chargeForm}>
                <div className={styles.titleBox}>
                    <Image src={fileIcon} alt="file" />
                    {<span className={styles.title}>{charge ? "Edição de Cobrança" : "Cadastro de Cobrança"}</span>}
                </div>
                <InputField
                    inputId='name'
                    title='Nome*'
                    name="name"
                    type='text'
                    placeholder='Digite o Nome'
                    defaultValue={client?.name}
                    required
                />

                <TextareaField
                    textareaId="description"
                    title='Descrição*'
                    placeholder='Digite a descrição'
                    defaultValue={charge?.descricao}
                />
                <div className={styles.fieldGroup}>
                    <InputField
                        inputId='date'
                        title='Vencimento*'
                        name="date"
                        type='date'
                        placeholder='Data de Vencimento'
                        required
                    />
                    <InputField
                        inputId='value'
                        title='Valor*'
                        name="value"
                        type='number'
                        min='0.01'
                        step='0.01'
                        defaultValue={charge ? centsToReal(charge.valor, false) : 0.01}
                        prefix='R$'
                        onChange={handleMoneyInputChange}
                        required
                    />
                </div>
                <div className={styles.radioInput}>
                    <span className={styles.title}>Status*</span>
                    <label className={styles.payedLabel}>
                        <div className={styles.checkMarkBox}>
                            <CheckMark size={12} thickness={2} className={styles.checkMark} />
                        </div>
                        Cobrança Paga
                        <input
                            type="radio"
                            name="status"
                            value="payed"
                            defaultChecked={charge ? charge.status === "Paga" : true}
                        />
                    </label>
                    <label className={styles.pendingLabel}>
                        <div className={styles.checkMarkBox}>
                            <CheckMark size={12} thickness={2} className={styles.checkMark} />
                        </div>
                        Cobrança Pendente
                        <input
                            type="radio"
                            name="status"
                            value="pending"
                            defaultChecked={charge?.status === "Pendente"}
                        />
                    </label>
                </div>
                <div className={styles.actions}>
                    <button className={styles.cancelBtn} onClick={close}>Cancelar</button>
                    <button className={styles.submitBtn}>Aplicar</button>
                </div>
            </form>
        </Modal>
    )
}