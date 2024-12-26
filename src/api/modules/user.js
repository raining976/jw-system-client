import { get, post } from '@/utils/request'
export const getMyInfo = ()=> get('/user/info',{}, false)
export const getUserAll = (data = {})=>post('/user/getAll', data, false)
