<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

export default defineComponent({
    name: 'UploadFish',
    setup() {
        const fishType = ref('');
        const tags = ref('');
        const imageBase64 = ref('');
        const uploadStatus = ref('');

        const handleImageUpload = (event: Event) => {
            const file = (event.target as HTMLInputElement).files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                imageBase64.value = e.target.result as string;
            };
            reader.readAsDataURL(file);
        };

        const uploadFish = async () => {
            try {
                await axios.post('/upload', { fishType: fishType.value, tags: tags.value, imageBase64: imageBase64.value });
                uploadStatus.value = '上传成功';
                ElMessage.success('上传成功');
            } catch (error) {
                uploadStatus.value = '上传失败';
                ElMessage.error('上传失败');
            }
        };

        return {
            fishType,
            tags,
            imageBase64,
            uploadStatus,
            handleImageUpload,
            uploadFish
        };

    }
});
</script>

<template>
    <el-row>
        <el-col :span="24">
            <h1> 上传鱼类 </h1>
            <button @click="this.$router.push('/home')">返回主页</button>
        </el-col>
    </el-row>

    <el-row :gutter="20">
        <el-col :span="12">
            <el-card>
                <h2>上传鱼类</h2>
                <el-input v-model="fishType" placeholder="鱼类类型" clearable />
                <el-input v-model="tags" placeholder="标签 (逗号分隔)" clearable />
                <el-upload :auto-upload="false" :on-change="handleImageUpload">
                    <el-button>上传图片</el-button>
                </el-upload>
                <el-button type="primary" @click="uploadFish">上传</el-button>
                <p>{{ uploadStatus }}</p>
            </el-card>
        </el-col>

        <el-col :span="12">
            <el-card>
                <h2>审核状态</h2>
                <!-- 此处可以添加审核状态的内容 -->
            </el-card>
        </el-col>
    </el-row>
</template>

<style scoped>
.el-upload {
    margin-top: 20px;
}
</style>
