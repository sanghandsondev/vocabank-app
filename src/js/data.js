import { BACKEND_API } from './config'
import { showToast } from './custom'
import axios from 'axios'
import { JWT_COOKIE_EXPIRES_IN } from './config'
import { async } from 'regenerator-runtime'

export const getAllWordByCurrentUser = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: `${BACKEND_API}words`,
            headers: {
                'authorization': `Bearer ${document.cookie.split('=')[1]}`
            }
        })
        return res.data.data.words
    } catch (err) {
        throw err.response.data.message
    }
}

export const getAllGames = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: `${BACKEND_API}games`,
            // headers: {
            //     'authorization': `Bearer ${document.cookie.split('=')[1]}`
            // }
        })
        return res.data.data.games
    } catch (err) {
        throw err.response.data.message
    }
}

export const addWord = async (data) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `${BACKEND_API}words`,
            headers: {
                'authorization': `Bearer ${document.cookie.split('=')[1]}`
            },
            data
        })
        if (res.data.status === "success") {
            return
        }
    } catch (err) {
        throw err.response.data.message
    }
}

export const removeWord = async (id) => {
    try {
        const res = await axios({
            method: 'DELETE',
            url: `${BACKEND_API}words/${id}`,
            headers: {
                'authorization': `Bearer ${document.cookie.split('=')[1]}`
            },
        })
        // console.log(`${BACKEND_API}words/${id}`)
    } catch (err) {
        throw err.response.data.message
    }
}

export const updateWord = async (data, id) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: `${BACKEND_API}words/${id}`,
            headers: {
                'authorization': `Bearer ${document.cookie.split('=')[1]}`
            },
            data
        })
        // console.log(`${BACKEND_API}words/${id}`)
        // console.log('OK')
    } catch (err) {
        throw err.response.data.message
    }
}

export const addHistory = async (data, gameId) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `${BACKEND_API}games/${gameId}/histories`,
            headers: {
                'authorization': `Bearer ${document.cookie.split('=')[1]}`
            },
            data
        })
        if (res.data.status === "success") {
            return
        }
    } catch (err) {
        throw err.response.data.message
    }
}

export const getHistoryOfCurrentUser = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: `${BACKEND_API}histories`,
            headers: {
                'authorization': `Bearer ${document.cookie.split('=')[1]}`
            }
        })
        return res.data.data.histories
    } catch (err) {
        throw err.response.data.message
    }
}

export const updateInfoCurrentUser = async (data) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: `${BACKEND_API}users/updateMe`,
            headers: {
                'authorization': `Bearer ${document.cookie.split('=')[1]}`
            },
            data
        })
        if (res.data.status === "success") {
            localStorage.setItem('user', JSON.stringify(res.data.data.user))
        }
    } catch (err) {
        throw err.response.data.message
    }
}
