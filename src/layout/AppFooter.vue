<script setup>
    const currentYear = new Date().getFullYear();
</script>

<template>
    <div class="mt-12 border-t border-gray-200 bg-gray-50">
        <div class="max-w-[1200px] mx-auto px-4 py-6">
            <div class="mb-6">
                <h2 class="text-lg font-bold mb-2">ONOP</h2>
                <div class="text-gray-600 text-sm space-y-1">
                    <p>대표이사: 김세영</p>
                    <p>사업자 등록번호: 264-88-02522</p>
                    <p>주소: 경상남도 진주시 동부로169번길 12, B-1610(윙스타워)</p>
                    <p>고객센터: 070-8211-3394</p>
                    <p>이메일: jjkim@pbnt.kr</p>
                    <!-- <p>직업정보제공사업:</p>
                    <p class="pb-3 border-b border-gray-200">통신판매업:</p> -->
                </div>
                <p class="text-gray-500 text-sm mt-4">© {{ currentYear }} ONOP. All rights reserved.</p>
            </div>

            <div class="flex gap-6 text-sm">
                <router-link to="/policy/privacy" class="text-blue-900 font-medium">개인정보처리방침</router-link>
                <router-link to="/policy/terms" class="text-gray-600">이용약관</router-link>
                <!-- <router-link to="/policy/rules" class="text-gray-600">이용자 준수사항</router-link> -->
            </div>
        </div>
    </div>
</template>

<style scoped>
.mt-12.border-t.border-gray-200.bg-gray-50 {
    background-color: #f1f5f9;
}
</style>
