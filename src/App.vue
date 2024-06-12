<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
</script>

<template>
  <el-container>
    <el-header>
      用户首页
    </el-header>

    <el-container>
      <el-aside>
        <NavBar></NavBar>
      </el-aside>

      <el-main>
        <RouterView />
      </el-main>
    </el-container>
  </el-container>

</template>
