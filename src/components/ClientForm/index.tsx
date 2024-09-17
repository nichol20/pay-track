
import { Client } from '@/types/client'
import styles from './style.module.scss'
import { Modal } from '../Modal'
import { InputField } from '../InputField'
import Image from 'next/image'
import { clientsIcon } from '@/assets/images'

interface ClientFormProps {
    client?: Client
    close: () => void
}

export const ClientForm = ({ client, close }: ClientFormProps) => {

    return (
        <Modal close={close}>
            <form className={styles.clientForm}>
                <div className={styles.titleBox}>
                    <Image src={clientsIcon} alt="clients" />
                    {<span className={styles.title}>{client ? "Editar Cliente" : "Cadastro do Cliente"}</span>}
                </div>
                <InputField
                    inputId='name'
                    title='Nome*'
                    name="name"
                    type='text'
                    placeholder='Digite o Nome'
                    defaultValue={client?.nome}
                    required
                />
                <InputField
                    inputId='email'
                    title='E-mail*'
                    name="email"
                    type='email'
                    placeholder='Digite o E-mail'
                    defaultValue={client?.email}
                    required
                />
                <div className={styles.fieldGroup}>
                    <InputField
                        inputId='cpf'
                        title='CPF*'
                        name="cpf"
                        type='text'
                        placeholder='Digite o CPF'
                        defaultValue={client?.cpf}
                        required
                    />
                    <InputField
                        inputId='phone'
                        title='Telefone*'
                        name="phone"
                        type='text'
                        placeholder='Digite o Telefone'
                        defaultValue={client?.telefone}
                        required
                    />
                </div>
                <InputField
                    inputId='address'
                    title='Endereço'
                    name="address"
                    type='text'
                    placeholder='Digite o Endereço'
                    defaultValue={client?.endereco ? client?.endereco : undefined}
                />
                <InputField
                    inputId='complement'
                    title='Complemento'
                    name="complement"
                    type='text'
                    placeholder='Digite o Complemento'
                    defaultValue={client?.complemento ? client?.complemento : undefined}
                />
                <div className={styles.fieldGroup}>
                    <InputField
                        inputId='cep'
                        title='CEP'
                        name="cep"
                        type='text'
                        placeholder='Digite o CEP'
                        defaultValue={client?.cep ? client?.cep : undefined}
                    />
                    <InputField
                        inputId='neighborhood'
                        title='Bairro'
                        name="neighborhood"
                        type='text'
                        placeholder='Digite o Bairro'
                        defaultValue={client?.endereco ? client?.endereco : undefined}
                    />
                </div>
                <div className={styles.fieldGroup}>
                    <InputField
                        inputId='city'
                        title='Cidade'
                        name="city"
                        type='text'
                        placeholder='Digite a Cidade'
                        className={styles.cityField}
                        defaultValue={client?.cidade ? client?.cidade : undefined}
                    />
                    <InputField
                        inputId='uf'
                        title='UF'
                        name="uf"
                        type='text'
                        placeholder='Digite a UF'
                        className={styles.ufField}
                        defaultValue={client?.uf ? client?.uf : undefined}
                    />
                </div>
                <div className={styles.actions}>
                    <button className={styles.cancelBtn} onClick={close}>Cancelar</button>
                    <button className={styles.submitBtn}>Aplicar</button>
                </div>
            </form>

        </Modal>
    )
}