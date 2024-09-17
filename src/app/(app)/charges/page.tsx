"use client"
import Image from 'next/image';

import { fileIcon, filterIcon } from '@/assets/images';
import { ChargeList } from '@/components/ChargeList';
import { SearchInput } from '@/components/SearchInput';
import { Charge } from '@/types/charge';

import styles from '@/styles/Charges.module.scss';

const charges: Charge[] = [
    {
        id: 1,
        cliente_nome: "Andressa",
        data_venc: "2001-20-12",
        descricao: "paosodjjap odjsap odjasop dosaihd saoi hdosai hdosia hdoias hdoiah soidh asoi",
        id_cob: "d8as0d98-da8sd09a8a-312d1s12-s12s212",
        status: "Paga",
        valor: 900
    },
    {
        id: 1,
        cliente_nome: "Andressa",
        data_venc: "2001-20-12",
        descricao: "paosodjjap odjsap odjasop dosaihd saoi hdosai hdosia hdoias hdoiah soidh asoi",
        id_cob: "d8as0d98-da8sd09a8a-312d1s12-s12s212",
        status: "Pendente",
        valor: 900
    },
    {
        id: 999,
        cliente_nome: "Andressa",
        data_venc: "2001-20-12",
        descricao: "paosodjjap odjsap odjasop dosaihd saoi hdosai hdosia hdoias hdoiah soidh asoi",
        id_cob: "d8as0d98-da8sd09a8a-312d1s12-s12s212",
        status: "Vencida",
        valor: 900
    },
]

export default function ChargesPage() {


    return (
        <div className={styles.chargesPage}>
            <div className={styles.header}>
                <div className={styles.titleBox}>
                    <Image src={fileIcon} alt="file" />
                    <h1>Cobranças</h1>
                </div>
                <div className={styles.actions}>
                    <button className={styles.filterBtn}>
                        <Image src={filterIcon} alt="filter" />
                    </button>
                    <SearchInput onChange={() => { }} delay={400} />
                </div>
            </div>
            <ChargeList rows={charges} />
        </div>
    )
}