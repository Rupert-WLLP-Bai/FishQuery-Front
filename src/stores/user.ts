import { defineStore } from 'pinia';
import api from '@/config/axios';


export const useUserStore = defineStore('user', {
    state: () => ({
        user: {
            'created_at': null,
            'email': null,
            'id': null,
            'role': null,
            'username': null
        },
        favorites: [],
    }),
    actions: {
        setUser(user) {
            this.user = user;
        },
        setFavorites(favorites) {
            this.favorites = favorites;
        }
    },
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'user',
                storage: localStorage
            }
        ]
    }
});
