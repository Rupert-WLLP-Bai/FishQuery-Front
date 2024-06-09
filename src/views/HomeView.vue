<script setup lang="ts">

</script>

<template>
  <div class="cover-page">
    <div class="cover-content">
      <h1>欢迎来到鱼类搜索系统!</h1>
      <p class="small-text">Welcome to our website!</p>

      <el-button type="primary" @click="goToLogin">立即登录</el-button>
    </div>
  </div>
  <main>
    <RouterView />
  </main>
</template>


<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>

app {
  font-weight: normal;
  max-width: 1280px;
  padding: 2rem;
}

.cover-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7)), url('@/assets/cover.jpg');

}

.cover-content {
  text-align: center;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.cover-content h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.cover-content p {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}


.cover-content p.small-text {
  font-size: 1rem;
  margin-top: 0.5rem;
}

.cover-content .el-button {
  font-size: 1.5rem;
  padding: 16px 40px;
  border-radius: 8px;
  background-color: #409EFF;
  border-color: #409EFF;
}

.cover-content .el-button:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

</style>