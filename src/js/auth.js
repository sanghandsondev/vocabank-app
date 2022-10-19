import { BACKEND_API } from './config'
import { showToast } from './custom'
import axios from 'axios'
import { JWT_COOKIE_EXPIRES_IN } from './config'
import { async } from 'regenerator-runtime'

export const login = async (data) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `${BACKEND_API}users/login`,
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
            url: `${BACKEND_API}users/signup`,
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
            url: `${BACKEND_API}users/logout`,
            headers: {
                'authorization': `Bearer ${document.cookie.split('=')[1]}`
            }
        })
        if (res.data.status === "success") {
            document.cookie = `jwt=loggouted`;
            localStorage.removeItem('user')
        }
    } catch (err) {
        // showToast(err.response.data.message, 'danger')
        throw err.response.data.message

    }
}

export const updatePassword = async (data) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: `${BACKEND_API}users/updateMyPassword`,
            headers: {
                'authorization': `Bearer ${document.cookie.split('=')[1]}`
            },
            data
        })
        if (res.data.status === "success") {
            document.cookie = `jwt=${res.data.token}; expires=${new Date(Date.now() + JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000)}`;
            localStorage.setItem('user', JSON.stringify(res.data.data.user))
        }
    } catch (err) {
        throw err.response.data.message
    }
}