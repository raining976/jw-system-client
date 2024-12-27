import { get, post } from '@/utils/request'

export const findCourse = (data) => get('/course/find', data, false)
export const deleteCourses = (data) => post('/course/delete', data, true)
export const createCourse = (data) => post('/course/add', data, true)
export const updateCourse = (data) => post('/course/update', data, true)
