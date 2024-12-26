import { get, post } from '@/utils/request'

export const getUserAll = (data = {}) => post('/user/getAll', data, false)
export const getUserInfo = (data = {}) => get('/user/info', data, false)