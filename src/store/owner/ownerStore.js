import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useOwnerStore = defineStore(
    'ownerStore',
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
