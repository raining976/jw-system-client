<template>
    <div class="card text-center" style="width: 700px; margin: 20px auto;">
        <div class="card-header">
            <ul class="nav nav-tabs card-header-tabs">
                <li class="nav-item" v-for="(item, index) in roles">
                    <span class="nav-link" :class="{ active: curIndex == index }" :aria-current="curIndex == index"
                        @click="chooseRole(index)">{{ item.name }}</span>
                </li>
            </ul>
        </div>
        <div class="card-body">
            <!-- 学生 -->
            <div class="studentBody" v-show="curIndex == 0">
                <!-- 账号 -->
                <div class="row mb-3 align-items-center">
                    <div class="col-sm-12">
                        <div class="input-group">
                            <span class="input-group-text">@</span>
                            <input type="text" v-model="accountForm.username" class="form-control" id="account"
                                placeholder="请输入账号">
                        </div>
                    </div>
                </div>

                <!-- 密码 和 重复密码 放在一行 -->
                <div class="row mb-3 align-items-center">
                    <!-- 密码 -->
                    <div class="col-sm-6">
                        <div class="input-group">
                            <span class="input-group-text">🔒</span>
                            <input type="password" v-model="accountForm.password" class="form-control"
                                placeholder="请输入密码">
                        </div>
                    </div>
                    <!-- 重复密码 -->
                    <div class="col-sm-6">
                        <div class="input-group">
                            <span class="input-group-text">🔒</span>
                            <input type="password" class="form-control" v-model="accountForm.rePassword"
                                placeholder="请确认密码">
                        </div>
                    </div>
                </div>

                <!-- 姓名 和 性别 放在一行 -->
                <div class="row mb-3 align-items-center">
                    <!-- 姓名 -->
                    <div class="col-sm-4">
                        <div class="input-group">
                            <span class="input-group-text">🧑‍🎓</span>
                            <input type="text" class="form-control" v-model="studentForm.name" id="studentName"
                                placeholder="请输入姓名">
                        </div>
                    </div>
                    <!-- 性别 -->
                    <div class="col-sm-4">
                        <div class="input-group">
                            <span class="input-group-text">♂|♀</span>
                            <select class="form-select" id="gender" v-model="studentForm.gender">
                                <option value="">选择性别</option>
                                <option value="男">男</option>
                                <option value="女">女</option>
                                <option value="保密">保密</option>
                            </select>
                        </div>
                    </div>
                    <!-- 年级 -->
                    <div class="col-sm-4">
                        <div class="input-group">
                            <span class="input-group-text">🎓</span>
                            <select class="form-select" id="grade" v-model="studentForm.grade">
                                <option value="">选择年级</option>
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                                <option value="2022">2022</option>
                                <option value="2021">2021</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- 学号 和 专业 放在一行 -->
                <div class="row mb-3 align-items-center">
                    <!-- 学号 -->
                    <div class="col-sm-6">
                        <div class="input-group">
                            <span class="input-group-text">#</span>
                            <input type="text" class="form-control" v-model="studentForm.student_id" id="studentId"
                                placeholder="请输入学号">
                        </div>
                    </div>

                    <!-- 专业 -->
                    <div class="col-sm-6">
                        <div class="input-group">
                            <span class="input-group-text">📘</span>
                            <input type="text" class="form-control" v-model="studentForm.major" id="major"
                                placeholder="请输入专业">
                        </div>
                    </div>

                </div>



            </div>
            <!-- 老师 -->
            <div class="teacherBody" v-show="curIndex == 1">
                <!-- 账号 -->
                <div class="row mb-3 align-items-center">
                    <div class="col-sm-12">
                        <div class="input-group">
                            <span class="input-group-text">@</span>
                            <input type="text" v-model="accountForm.username" class="form-control" id="teacherAccount" placeholder="请输入账号">
                        </div>
                    </div>
                </div>
                <!-- 密码 和 重复密码 放在一行 -->
                <div class="row mb-3 align-items-center">
                    <!-- 密码 -->
                    <div class="col-sm-6">
                        <div class="input-group">
                            <span class="input-group-text">🔒</span>
                            <input type="password" v-model="accountForm.password" class="form-control" id="teacherPassword" placeholder="请输入密码">
                        </div>
                    </div>
                    <!-- 重复密码 -->
                    <div class="col-sm-6">
                        <div class="input-group">
                            <span class="input-group-text">🔒</span>
                            <input type="password" v-model="accountForm.rePassword" class="form-control" id="confirmPassword" placeholder="请确认密码">
                        </div>
                    </div>
                </div>

                <!-- 姓名 和 性别 放在一行 -->
                <div class="row mb-3 align-items-center">
                    <!-- 姓名 -->
                    <div class="col-sm-6">
                        <div class="input-group">
                            <span class="input-group-text">👨‍🏫</span>
                            <input type="text" class="form-control" v-model="teacherForm.name" id="teacherName" placeholder="请输入姓名">
                        </div>
                    </div>
                    <!-- 性别 -->
                    <div class="col-sm-6">
                        <div class="input-group">
                            <span class="input-group-text">♂/♀</span>
                            <select class="form-select" id="teacherGender" v-model="teacherForm.gender">
                                <option value="">请选择性别</option>
                                <option value="男">男</option>
                                <option value="女">女</option>
                                <option value="保密">保密</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- 工号 和 院系 放在一行 -->
                <div class="row mb-3 align-items-center">
                    <!-- 工号 -->
                    <div class="col-sm-6">
                        <div class="input-group">
                            <span class="input-group-text">#</span>
                            <input type="text" v-model="teacherForm.teacher_id" class="form-control" id="teacherId" placeholder="请输入工号">
                        </div>
                    </div>
                    <!-- 院系 -->
                    <div class="col-sm-6">
                        <div class="input-group">
                            <span class="input-group-text">🏛</span>
                            <input type="text" class="form-control" v-model="teacherForm.department" id="department" placeholder="请输入院系">
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12" style="text-align: left; padding: 12px;">
                <button class="btn btn-primary" type="submit" style="width: 80px;" @click="submit">注册</button>
                <button class="btn" style="width: 80px;" @click="toLogin">去登录</button>

            </div>
        </div>
    </div>
</template>

<script setup>
const curIndex = ref(0)
const roles = ref([
    {
        name: "我是学生",
    },
    {
        name: "我是教师",
    },
])

const chooseRole = (index) => {
    curIndex.value = index
}

const router = useRouter()
const toLogin = () => {
    router.push('/login')
}

const accountForm = ref({
    username: '',
    password: '',
    rePassword: '',
    role: '',
})
const studentForm = ref({
    name: '',
    gender: '',
    grade: '',
    student_id: '',
    major: ''

})

const teacherForm = ref({
    name: '',
    gender: '',
    gender: "",
    teacher_id: "",
    department: ""
})

const { proxy } = getCurrentInstance()
const registerStudent = () => {
    accountForm.value.role = 'student'
    let form = {
        ...accountForm.value,
        ...studentForm.value
    }
    proxy.$api.register(form, 'student').then(res => {
        if (res.code == 20000) {
            router.push('/login')
        }
    })

}

const registerTeacher = () => {
    accountForm.value.role = 'teacher'
    let form = {
        ...accountForm.value,
        ...teacherForm.value
    }
    proxy.$api.register(form, 'teacher').then(res => {
        if (res.code == 20000) {
            router.push('/login')
        }
    })
}
const submit = () => {
    if (curIndex.value == 0) {
        registerStudent()
    } else if (curIndex.value == 1) {
        registerTeacher()
    }
}

</script>

<style scoped>
.nav-link {
    cursor: pointer;
}

.row {
    margin: 5px 0;
}
</style>