<!-- 管理员页面 -->
<!-- 鱼的种类表 -->
<!-- 用户上传的图审核 -->
<!-- 用户搜索记录表 -->

<template>
  <div class="admin-home">
    <el-row>
      <el-col :span="24">
        <h1 style="text-align: center; font-size: 36px; margin: 20px 0;">管理员首页</h1>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-card>
          <h2>鱼类种类表</h2>
          <el-table :data="fishTypes.slice((currentPageFish - 1) * pageSize, currentPageFish * pageSize)" style="width: 100%">
            <el-table-column prop="id" label="ID" width="50" />
            <el-table-column prop="name_cn" label="中文名" width="100" />
            <el-table-column prop="name_latin" label="拉丁名" width="150" />
            <el-table-column prop="description" label="描述" />
          </el-table>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="fishTypes.length"
            :page-size="pageSize"
            @current-change="currentPageFish = $event"
          />
        </el-card>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-card>
          <h2>用户上传的图审核</h2>
          <el-table :data="pendingImages.slice((currentPageImage - 1) * pageSize, currentPageImage * pageSize)" style="width: 100%">
            <el-table-column prop="user_id" label="user_id" width="70" />
            <el-table-column prop="image" label="图片">
              <template v-slot="scope">
                <el-image :src="scope.row.image_url" style="width: 100px; height: 100px" fit="contain" />
              </template>
            </el-table-column>
            <el-table-column prop="tags" label="标签" />
            <el-table-column prop="is_approved" label="状态" />
            <el-table-column label="操作" width="200">
              <template v-slot="scope">
                <el-button @click="approveImage(scope.row.id)" type="success">通过</el-button>
                <el-button @click="rejectImage(scope.row.id)" type="danger">拒绝</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="pendingImages.length"
            :page-size="pageSize"
            @current-change="currentPageImage = $event"
          />
        </el-card>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-card>
          <h2>用户搜索记录表</h2>
          <el-table :data="searchRecords.slice((currentPageSearch - 1) * pageSize, currentPageSearch * pageSize)" style="width: 100%">
            <el-table-column prop="id" label="ID" width="50" />
            <el-table-column prop="user_id" label="用户ID" />
            <el-table-column prop="search_method" label="搜索类型" />
            <el-table-column prop="search_content" label="搜索内容" />
            <el-table-column prop="search_at" label="时间" />
          </el-table>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="searchRecords.length"
            :page-size="pageSize"
            @current-change="currentPageSearch = $event"
          />
        </el-card>
      </el-col>
    </el-row>

    <el-row>
      <el-card>
        <h2>上传鱼类</h2>
        <!-- 上传 name_cn, name_latin, description -->
        <el-input v-model="name_cn" placeholder="中文名" clearable />
        <el-input v-model="name_latin" placeholder="拉丁名" clearable />
        <el-input v-model="description" placeholder="描述" clearable />
        <el-button type="primary" @click="uploadFishType(name_cn, name_latin, description)">上传</el-button>
      </el-card>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import api from '@/config/axios';
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'AdminHome',
  setup() {
    const name_cn = ref('');
    const name_latin = ref('');
    const description = ref('');
    const userStore = useUserStore();
    const fishTypes = ref([]);
    const pendingImages = ref([]);
    const searchRecords = ref([]);

    const pageSize = ref(10);
    const currentPageFish = ref(1);
    const currentPageSearch = ref(1);
    const currentPageImage = ref(1);

    const fetchFishTypes = async () => {
      try {
        const response = await api.get('/pictures/fish_type');
        fishTypes.value = response.data.fish_types;
      } catch (error) {
        ElMessage.error('获取鱼类种类表失败');
      }
    };

    const fetchPendingImages = async () => {
      try {
        const response = await api.get('/record/records/pending');
        pendingImages.value = response.data.records;
      } catch (error) {
        ElMessage.error('获取待审核图片失败');
      }
    };

    const fetchSearchRecords = async () => {
      try {
        const response = await api.get('/record/search_history');
        searchRecords.value = response.data.search_history;
      } catch (error) {
        ElMessage.error('获取用户搜索记录失败');
      }
    };

    const approveImage = async (id: number) => {
      try {
        await api.post('/record/records/approve', { 'record_id': id, 'reviewed_by': userStore.user.id, 'feedback': 'Approved' });
        ElMessage.success('图片审核通过');
        fetchPendingImages();
      } catch (error) {
        ElMessage.error('图片审核失败');
      }
    };

    const rejectImage = async (id: number) => {
      try {
        await api.post('/record/records/reject', { 'record_id': id, 'reviewed_by': userStore.user.id, 'feedback': 'Rejected' });
        ElMessage.success('图片审核拒绝');
        fetchPendingImages();
      } catch (error) {
        ElMessage.error('图片审核失败');
      }
    };

    const uploadFishType = async (name_cn: string, name_latin: string, description: string) => {
      try {
        await api.post('/pictures/add_fish_type', { 'name_cn': name_cn, 'name_latin': name_latin, 'description': description });
        ElMessage.success('鱼类种类上传成功');
        fetchFishTypes();
      } catch (error) {
        ElMessage.error('鱼类种类上传失败');
      }
    };

    onMounted(() => {
      fetchFishTypes();
      fetchPendingImages();
      fetchSearchRecords();
    });

    return {
      fishTypes,
      pendingImages,
      searchRecords,
      approveImage,
      rejectImage,
      uploadFishType,
      name_cn,
      name_latin,
      description,
      pageSize,
      currentPageFish,
      currentPageSearch,
      currentPageImage,
    };
  }
});
</script>

<style scoped>
.admin-home {
  padding: 20px;
}

.el-card {
  margin-bottom: 20px;
}
</style>
