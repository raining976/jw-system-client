import { get, post } from '@/utils/request'

export const getUserAll = (data = {})=>post('/user/getAll', data, false)