import axios from "axios"
import { errorNotice, successNotice } from "./notice"
import { useUserStore } from '@/store'
import router from "@/router"

const request = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
    timeout: 5000,
})

// 不需要token的白名单
const noRequiresTokenWhiteList = []


// 请求
request.interceptors.request.use((config) => {
    const userStore = useUserStore()
    const token = userStore.getToken()
    config.headers.Authorization = "Bearer " + token

    return config
})

// 响应拦截 
request.interceptors.response.use((response) => {
    if (response.data.code == 60002 || response.data.code == 60001) {
        errorNotice(response.data.msg)
        const userStore = useUserStore()
        userStore.logout()
    }
    return response.data
}, (error) => {
    console.error('error', error)
    let msg = ''
    // errorNotice(msg)
    return Promise.reject(error);
})

function isSuccess(v) {
    return (/^2\d{4}$/.test(v))
}
function get(url, params, isNotice = true) {
    return request.get(url, { params }).then(res => {
        if (isNotice && isSuccess(res.code)) {
            successNotice(res.msg)
        } else if (isNotice) {
            errorNotice(res.msg)
        }
        return res
    })
}
function post(url, data, isNotice = true) {
    return request.post(url, data).then(res => {
        // console.log('test', isNotice)
        if (isNotice && isSuccess(res.code)) {
            successNotice(res.msg)
        } else if (isNotice) {
            errorNotice(res.msg)
        }
        return res
    })
}

export { get, post }


