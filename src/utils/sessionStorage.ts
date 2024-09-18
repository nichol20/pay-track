export enum SessionStorageKeys {
    TOKEN = "token",
    USER_ID = "userId"
}

export const getFromCache = <T>(cacheKey: string): T | null => {
    const cachedData = sessionStorage.getItem(cacheKey)

    if (cachedData) {
        return JSON.parse(cachedData)
    }

    return null
}

export const setToCache = (cacheKey: string, data: any) => {
    sessionStorage.setItem(cacheKey, JSON.stringify(data))
}

export const removeFromCache = (cacheKey: string) => {
    sessionStorage.removeItem(cacheKey)
}