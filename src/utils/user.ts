export const nameToImageRepresentation = (name: string) => {
    const vowels = ["a", "e", "i", "o", "u"]
    let representation = name[0]

    for (let i = 1; (i < name.length && representation.length < 2); i++) {
        if (!vowels.includes(name[i].toLocaleLowerCase())) {
            representation += name[i]
        }
    }

    return representation.toLocaleUpperCase()
}