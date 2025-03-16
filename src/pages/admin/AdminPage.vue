<script setup>
import { ref } from 'vue'

const menuItems = ref([
    { label: '사용자 관리', icon: 'pi pi-users', to: '/admin/users' },
    { label: 'FAQ 관리', icon: 'pi pi-question-circle', to: '/admin/faq' }
    // { label: '대시보드', icon: 'pi pi-home', to: '/admin' },
    // { label: '설정', icon: 'pi pi-cog', to: '/admin/settings' }
])
</script>

<template>
    <div class="admin-layout">
        <!-- 사이드바 -->
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

        <!-- 메인 컨텐츠 -->
        <div class="admin-content">
            <header class="admin-header">
                <div class="header-content">
                    <div class="flex items-center gap-2">
                        <i class="pi pi-shield text-[#8B8BF5] text-2xl"></i>
                        <h1 class="text-xl font-bold text-gray-800">관리자 페이지</h1>
                    </div>
                    <div class="user-info">
                        <span class="text-gray-600">관리자</span>
                        <i class="pi pi-user ml-2 text-gray-600"></i>
                    </div>
                </div>
            </header>
            
            <main class="admin-main">
                <div class="dashboard-cards">
                    <router-link to="/admin/users" class="card">
                        <div class="card-content">
                            <i class="pi pi-users text-[#8B8BF5] text-4xl"></i>
                            <div class="card-text">
                                <h3>사용자 관리</h3>
                                <p class="text-gray-600">사용자 목록 및 관리</p>
                            </div>
                        </div>
                    </router-link>
                    <router-link to="/admin/faq" class="card">
                        <div class="card-content">
                            <i class="pi pi-question-circle text-[#8B8BF5] text-4xl"></i>
                            <div class="card-text">
                                <h3>FAQ 관리</h3>
                                <p class="text-gray-600">자주 묻는 질문 관리</p>
                            </div>
                        </div>
                    </router-link>
                </div>
            </main>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.admin-layout {
    display: flex;
    min-height: 100vh;
}

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

.admin-content {
    flex: 1;
    background-color: #f9fafb;
}

.admin-header {
    background-color: white;
    padding: 1rem 2rem;
    border-bottom: 1px solid #e5e7eb;

    .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}

.admin-main {
    padding: 2rem;
}

.dashboard-cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    margin-top: 1rem;

    .card {
        background-color: white;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        transition: all 0.3s;
        text-decoration: none;
        height: 200px;
        
        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .card-content {
            height: 100%;
            padding: 2rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1.5rem;

            .card-text {
                text-align: center;

                h3 {
                    margin: 0;
                    color: #1f2937;
                    font-size: 1.25rem;
                    font-weight: bold;
                    margin-bottom: 0.5rem;
                }

                p {
                    margin: 0;
                    font-size: 0.875rem;
                }
            }
        }
    }
}
</style>
