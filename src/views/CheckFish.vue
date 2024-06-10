<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import api from '@/config/axios';
import { ElMessage } from 'element-plus';

interface ReviewStatus {
    id: number;
    user_id: number;
    image_url: string;
    fish_type_id: number;
    tags: string;
    is_approved: boolean;
    reviewed_by: string;
    reviewed_at: string;
    feedback: string;
    created_at: string;
}

export default defineComponent({
    name: 'ReviewStatus',
    setup() {
        const reviewStatuses = ref<ReviewStatus[]>([]);
        const loading = ref(false);
        const userStore = useUserStore();

        const pageSize = ref(10);
        const currentPageFish = ref(1);

        const fetchReviewStatuses = async () => {
            loading.value = true;
            try {
                const response = await api.post('/record/records/user', { id: userStore.user.id });
                reviewStatuses.value = response.data.records;
                loading.value = false;
            } catch (error) {
                ElMessage.error('加载审核状态失败');
            } finally {
                loading.value = false;
            }
        };

        const goBack = () => {
            window.history.back();
        };

        onMounted(() => {
            fetchReviewStatuses();
        });

        return {
            goBack,
            reviewStatuses,
            loading,
            pageSize,
            currentPageFish,
        };
    }
});
</script>

<template>
    <el-row class="limited-width-row">
        <el-col :span="24">
            <el-page-header content="审核状态" @back="goBack" />
        </el-col>
        <el-col :span="24">
            <el-table :data="reviewStatuses.slice((currentPageFish - 1) * pageSize, currentPageFish * pageSize)" v-loading="loading" style="width: 100%">
                <el-table-column prop="id" label="ID" width="50" />
                <el-table-column prop="image_url" label="图片">
                    <template #default="{ row }">
                        <el-image style="width: 60px; height: 60px" :src="row.image_url" fit="cover">
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="tags" label="标签" />
                <el-table-column prop="is_approved" label="审核状态">
                    <template #default="{ row }">
                        <el-tag :type="row.is_approved ? 'success' : 'warning'">
                            {{ row.is_approved ? '通过' : '未通过' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="reviewed_by" label="审核人" />
                <el-table-column prop="reviewed_at" label="审核时间" />
                <el-table-column prop="feedback" label="反馈" />
                <el-table-column prop="created_at" label="上传时间" />
            </el-table>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="reviewStatuses.length"
            :page-size="pageSize"
            @current-change="currentPageFish = $event"
          />
        </el-col>
    </el-row>
</template>

<style scoped>

.limited-width-row {
  max-width: 1000px; /* You can adjust the value as needed */
  margin: 0 auto; /* This will center the row horizontally */
}

.el-table .el-table-column--image {
    width: 60px;
    height: 60px;
}
</style>
