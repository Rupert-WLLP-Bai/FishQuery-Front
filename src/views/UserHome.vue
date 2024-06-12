<template>
  <div class="user-home">
    <el-container>
      <el-container>
        <el-main>
          <div class="main">
            <el-row :gutter="20">
              <!-- 搜索方式 -->
              <el-col :span="8">
                <el-card>
                  <h2>搜索鱼类</h2>
                  <el-button-group style="margin-bottom: 20px;">
                    <el-button @click="searchMode = 'text'">通过文本搜索</el-button>
                    <el-button @click="searchMode = 'image'">通过图片搜索</el-button>
                    <el-button @click="searchMode = 'tag'">通过标签搜索</el-button>
                  </el-button-group>

                  <div v-if="searchMode === 'text'" class="search-by-text">
                    <el-input v-model="searchQuery" placeholder="搜索鱼名" clearable style="width: 100%;" />
                    <el-input-number v-model="matchingCount" :min="1" placeholder="匹配图片数量" style="width: 100%;" />
                    <el-button type="primary" @click="searchByText">搜索</el-button>
                  </div>

                  <div v-if="searchMode === 'image'" class="search-by-upload">
                    <input type="file" @change="handleImageUpload" />
                    <el-input-number v-model="matchingCount" :min="1" placeholder="匹配图片数量" style="width: 100%;" />
                    <el-button type="primary" @click="searchByImage">通过图片搜索</el-button>
                  </div>

                  <div v-if="searchMode === 'tag'" class="search-by-tag">
                    <el-input v-model="tags" placeholder="标签" clearable style="width: 100%;" />
                    <el-input-number v-model="matchingCount" :min="1" placeholder="匹配图片数量" style="width: 100%;" />
                    <el-button type="primary" @click="searchByTag">通过标签搜索</el-button>
                  </div>
                </el-card>
              </el-col>

              <!-- 搜索结果 -->
              <el-col :span="16">
                <el-card>
                  <h2>搜索结果</h2>
                  <div v-if="searchResults.length === 0" class="empty-results">暂无搜索结果</div>
                  <el-table v-else :data="searchResults.slice((currentPageFish - 1) * pageSize, currentPageFish * pageSize)">
                    <el-table-column prop="name_cn" label="中文名"></el-table-column>
                    <el-table-column prop="name_latin" label="拉丁名"></el-table-column>
                    <el-table-column prop="tags" label="标签"></el-table-column>
                    <el-table-column label="图片">
                      <template #default="{ row }">
                        <el-image style="width: 100px; height: 100px" :src="row.image_url" fit="contain" />
                      </template>
                    </el-table-column>
                    <el-table-column label="操作">
                      <template #default="{ row }">
                        <el-button type="primary" @click="addToFavorites(row)">加入收藏夹</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="searchResults.length"
                    :page-size="pageSize"
                    @current-change="currentPageFish = $event"
                  />
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useUserStore } from '@/stores/user';
import api from '@/config/axios';
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'UserHome',
  setup() {
    const userStore = useUserStore();
    const searchMode = ref('');
    const searchResults = ref([]);
    const searchQuery = ref('');
    const image_file = ref<File | null>(null);
    const tags = ref('');
    const category = ref('');
    const matchingCount = ref(10);
    const pageSize = ref(10);
    const currentPageFish = ref(1);

    const searchByText = async () => {
      try {
        const response = await api.get('/pictures/name_search', {
          params: { user_id: userStore.user.id, name: searchQuery.value, count: matchingCount.value }
        });
        searchResults.value = response.data.fish_list;
      } catch (error) {
        ElMessage.error('搜索失败');
      }
    };

    const searchByImage = async () => {
      try {
        if (!image_file.value) {
          ElMessage.error('请上传图片');
          return;
        }
        const data = {
          user_id: userStore.user.id,
          count: matchingCount.value,
        }
        const formData = new FormData();
        formData.append('image', image_file.value as File);
        formData.append('data', JSON.stringify(data));
        const response = await api.post('/pictures/picture_search', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        searchResults.value = response.data.fish_list;
      } catch (error) {
        ElMessage.error('搜索失败');
      }
    };

    const searchByTag = async () => {
      try {
        const response = await api.get('/pictures/keyword_search', {
          params: { user_id: userStore.user.id, keyword: tags.value, count: matchingCount.value }
        });
        searchResults.value = response.data.fish_list;
      } catch (error) {
        ElMessage.error('搜索失败');
      }
    };

    const handleImageUpload = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files) {
        image_file.value = target.files[0];
      }
    };

    const addToFavorites = async (fish: any) => {
      try {
        const response = await api.post('/favorites/', {
          user_id: userStore.user.id,
          fish_id: fish.id
        });
        if (response.data.success) {
          ElMessage.success('已加入收藏夹');
        } else {
          ElMessage.error('加入收藏夹失败');
        }
      } catch (error) {
        ElMessage.error('加入收藏夹失败');
      }
    };

    return {
      userStore,
      searchMode,
      searchResults,
      searchQuery,
      image_file,
      tags,
      category,
      matchingCount,
      searchByText,
      searchByImage,
      searchByTag,
      handleImageUpload,
      addToFavorites,
      pageSize,
      currentPageFish,
    };
  },
});
</script>

<style scoped>
body, html {
  height: 100%;
  margin: 0;
  padding: 0;
}

.user-home {
  width: 100%;
  margin: 0 auto;
  padding: 20px;
}

.search-by-text,
.search-by-upload,
.search-by-tag {
  margin-top: 20px;
}

.empty-results {
  text-align: center;
  color: #999;
  font-size: 16px;
}

.el-table .el-table-column--image {
  width: 100px;
  height: 100px;
}

.main {
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
