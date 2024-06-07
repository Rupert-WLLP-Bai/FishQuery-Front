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

        return {
            tags,
            name_latin,
            uploadStatus,
            uploadFish,
            handleImageUpload
        };
    }
});
</script>

<template>
    <el-row>
        <el-col :span="24">
            <h1> 上传鱼类 </h1>
            <el-button @click="$router.push('/home')">返回主页</el-button>
        </el-col>
    </el-row>

    <el-row :gutter="20">
        <el-col :span="12">
            <el-card>
                <h2>上传鱼类</h2>
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
.el-upload {
    margin-top: 20px;
}
</style>
