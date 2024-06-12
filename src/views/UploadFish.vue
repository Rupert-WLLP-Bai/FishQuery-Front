<script lang="ts">

import { defineComponent, ref } from 'vue';
import api from '@/config/axios';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import NavBar from '@/components/NavBar.vue'

export default defineComponent({
    name: 'UploadFish',
  components: {
    NavBar,
  },
    setup() {
        const name_latin = ref('');
        const tags = ref('');
        const image_file = ref<File | null>(null);
        const uploadStatus = ref('');
        const userStore = useUserStore();
        const router = useRouter();
        const uploadFish = async () => {
            if (!image_file.value) {
                ElMessage.error('请上传图片');
                return;
            }
            console.log('current user:', userStore.user)
            const data = {
                user_id: userStore.user.id,
                name_latin: name_latin.value,
                tags: tags.value,
            };

            const formData = new FormData();
            formData.append('image', image_file.value as File);
            formData.append('data', JSON.stringify(data));

            try {
                const response = await api.post('/pictures/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                uploadStatus.value = response.data;
                ElMessage.success('上传成功');
            } catch (error) {
                ElMessage.error('上传失败');
            }
        };

        const handleImageUpload = (event: Event) => {
            const target = event.target as HTMLInputElement;
            if (target.files) {
                image_file.value = target.files[0];
            }
        };

      const goBack = () => {
        router.push('/home');
      };

        return {
            goBack,
            tags,
            name_latin,
            uploadStatus,
            uploadFish,
            handleImageUpload
        };
    },
    mounted() {
    }
});
</script>

<template>
  <div class="upload-fish-container">
    <div class="upload-fish-card-container">
      <el-card class="upload-fish-card">
        <el-input v-model="name_latin" placeholder="鱼的拉丁名称或中文名称" clearable />
        <el-input v-model="tags" placeholder="标签 (逗号分隔)" clearable />
        <input type="file" @change="handleImageUpload" />
        <el-button type="primary" @click="uploadFish">上传</el-button>
        <!-- <p>{{ uploadStatus }}</p> -->
      </el-card>
    </div>
  </div>
</template>


<style scoped>

.upload-fish-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.9)), url('@/assets/cover.jpg');
}

.upload-fish-card-container {
  width: 400px;
}

.upload-fish-card {
  padding: 2rem;
  border-radius: 8px;
}
</style>
