<template>
    <h3>{{ curTitle }}</h3>
    <router-view></router-view>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()

const curTitle = computed(() => {
    return route.meta.title
})

</script>