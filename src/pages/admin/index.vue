<template>
  <!-- 관리자 권한이 있을 때만 Home 컴포넌트 렌더링 -->
  <div v-if="isChecking">로딩 중...</div>
  <Home v-if="isAdmin" />
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAdminAuthStore } from 'src/stores/adminAuth';
import Home from './adminHome.vue';
import { ref, computed } from 'vue';

// Pinia 스토어와 라우터 사용
const router = useRouter();
const adminAuthStore = useAdminAuthStore();
const isChecking = ref(true); // 로딩 상태 표시
// 관리자 권한 확인
const isAdmin = computed(() => adminAuthStore.role === 'admin');

// 페이지 로드 시 권한 확인
if (!adminAuthStore.isAuthenticated || adminAuthStore.role !== 'admin') {
  // 관리자가 아니거나 로그인하지 않았을 경우 로그인 페이지로 리디렉션
  router.push('/admin/adminLogin');
} else {
  isChecking.value = false; // 권한 확인 후 로딩 상태 해제
}
</script>

<style lang="scss" scoped></style>
s
