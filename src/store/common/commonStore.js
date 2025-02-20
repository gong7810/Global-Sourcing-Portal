import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCommonStore = defineStore(
    'commonStore',
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
