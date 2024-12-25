// @/store/modules/user.js

export const useUserStore = defineStore({
    id: "User",
    state: () => ({
        token: null,
        accountInfo: {
            user_id: 1,
            username: "test",
            password: "admin",
            role: '',
        },
        userInfo:{
            
        }
    }),
    getters: {
        isLoggedIn() {
            return this.token == null ? false : true;
        }
    },
    actions: {
        getToken() {
            return this.token
        },
        setToken(val) {
            this.token = val
        },
        setUserInfo(data) {
            this.userInfo = reactive(data)
        },
        logout() {
            this.token = null
            router.replace('/')
        }
    },
    // 数据持久化
    persist: {
        key: "user", 
        storage: localStorage,
    },
});