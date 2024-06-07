<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useUserStore } from '@/stores/user';
import api from '@/config/axios';
import FavoriteModal from '@/components/FavoriteModal.vue';
import { ElMessage } from 'element-plus';

export default defineComponent({
    name: 'UserHome',
    components: {
        FavoriteModal
    },
    setup() {
        const userStore = useUserStore();
        const searchMode = ref('');
        const searchResults = ref([]);
        const searchQuery = ref('');
        const imageBase64 = ref('');
        const tags = ref('');
        const category = ref('');
        const matchingCount = ref(10);
        const showFavorites = ref(false);

        const searchByText = async () => {
            try {
                const response = await api.get('/pictures/name_search',
                    { params: { user_id: userStore.user.id, name: searchQuery.value, count: matchingCount.value } });
                searchResults.value = response.data.fish_list;
            } catch (error) {
                ElMessage.error('搜索失败');
            }
        };

        const searchByImage = async () => {
            try {
                const response = await axios.post('/search/by-image', { imageBase64: imageBase64.value, count: matchingCount.value });
                searchResults.value = response.data;
            } catch (error) {
                ElMessage.error('搜索失败');
            }
        };

        const searchByTag = async () => {
            try {
                const response = await axios.post('/search/by-tag', { tags: tags.value, count: matchingCount.value });
                searchResults.value = response.data;
            } catch (error) {
                ElMessage.error('搜索失败');
            }
        };

        const searchByCategory = async () => {
            try {
                const response = await axios.post('/search/by-category', { category: category.value, count: matchingCount.value });
                searchResults.value = response.data;
            } catch (error) {
                ElMessage.error('搜索失败');
            }
        };

        const handleImageUpload = (event: Event) => {
            const file = (event.target as HTMLInputElement).files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                imageBase64.value = e.target.result as string;
            };
            reader.readAsDataURL(file);
        };

        return {
            user: userStore.user,
            favorites: userStore.favorites,
            searchMode,
            searchResults,
            searchQuery,
            imageBase64,
            tags,
            category,
            matchingCount,
            searchByText,
            searchByImage,
            searchByTag,
            searchByCategory,
            handleImageUpload,
            showFavorites
        };
    },
    mounted() {
        console.log('UserHome mounted');
    }
});
</script>

<template>
    <div class="user-home">
        <el-row>
            <el-col :span="24">
                <h1> 用户首页 </h1>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="8">
                <el-card>
                    <p>欢迎, {{ user.username }}!</p>
                    <el-button type="primary" @click="showFavorites = true">查看收藏夹</el-button>
                    <el-button type="success" @click="$router.push('/upload')">上传鱼类</el-button>
                    <el-button type="warning" @click="$router.push('/check')">审核状态</el-button>
                </el-card>
            </el-col>

            <el-col :span="8">
                <el-card>
                    <h2>搜索鱼类</h2>
                    <el-button-group>
                        <el-button @click="searchMode = 'text'">通过文本搜索</el-button>
                        <el-button @click="searchMode = 'image'">通过图片搜索</el-button>
                        <el-button @click="searchMode = 'tag'">通过标签搜索</el-button>
                    </el-button-group>

                    <div v-if="searchMode === 'text'" class="search-by-text">
                        <el-input v-model="searchQuery" placeholder="搜索鱼名或标签" clearable />
                        <el-input-number v-model="matchingCount" :min="1" placeholder="匹配图片数量" />
                        <el-button type="primary" @click="searchByText">搜索</el-button>
                    </div>

                    <div v-if="searchMode === 'image'" class="search-by-upload">
                        <el-upload :auto-upload="false" :on-change="handleImageUpload">
                            <el-button>上传图片</el-button>
                        </el-upload>
                        <el-input-number v-model="matchingCount" :min="1" placeholder="匹配图片数量" />
                        <el-button type="primary" @click="searchByImage">通过图片搜索</el-button>
                    </div>

                    <div v-if="searchMode === 'tag'" class="search-by-tag">
                        <el-input v-model="tags" placeholder="标签 (逗号分隔)" clearable />
                        <el-input-number v-model="matchingCount" :min="1" placeholder="匹配图片数量" />
                        <el-button type="primary" @click="searchByTag">通过标签搜索</el-button>
                    </div>
                </el-card>
            </el-col>

            <el-col :span="8">
                <el-card>
                    <h2>搜索结果</h2>
                    <div v-if="searchResults.length === 0">暂无搜索结果</div>
                    <el-table :data="searchResults" v-else>
                        <el-table-column prop="name_cn" label="中文名"></el-table-column>
                        <el-table-column prop="name_latin" label="拉丁名"></el-table-column>
                        <el-table-column prop="tags" label="标签"></el-table-column>
                        <el-table-column prop="image_url" label="图片">
                            <template #default="{ row }">
                                <img :src="row.image_url" alt="鱼类图片" style="width: 100px; height: 100px;" />
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>

        <FavoriteModal v-if="showFavorites" @close="showFavorites = false" />
    </div>
</template>

<style scoped>
.user-home {
    padding: 20px;
}

.search-by-text,
.search-by-upload,
.search-by-tag,
.search-by-category {
    margin-top: 20px;
}
</style>
