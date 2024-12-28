import { get, post } from '@/utils/request'

export const getMyInfo = () => get('/user/info', {}, false)
export const getUserAll = (data = {}) => get('/user/getAll', data, false)
export const updateMyInfo = (data) => post('/user/updateMe', data, true)
export const updateStudentInfo = (data) => post('/student/update', data, true)
export const updateTeacherInfo = (data) => post('/teacher/update', data, true)
export const createStudent = (data) => post('/student/add', data, true)
export const createTeacher = (data) => post('/teacher/add', data, true)
export const deleteUsers = (data) => post('/user/delete', data, true)
export const getStudentAll = (data = {}) => get('/student/find', data, false)
export const getTeacherAll = (data = {}) => get('/teacher/find', data, false)
export const findTeacher = (data) => get('/teacher/find', data, false)

