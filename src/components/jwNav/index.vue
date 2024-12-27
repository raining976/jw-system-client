<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid" v-show="isShow">
            <router-link to="/" class="navbar-brand">教务系统</router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item" v-for="item in filteredNavList" :key="item.url">
                        <router-link class="nav-link" :class="{ active: route.path === item.url }" aria-current="page"
                            :to="item.url">
                            {{ item.name }}
                        </router-link>
                    </li>
                </ul>
            </div>
            <!-- 用户信息和退出登录 -->
            <div class="dropdown ms-auto" style="padding: 0 30px;" v-if="userStore.isLoggedIn">
                <span class="dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown"
                    aria-expanded="false">
                    Hi~, {{ userStore.username }}
                </span>
                <ul class="dropdown-menu" aria-labelledby="userDropdown">
                    <li><a class="dropdown-item" href="#" @click="userStore.logout()">退出登录</a></li>
                </ul>
            </div>
        </div>
        <div class="container-fluid" v-show="!isShow">
            <router-link to="/" class="navbar-brand">教务系统</router-link>
        </div>
    </nav>
</template>
<script setup>

import { useUserStore } from '../../store/modules/user';
const userStore = useUserStore()
// 用户角色（可以从用户信息中获取，示例中使用固定值）
const role = ref('student'); // student, teacher, admin

// 导航项列表，包含哪些角色能看到该项
const navList = ref([
    {
        name: '选课列表', // 老师不显示
        url: '/scourse',
        roles: ['admin', 'student'] // 设定哪些角色可以看到
    },
    {
        name: '我的课程', // 对学生：当前选的课和成绩 对老师不显示
        url: '/myCourse',
        roles: ['student', 'admin']
    },
    {
        name: '我的班级', // 对老师，当前选择他班级的学生，对学生不显示
        url: '/myClass',
        roles: ['teacher', 'admin']
    },
    {
        name: '个人信息', // 都显示
        url: '/myInfo',
        roles: ['student', 'teacher', 'admin']
    },
    {
        name: '我的通知', // 对老师和学生和管理员同时显示，表示当前调课通知
        url: '/notice',
        roles: ['student', 'teacher', 'admin']
    },
    {
        name: '课程列表', // 只对管理员显示
        url: '/courseList',
        roles: ['admin']
    },
    {
        name: '用户列表', // 只对管理员显示
        url: '/users',
        roles: ['admin']
    }
]);

// 计算属性：过滤出当前角色可以访问的导航项
const filteredNavList = computed(() => {
    return navList.value.filter(item => item.roles.includes(userStore.role));
});
import { useRoute } from 'vue-router'
const route = useRoute()
const isShow = computed(() => {
    return !(route.name == 'login' || route.name == 'register' || route.name == '404page')
})


</script>
<style>
.el-row {
    margin-bottom: 20px;
}

.el-row:last-child {
    margin-bottom: 0;
}

.el-col {
    border-radius: 4px;
}

.grid-content {
    border-radius: 4px;
    min-height: 36px;
}

.active {
    /* border-bottom: 2px solid black !important; */
}
</style>