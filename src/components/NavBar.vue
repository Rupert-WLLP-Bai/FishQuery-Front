<template>
  <div class="nav-container">
    <el-menu
      class="el-menu-demo"
      :default-active="activeIndex"
      @select="handleSelect">
      <el-menu-item index="0" @click="$router.push('/home')">
        <i class="el-icon-star-off"></i>
        <span>搜索</span>
      </el-menu-item>
      <el-menu-item index="1" @click="$router.push('/favorite')">
        <i class="el-icon-star-off"></i>
        <span>查看收藏夹</span>
      </el-menu-item>
      <el-menu-item index="2" @click="$router.push('/upload')">
        <i class="el-icon-upload"></i>
        <span>上传鱼类</span>
      </el-menu-item>
      <el-menu-item index="3" @click="$router.push('/check')">
        <i class="el-icon-check"></i>
        <span>审核状态</span>
      </el-menu-item>
      <el-menu-item v-if="1" index="4" @click="logout">
        <i class="el-icon-switch-button"></i>
        <span>登出</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'NavBar',
  setup() {
    const userStore = useUserStore();
    const activeIndex = ref('1');
    const router = useRouter();

    const handleSelect = (key: string, keyPath: string[]) => {
      activeIndex.value = key;
    };

    const logout = () => {
      userStore.setUser(null);
      ElMessage.success('已登出');
      router.push('/login');
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
.nav-container {
  display: flex;
  justify-content: center;
  height: 50vh;
}

.el-menu-demo {
  background-color: #304156;
  color: #fff;
  border-right: none;
  width: 200px;
  text-align: left;
}

.el-menu-item.is-active {
  background-color: #409EFF !important;
  color: #fff !important;
}

.el-menu-item {
  color: #fff;
}

.el-menu-item:hover {
  background-color: #1f2d3d !important;
}

.el-menu-item i {
  margin-right: 5px;
}
</style>
