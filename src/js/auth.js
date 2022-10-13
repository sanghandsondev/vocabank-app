import { BACKEND_URL } from './config'
import { showToast } from './custom'
import axios from 'axios'
import { JWT_COOKIE_EXPIRES_IN } from './config'

export const login = async (data) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `${BACKEND_URL}users/login`,
            data
        })
        // console.log(res.data.token)
        if (res.data.status === "success") {
            document.cookie = `jwt=${res.data.token}; expires=${new Date(Date.now() + JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000)}`;
            localStorage.setItem('user', JSON.stringify(res.data.data.user))

        }
    } catch (err) {
        // showToast(err.response.data.message, 'danger')
        throw err.response.data.message
    }
    // localStorage.setItem('user', JSON.stringify(data))
}

export const signup = async (data) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `${BACKEND_URL}users/signup`,
            data
        })
        // console.log(res.data.token)
        if (res.data.status === "success") {
            document.cookie = `jwt=${res.data.token}; expires=${new Date(Date.now() + JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000)}`;
            localStorage.setItem('user', JSON.stringify(res.data.data.user))
        }
    } catch (err) {
        throw err.response.data.message
    }
}

export const logout = async () => {
    try {
        // console.log(document.cookie.split('=')[1])
        const res = await axios({
            method: 'GET',
            url: `${BACKEND_URL}users/logout`,
            headers: {
                'authorization': `Bearer ${document.cookie.split('=')[1]}`
            }
        })
        if (res.data.status === "success") {
            localStorage.removeItem('user')
        }
    } catch (err) {
        // showToast(err.response.data.message, 'danger')
        throw err.response.data.message

    }
}