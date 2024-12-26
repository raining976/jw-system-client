import { get, post } from '@/utils/request'

export const findCourse = (data) => get('/course/find', data, false)
export const deleteCourses = (data) => post('/course/delete', data, true)