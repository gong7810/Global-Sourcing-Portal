import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore(
    'userStore',
    () => {
        const user = ref('');

        return {
            user
        };
    },
    {
        persist: {
            enabled: true,
            strategies: [{ storage: sessionStorage }]
        }
    }
);
