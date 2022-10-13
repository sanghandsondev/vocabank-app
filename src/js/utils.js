

export const isEmail = (value) => {
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return regex.test(value)
}

export const isWordUnique = (name, list) => {
    const isFind = list.some((el, index) => {
        return el.name === name
    })
    return !isFind
}

export const existMaxChar = (value, max) => {
    const length = value.length
    if (length > max) return false
    return true
}
