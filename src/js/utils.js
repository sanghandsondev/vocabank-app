

export const isEmail = (value) => {
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return regex.test(value)
}

export const isWordUnique = (word, list) => {
    const isFind = list.some((el, index) => {
        return el.word === word
    })
    return !isFind
}

export const existMaxChar = (value, max) => {
    const length = value.length
    if (length > max) return false
    return true
}
