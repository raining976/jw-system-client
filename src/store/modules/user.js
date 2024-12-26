// @/store/modules/user.js
import { getMyInfo } from "@/api";
import router from "@/router"

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
        studentInfo: {},
        teacherInfo:{}
    }),
    getters: {
        isLoggedIn() {
            return this.token == null ? false : true;
        },
        username() {
            return this.accountInfo.username
        },
        role() {
            return this.accountInfo.role
        },
        userInfo(){
            if(this.accountInfo.role == 'student'){
                return this.studentInfo
            }else if(this.accountInfo.role == 'teacher'){
                return this.teacherInfo
            }else{
                return this.accountInfo
            }
        }
    },
    actions: {
        getToken() {
            return this.token
        },
        setToken(val) {
            this.token = val
            this.getInfo()
        },
        setUserInfo(data) {
            this.userInfo = reactive(data)
        },
        logout() {
            this.token = null
            router.push('/login')
        },
        setUsername(v){
            this.accountInfo.username = v
        },
        setRole(v){
            this.accountInfo.role = v
        },
        getInfo() {
            getMyInfo().then(res=>{
                this.setUsername(res.data.username)
                this.setRole(res.data.role)
                if(res.data.role == 'student'){
                    this.studentInfo = res.data
                }else if(res.data.role == 'teacher'){
                    this.teacherInfo = res.data
                }
               
            })
        }
    },
    // 数据持久化
    persist: {
        key: "user",
        storage: localStorage,
    },
});