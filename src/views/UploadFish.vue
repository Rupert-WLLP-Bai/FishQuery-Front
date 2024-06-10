<script lang="ts">
import { defineComponent, ref } from 'vue';
import api from '@/config/axios';
import { useUserStore } from '@/stores/user';
import { ElMessage } from 'element-plus';

export default defineComponent({
    name: 'UploadFish',
    setup() {
        const name_latin = ref('');
        const tags = ref('');
        const image_file = ref<File | null>(null);
        const uploadStatus = ref('');
        const userStore = useUserStore();

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
            window.history.back();
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
    <el-row class="limited-width-row">
        <el-col :span="24">
            <el-page-header content="上传鱼类" @back="goBack" />
        </el-col>

        <el-col :span="24">
            <el-card>
                <el-input v-model="name_latin" placeholder="鱼的拉丁名称" clearable />
                <el-input v-model="tags" placeholder="标签 (逗号分隔)" clearable />
                <input type="file" @change="handleImageUpload" />
                <el-button type="primary" @click="uploadFish">上传</el-button>
                <!-- <p>{{ uploadStatus }}</p> -->
            </el-card>
        </el-col>
    </el-row>
</template>

<style scoped>

.limited-width-row {
  max-width: 400px; /* You can adjust the value as needed */
  margin: 0 auto; /* This will center the row horizontally */
}

.el-upload {
    margin-top: 20px;
}
</style>
