
export const login = (data) => {
    localStorage.setItem('user', JSON.stringify(data))
}

export const logout = async () => {
    localStorage.removeItem('user')
}