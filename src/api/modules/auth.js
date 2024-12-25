import { get, post } from '@/utils/request'

export const login = (data) => {
        return post('/user/login', data)
}

export const register = (data, role = 'student') => {
    if (role === 'admin') {
        return post('/admin/register', data)
    } else if (role === 'student') {
        return post('/student/register', data)
    } else if (role === 'teacher') {
        return post('/teacher/register', data)
    }
}