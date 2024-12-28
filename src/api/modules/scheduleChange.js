import { get, post } from '@/utils/request'

export const createScheduleChange = (data) => post('/scheduleChange/create', data, true)
export const studentFindSchedule = (data) => get('/scheduleChange/studentFind', data, false)
export const teacherFindSchedule = (data) => get('/scheduleChange/teacherFind', data, false)
export const adminFindSchedule = (data) => get('/scheduleChange/adminFind', data, false)
export const deleteChange = (data) => post('/scheduleChange/delete', data, true)
export const approveChange = (data) => post('/scheduleChange/approve', data, true)
export const rejectChange = (data) => post('/scheduleChange/reject', data, true)