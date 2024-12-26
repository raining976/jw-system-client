<template>
    <div class="card text-center">
        <div class="card-header">
            <ul class="nav nav-tabs card-header-tabs">
                <li class="nav-item" v-for="(item, index) in tabList" :key="index" @click="curI = index">
                    <router-link class="nav-link" :class="{ active: curI == index }"
                        :aria-current="curI == index" :to="item.link">{{ item.label }}</router-link>
                </li>
            </ul>
        </div>
        <div class="card-body">
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup>

const curI = ref(0)
const tabList = ref([
    {
        label:"学生列表",
        link:'/students',
    },
    {
        label:"老师列表",
        link:'/teachers',
    }
])


</script>

<style scoped>
.card{
    padding: 15px;
}

</style>