<template>
    <div>
        <ol class="breadcrumb">
            <li v-if="isMyClass || isStudents" class="breadcrumb-item" :class="{ 'active': isMyClass }"
                :aria-current="isMyClass ? 'page' : null">
                <router-link v-if="!isMyClass" to="/myClass">我的班级</router-link>
                <span v-else>我的班级</span>
            </li>
            <li v-if="isStudents" class="breadcrumb-item active" aria-current="page">
                当前班级学生
            </li>
        </ol>
        <router-view></router-view>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute()
 

const isMyClass = computed(()=> route.path == '/myClass')
const isStudents = computed(()=> route.path == '/classStudents')

</script>