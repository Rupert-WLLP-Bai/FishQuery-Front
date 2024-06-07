<script lang="ts">
import { defineComponent } from 'vue';
import { useUserStore } from '@/stores/user';

export default defineComponent({
    name: 'FavoriteModal',
    setup() {
        const userStore = useUserStore();
        return {
            favorites: userStore.favorites
        };
    },
    methods: {
        close() {
            this.$emit('close');
        }
    }
});
</script>

<template>
    <div class="modal-overlay">
        <div class="modal">
            <h2>收藏夹</h2>
            <ul>
                <li v-for="fish in favorites" :key="fish.fishId">{{ fish.name }}</li>
            </ul>
            <button @click="close">关闭</button>
        </div>
    </div>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 300px;
    max-height: 80%;
    overflow-y: auto;
}
</style>
