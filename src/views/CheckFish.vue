<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useUserStore } from '@/stores/user';
import axios from 'axios';

export default defineComponent({
    name: 'CheckFish',
    setup() {
        const userStore = useUserStore();
        const uploads = ref([]);

        // const fetchUploads = async () => {
        //     const response = await axios.get(`/uploads/${userStore.user.user_id}`);
        //     uploads.value = response.data;
        // };

        // fetchUploads();

        return {
            uploads
        };
    }
});
</script>

<template>
    <div class="check-fish">
        <h1>审核状态</h1>
        <ul>
            <li v-for="upload in uploads" :key="upload.uploadId">
                <p>{{ upload.fishType }} - {{ upload.tags }}</p>
                <p>状态: {{ upload.status }}</p>
                <p>反馈: {{ upload.feedback }}</p>
            </li>
        </ul>
    </div>
    <div>
        <button @click="this.$router.push('/home')">返回主页</button>
    </div>
</template>

<style scoped>
.check-fish {
    padding: 20px;
}

.check-fish ul {
    list-style: none;
    padding: 0;
}

.check-fish li {
    margin-bottom: 20px;
    border-bottom: 1px solid #ccc;
    padding-bottom: 10px;
}
</style>
