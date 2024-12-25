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
                    <li class="nav-item" v-for="item in navList">
                        <router-link class="nav-link active" aria-current="page" :to="item.url">
                            {{ item.name }}
                        </router-link>
                    </li>

                </ul>
            </div>
        </div>
        <div class="container-fluid" v-show="!isShow">
            <router-link to="/" class="navbar-brand">教务系统</router-link>
        </div>
    </nav>
</template>
<script setup>

const navList = ref([
    {
        name: "课程列表",
        url: "/courseList",
    },
    {
        name: "我的课程",
        url: "/myCourse",
    },
    {
        name: "我的成绩",
        url: "/score",
    },
    {
        name: "我的通知",
        url: "/notice"
    },
    {
        name: "个人信息",
        url: "/myInfo",
    }
])
import { useRoute } from 'vue-router'
const route = useRoute()
const isShow = computed(() => {
    console.log('route.name', route.name == 'login')
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
</style>