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
          label="로그인"
          color="light-blue-13"
          @click="openAdminLogin"
        />
      </q-toolbar>
    </q-header>
    <q-page-container style="max-width: 1080px; margin: 0 auto">
      <router-view />
    </q-page-container>
    <AdminLogin v-model="adminLogin" />
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import AdminLogin from 'src/components/auth/AdminLogin.vue';
//로그인
const adminLogin = ref(false);
const openAdminLogin = () => (adminLogin.value = true);
</script>

<style lang="scss" scoped></style>
