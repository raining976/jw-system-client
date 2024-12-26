<script setup>

</script>

<template>
   <el-container>
      <el-header class="headerContainer">
        <jwNav/>
      </el-header>
      <el-main class="mainContainer"><router-view></router-view></el-main>
    </el-container>
</template>

<style scoped>

.headerContainer{
  height: 60px;
  padding: 0;
}
.mainContainer{
  height: calc(100vh - 60px);
}
</style>
