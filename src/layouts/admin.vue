<template>
  <q-layout view="lHh Lpr lff">
    <q-header bordered class="bg-yellow-6">
      <!-- 툴바 & 제목 -->
      <q-toolbar class="flex justify-between">
        <q-btn flat dense to="/admin">
          <q-toolbar-title>
            <q-avatar>
              <img src="/gnu.jpeg" />
            </q-avatar>
            CSE
          </q-toolbar-title>
        </q-btn>

        <q-btn stretch flat label="기본 문제 추가" to="/admin/adminCreate" />
        <q-btn
          stretch
          flat
          label="기본 문제 관리"
          to="/admin/adminManagement"
        />
        <q-btn
          stretch
          flat
          label="사용자 문제 관리"
          to="/admin/adminUserManagement"
        />
        <q-btn
          stretch
          flat
          label="미승인 문제 관리"
          to="/admin/adminNotApproved"
        />
        <q-btn stretch flat label="신고 문제 관리" to="/admin/adminReported" />

        <q-btn
          v-if="isLoggedIn"
          rounded
          label="로그아웃"
          color="orange"
          @click="openLogoutDialog()"
        />
      </q-toolbar>
    </q-header>
    <q-page-container style="max-width: 1080px; margin: 0 auto">
      <router-view />
    </q-page-container>
    <LogoutForm v-model="showLogout" @logout="handleLogout" />
  </q-layout>
</template>

<script setup>
import { computed, ref } from 'vue';
import LogoutForm from 'src/components/auth/LogoutForm.vue';
import { useAdminAuthStore } from 'src/stores/adminAuth';

// 관리자 스토어 가져오기
const authStore = useAdminAuthStore();

// 로그인 상태를 나타내는 반응형 데이터
const isLoggedIn = computed(() => authStore.isAuthenticated);

// 로그아웃 상태
const showLogout = ref(false);

// 로그아웃 다이얼로그 열기
const openLogoutDialog = () => {
  showLogout.value = true;
};

// 로그아웃 핸들러
const handleLogout = () => {
  // 로그아웃 로직 실행
  isLoggedIn.value = false; // 로그아웃 시 isLoggedIn을 false로 설정
  showLogout.value = false;
};
</script>
