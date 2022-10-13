import { BACKEND_URL } from './config'
import { showToast } from './custom'
import axios from 'axios'

export const login = async (data) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `${BACKEND_URL}users/login`,
            data
        })
        console.log(res.data.token)
        if (res.data.status === "success") {
            showToast('Đăng nhập thành công', 'success')
        }
    } catch (err) {
        showToast(err.response.data.message, 'danger')
    }
    // localStorage.setItem('user', JSON.stringify(data))
}

export const logout = async () => {
    localStorage.removeItem('user')
}