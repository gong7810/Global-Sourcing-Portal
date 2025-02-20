import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAdminStore = defineStore(
    'adminStore',
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
