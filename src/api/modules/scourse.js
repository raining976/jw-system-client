import { get, post } from '@/utils/request'

export const findSCourse = (data) => get('/scourse/find', data, false)
export const deleteSCourses = (data) => post('/scourse/delete', data, true)
export const createSCourse = (data) => post('/scourse/add', data, true)
export const findStudentsByScourseId = (data) => get('/scourse/findStudents', data, false)
export const updateScore = (data) => post('/scourse/updateScore', data, true)