import axios from "axios"
import { errorNotice, successNotice } from "./notice"
import { useUserStore } from '@/store'
import router from "@/router"

const request = axios.create({
    baseURL: "http://localhost:3000",
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

    return response.data
}, (error) => {
    console.error('error', error)
    let msg = ''

    // errorNotice(msg)
    return Promise.reject(error);
})

function get(url, params, isNotice = true) {
    return request.get(url, { params }).then(res => {
        if (isNotice && res.code == 20000) {
            successNotice(res.msg)
        } else if (isNotice && res.code != 20000) {
            errorNotice(res.msg)
        }
        return res
    })
}
function post(url, data, isNotice = true) {
    return request.post(url, data).then(res => {
        // console.log('test', isNotice)
        if (isNotice && res.code == 20000) {
            successNotice(res.msg)
        } else if (isNotice && res.code !=20000) {
            errorNotice(res.msg)
        }
        return res
    })
}

export { get, post }


