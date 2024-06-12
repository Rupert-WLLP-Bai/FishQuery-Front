<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
</script>

<template>
  <el-container>

    <el-container class="nav-container">
      <el-aside v-if="!$route.meta.hideNavbar">
        <NavBar></NavBar>
      </el-aside>

      <el-main>
        <RouterView />
      </el-main>
    </el-container>
  </el-container>

</template>

<style scoped>

.nav-container {
  margin-top: 50px;
}

</style>