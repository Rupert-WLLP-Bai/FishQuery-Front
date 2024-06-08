<template>
    <div class="favorites-page">
        <el-row>
            <el-col :span="24">
                <el-page-header content="我的收藏夹" @back="goBack" />
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="24">
                <el-table :data="favorites" style="width: 100%">
                    <el-table-column prop="name_cn" label="中文名" />
                    <el-table-column prop="name_latin" label="拉丁名" />
                    <el-table-column label="缩略图">
                        <template #default="{ row }">
                            <el-image style="width: 60px; height: 60px" :src="row.image_url" fit="cover" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="tags" label="标签" />
                    <el-table-column prop="created_at" label="收藏时间" />
                    <el-table-column label="操作">
                        <template #default="{ row }">
                            <el-button type="danger" @click="removeFavorite(row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useUserStore } from '@/stores/user';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import api from '@/config/axios';

export default defineComponent({
    name: 'FavoritesPage',
    setup() {
        const favorites = ref([]);

        const userStore = useUserStore();

        const removeFavorite = async (favoriteId: number) => {
            try {
                await api.delete('/favorites/favorite',
                    { params: { favorite_id: favoriteId } });
                fetchFavorites();
                ElMessage.success('删除成功');
            } catch (error) {
                ElMessage.error('删除失败');
            }
        };

        const fetchFavorites = async () => {
            try {
                const response = await api.get('/favorites',
                    { params: { user_id: userStore.user.id } });
                favorites.value = response.data.favorites;

            } catch (error) {
                ElMessage.error('加载收藏夹失败');
            }
        };

        const goBack = () => {
            window.history.back();
        };

        return {
            favorites,
            removeFavorite,
            fetchFavorites,
            goBack
        };
    },
    mounted() {
        this.fetchFavorites();
    }
});
</script>

<style scoped>
.favorites-page {
    padding: 20px;
}
</style>