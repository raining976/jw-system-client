import { get, post } from '@/utils/request'

export const findTeacherClass = (data) => get('/teacher/findMyClass', data, false)