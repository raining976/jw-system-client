
export const userTeacherStore = defineStore({
    id: "Teacher",
    state: () => ({
        classInfo: {

        }
    }),
    getters: {
        className: {

        }
    },
    actions: {
        setClass(item) {
            this.classInfo = { ...item }
        },

    },
    // 数据持久化
    persist: {
        key: "teacher",
        storage: localStorage,
    },
});