import { useEffect, useRef, useState } from 'react'

export const useDebounce = (value: string, delay = 500, cb?: (value: string) => void) => {
    const [debouncedValue, setDebouncedValue] = useState<string>(value)
    const firstRender = useRef(true)

    useEffect(() => {
        if (value !== "") firstRender.current = false

        const timeout = setTimeout(() => {
            setDebouncedValue(value)
            if (cb && !firstRender.current) {
                cb(value)
            }
        }, delay)

        return () => clearTimeout(timeout)
    }, [value, delay, cb])

    return debouncedValue
}
