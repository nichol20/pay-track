export const centsToReal = (value: number, prefix: boolean) => {
    const real = (value / 100).toFixed(2)

    if (prefix) {
        return `R$${real.replace('.', ',')}`
    }

    return real
}