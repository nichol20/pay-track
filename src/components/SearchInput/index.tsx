import React, { useState } from "react";
import Image from "next/image";

import { closeIcon, searchIcon } from "@/assets/images";
import { useDebounce } from "@/hooks/useDebounce";

import styles from './style.module.scss'

interface SearchInputProps {
    onChange: (value: string) => void
    defaultValue?: string | undefined
    delay: number
}

export const SearchInput = function SearchInput({ onChange, defaultValue = "", delay = 0 }: SearchInputProps) {
    const [value, setValue] = useState(defaultValue)
    const [isEmpty, setIsEmpty] = useState(true)

    const handleChange = (query: string) => {
        setValue(query)
        setIsEmpty(query === "")
    }

    const cleanValue = () => {
        setValue("")
        setIsEmpty(true)
    }

    useDebounce(value, delay, onChange)

    return (
        <div className={styles.searchInput}>
            <input
                type="text"
                onChange={e => handleChange(e.target.value)}
                value={value}
                placeholder="Pesquisa"
            />
            {!isEmpty && (
                <button className={styles.cleanBtn} onClick={cleanValue}>
                    <Image src={closeIcon} alt="clean" className={styles.icon} />
                </button>
            )}
            <Image src={searchIcon} alt="search" className={styles.icon} />
        </div>
    )
}