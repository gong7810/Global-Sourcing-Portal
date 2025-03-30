<script setup>
import { ref } from 'vue';

const menuItems = ref([
    { label: '사용자 관리', icon: 'pi pi-users', to: '/admin/users' },
    { label: '기업회원 신청', icon: 'pi pi-briefcase', to: '/admin/businessApplications' },
    { label: 'FAQ 관리', icon: 'pi pi-question-circle', to: '/admin/faq' },
    { label: '문의하기 관리', icon: 'pi pi-comments', to: '/admin/inquiries' }
]);
</script>

<template>
    <div class="admin-sidebar">
        <ul class="menu-list">
            <li v-for="item in menuItems" :key="item.label" class="menu-item">
                <router-link :to="item.to" class="menu-link" v-slot="{ isActive }">
                    <div :class="['menu-link-content', { 'active': isActive }]">
                        <i :class="[item.icon, 'text-xl']"></i>
                        <span>{{ item.label }}</span>
                    </div>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
.admin-sidebar {
    width: 250px;
    background-color: white;
    border-right: 1px solid #e5e7eb;
    padding: 1.5rem 1rem;
    padding-top: 2rem;

    .menu-list {
        list-style: none;
        padding: 0;
        margin: 0;

        .menu-item {
            margin: 0.5rem 0;

            .menu-link {
                text-decoration: none;
                
                .menu-link-content {
                    display: flex;
                    align-items: center;
                    padding: 0.75rem 1rem;
                    color: #4b5563;
                    border-radius: 8px;
                    transition: all 0.3s;

                    i {
                        margin-right: 0.75rem;
                    }

                    &:hover {
                        background-color: #f3f4f6;
                        color: #8B8BF5;
                    }

                    &.active {
                        background-color: #8B8BF5;
                        color: white;
                    }
                }
            }
        }
    }
}
</style> 