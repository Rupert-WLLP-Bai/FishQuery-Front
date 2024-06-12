<template>
  <el-menu
    class="el-menu-demo"
    :default-active="activeIndex"
    @select="handleSelect">
    <el-menu-item index="1" @click="$router.push('/favorite')">查看收藏夹</el-menu-item>
    <el-menu-item index="2" @click="$router.push('/upload')">上传鱼类</el-menu-item>
    <el-menu-item index="3" @click="$router.push('/check')">审核状态</el-menu-item>
    <el-menu-item index="4" @click="logout">登出</el-menu-item>
  </el-menu>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'NavBar',
  setup() {
    const userStore = useUserStore();
    const activeIndex = ref('1');

    const handleSelect = (key: string, keyPath: string[]) => {
      activeIndex.value = key;
    };

    const logout = () => {
      userStore.setUser(null);
      ElMessage.success('已登出');
      this.$router.push('/login');
    };

    return {
      activeIndex,
      handleSelect,
      logout,
    };
  },
});
</script>

<style scoped>

</style>
