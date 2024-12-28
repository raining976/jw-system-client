import { get, post } from '@/utils/request'

export const chooseCourse = (data) => post('/student/chooseCourse', data, true)
export const findMyCourse = (data={}) => get('/student/findMyCourse', data, false)
export const cancelCourse = (data) => post('/student/cancelCourse', data, true)