<script setup>
import { ref } from 'vue'

const menuItems = ref([
    { label: '대시보드', icon: 'pi pi-home', to: '/admin' },
    { label: '사용자 관리', icon: 'pi pi-users', to: '/admin/users' },
    { label: '설정', icon: 'pi pi-cog', to: '/admin/settings' }
])
</script>

<template>
    <div class="admin-layout">
        <!-- 사이드바 -->
        <div class="admin-sidebar">
            <div class="logo">
                <h2>관리자 페이지</h2>
            </div>
            <ul class="menu-list">
                <li v-for="item in menuItems" :key="item.label" class="menu-item">
                    <router-link :to="item.to" class="menu-link">
                        <i :class="item.icon"></i>
                        <span>{{ item.label }}</span>
                    </router-link>
                </li>
            </ul>
        </div>

        <!-- 메인 컨텐츠 -->
        <div class="admin-content">
            <header class="admin-header">
                <div class="header-content">
                    <h1>관리자 대시보드</h1>
                    <div class="user-info">
                        <span>관리자</span>
                    </div>
                </div>
            </header>
            
            <main class="admin-main">
                <div class="dashboard-cards">
                    <div class="card">
                        <h3>총 사용자</h3>
                        <p>0명</p>
                    </div>
                    <div class="card">
                        <h3>오늘의 방문자</h3>
                        <p>0명</p>
                    </div>
                    <div class="card">
                        <h3>신규 가입자</h3>
                        <p>0명</p>
                    </div>
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
    background-color: #2c3e50;
    color: white;
    padding: 1rem;

    .logo {
        padding: 1rem 0;
        text-align: center;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .menu-list {
        list-style: none;
        padding: 0;
        margin: 1rem 0;

        .menu-item {
            margin: 0.5rem 0;

            .menu-link {
                display: flex;
                align-items: center;
                padding: 0.75rem 1rem;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                transition: background-color 0.3s;

                &:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                }

                i {
                    margin-right: 0.5rem;
                }
            }
        }
    }
}

.admin-content {
    flex: 1;
    background-color: #f5f6fa;
}

.admin-header {
    background-color: white;
    padding: 1rem 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

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
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;

    .card {
        background-color: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

        h3 {
            margin: 0;
            color: #2c3e50;
            font-size: 1rem;
        }

        p {
            margin: 0.5rem 0 0;
            font-size: 1.5rem;
            font-weight: bold;
            color: #3498db;
        }
    }
}
</style>
