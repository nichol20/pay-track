import { ReactNode, useEffect, useRef } from "react"

interface ClosabeComponentProps {
    children: ReactNode
    isOpen: boolean
    close: () => void
    className?: string
}

export const ClosableElement = ({ children, isOpen, close, className }: ClosabeComponentProps) => {
    const wrapperRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains((event.target as HTMLElement))) {
                close()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [close])

    if (!isOpen) return <></>

    return <div ref={wrapperRef} className={className}>
        {children}
    </div>
}