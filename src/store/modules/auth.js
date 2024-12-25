
export const useAuthStore = defineStore({
    id: "Auth",
    state: () => ({
        role: null, // student teacher admin 
    }),
    getters: {
    },
    actions: {
        getRole() {
            return this.role
        },
        setRole(role) {
            this.role = role;
        },
        isAdmin() {
            return this.role == 'admin'
        },
        isStudent() {
            return this.role == 'student'
        },
        isTeacher() {
            return this.role == 'teacher'
        }

    },
    // 数据持久化
    persist: {
        key: "auth",
        storage: localStorage,
    },
});