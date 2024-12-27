import { get, post } from '@/utils/request'
export const getMyInfo = () => get('/user/info', {}, false)
export const getUserAll = (data) => get('/user/getAll', data, false)
export const deleteUsers = (data) => post('/user/delete', data, true)