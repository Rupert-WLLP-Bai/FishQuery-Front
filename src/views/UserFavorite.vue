<template>
    <div class="favorites-page">
        <el-row>
            <el-col :span="24">
                <el-page-header content="我的收藏夹" @back="goBack" />
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="24">
                <el-table :data="favorites.slice((currentPageFish - 1) * pageSize, currentPageFish * pageSize)" style="width: 100%">
                    <el-table-column prop="name_cn" label="中文名" />
                    <el-table-column prop="name_latin" label="拉丁名" />
                    <el-table-column label="缩略图">
                        <template #default="{ row }">
                            <el-image style="width: 100px; height: 100px" :src="row.image_url" fit="contain" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="tags" label="标签" />
                    <el-table-column prop="created_at" label="收藏时间" />
                  <el-table-column label="操作" width="200">
                    <template #default="{ row }">
                      <div class="operation-buttons">
                        <el-button type="danger" @click="removeFavorite(row.id)">删除</el-button>
                        <el-button type="primary" @click="downloadImage(row.image_url)">下载</el-button>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              <el-pagination
                background
                layout="prev, pager, next"
                :total="favorites.length"
                :page-size="pageSize"
                @current-change="currentPageFish = $event"
              />
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

        const pageSize = ref(10);
        const currentPageFish = ref(1);

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

      const downloadImage = (imageUrl: string) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.setAttribute('download', 'image.jpg');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
            downloadImage,
            pageSize,
            currentPageFish,
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
    max-width: 1200px;
    margin: 0 auto;
}



</style>