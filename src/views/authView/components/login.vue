<template>
    <div class="card text-center" style="width: 700px; margin: 20px auto;">
        <!-- <div class="card-header">
            <ul class="nav nav-tabs card-header-tabs">
                <li class="nav-item" v-for="(item, index) in roles">
                    <span class="nav-link" :class="{ active: curIndex == index }" :aria-current="curIndex == index"
                        @click="chooseRole(index)">{{ item.name }}</span>
                </li>
            </ul>
        </div> -->
        <div class="card-body">
            <!-- 账号 -->
            <div class="row mb-3 align-items-center">
                <div class="col-sm-8">
                    <div class="input-group">
                        <span class="input-group-text">@</span>
                        <input type="text" v-model="form.username" class="form-control" id="account" placeholder="请输入账号"
                            required :class="{ 'is-invalid': usernameError }" />
                        <div class="invalid-feedback" v-if="usernameError">
                            账号不能为空
                        </div>
                    </div>
                </div>
            </div>

            <!-- 密码 -->
            <div class="row mb-3 align-items-center ">
                <div class="col-sm-8">
                    <div class="input-group">
                        <span class="input-group-text">🔒</span>
                        <input type="password" v-model="form.password" class="form-control" id="password"
                            placeholder="请输入密码" required :class="{ 'is-invalid': passwordError }" />
                        <div class="invalid-feedback" v-if="passwordError">
                            密码不能为空
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12" style="text-align: left;">
                <button class="btn btn-primary" style="width: 80px;" @click="submit">登录</button>
                <button class="btn" style="width: 80px;" @click="toRegister">去注册</button>
            </div>
        </div>
    </div>
</template>

<script setup>

const curIndex = ref(0)
const rolesArr = ['student', 'teacher', 'admin']
const roles = ref([
    {
        name: "我是学生",
    },
    {
        name: "我是教师",
    },
    {
        name: "我是管理员",
    },
])

const form = ref({
    username: '',
    password: '',
})
const usernameError = ref(false)
const passwordError = ref(false)
const { proxy } = getCurrentInstance()
const router = useRouter()
import { useUserStore } from "@/store"

const userStore = useUserStore()
const submit = () => {
    usernameError.value = !form.value.username
    passwordError.value = !form.value.password
    if (usernameError.value || passwordError.value) {
        return
    }
    proxy.$api.login(form.value).then(res => {
        if (res.code == 20000) {
            userStore.setToken(res.data)
            router.push('/')
        }
    })

}

const chooseRole = (i) => {
    curIndex.value = i
    usernameError.value = false;
    passwordError.value = false;
}

const toRegister = () =>{
    router.push('/register')
}

</script>

<style scoped>
.nav-item {
    cursor: pointer;
}

.input-group {
    position: relative;
}

.invalid-feedback {
    position: absolute;
    right: 5px;
    bottom: -10px;
    z-index: 999;
    text-align: right;
    height: 10px;
    font-size: 10px;
}
</style>