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
          to="/admin/adminUsermanagement"
        />
        <q-btn stretch flat label="미승인 문제" to="/admin/adminNotapproved" />
        <q-btn stretch flat label="신고 문제" to="/admin/adminReported" />

        <q-btn
          rounded
          :label="isLoggedIn ? '관리자 로그인 중' : '로그인'"
          :color="isLoggedIn ? 'orange' : 'light-blue-13'"
          @click="isLoggedIn ? openLogoutDialog() : openAdminLogin()"
        />
      </q-toolbar>
    </q-header>
    <q-page-container style="max-width: 1080px; margin: 0 auto">
      <router-view />
    </q-page-container>
    <AdminLogin v-model="adminLogin" @login-success="handleLoginSuccess" />
    <LogoutForm v-model="showLogout" @logout="handleLogout" />
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import AdminLogin from 'src/components/auth/AdminLogin.vue';
import LogoutForm from 'src/components/auth/LogoutForm.vue';

// 로그인 다이얼로그 상태
const adminLogin = ref(false);
const isLoggedIn = ref(false);
// 로그아웃 상태
const showLogout = ref(false);

const openAdminLogin = () => {
  if (!isLoggedIn.value) adminLogin.value = true;
};

// 로그인 성공 핸들러
const handleLoginSuccess = status => {
  console.log('로그인 이벤트 수신');
  if (status) {
    isLoggedIn.value = true;
    adminLogin.value = false;
  }
};

// 로그아웃 다이얼로그 열기
const openLogoutDialog = () => {
  showLogout.value = true;
};

// 로그아웃 핸들러
const handleLogout = () => {
  isLoggedIn.value = false;
  showLogout.value = false;
};
</script>

<style lang="scss" scoped></style>
