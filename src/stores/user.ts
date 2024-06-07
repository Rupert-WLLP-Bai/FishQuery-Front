import { defineStore } from 'pinia';
import api from '@/config/axios';

export const useUserStore = defineStore('user', {
    state: () => ({
        user: {
        },
        favorites: [],
    }),
    actions: {
        setUser(user) {
            this.user = user;
        },
    },
});
