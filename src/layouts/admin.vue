<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered class="bg-grey-5">
      <!-- 툴바 & 제목 -->
      <q-toolbar class="toolbar">
        <q-btn flat dense to="/admin" class="toolbar-item">
          <q-toolbar-title class="title">
            <q-avatar>
              <img src="/logo.jpg" />
            </q-avatar>
            CSLU
          </q-toolbar-title>
        </q-btn>

        <!-- 로그인 상태에 따라 버튼 표시 -->
        <q-btn
          v-if="isLoggedIn"
          stretch
          flat
          label="챕터 관리"
          to="/admin/adminSubjectManagement"
          class="toolbar-items"
          :class="{ active: isActive('/admin/adminSubjectManagement') }"
        />
        <q-btn
          v-if="isLoggedIn"
          stretch
          flat
          label="기본 문제 추가"
          to="/admin/adminCreate"
          class="toolbar-items"
          :class="{ active: isActive('/admin/adminCreate') }"
        />
        <q-btn
          v-if="isLoggedIn"
          stretch
          flat
          label="기본 문제 관리"
          to="/admin/adminManagement"
          class="toolbar-items"
          :class="{ active: isActive('/admin/adminManagement') }"
        />
        <q-btn
          v-if="isLoggedIn"
          stretch
          flat
          label="출제자 문제 관리"
          to="/admin/adminUserManagement"
          class="toolbar-items"
          :class="{ active: isActive('/admin/adminUserManagement') }"
        />
        <q-btn
          v-if="isLoggedIn"
          stretch
          flat
          label="출제자 미승인 문제 관리"
          to="/admin/adminNotApproved"
          class="toolbar-items"
          :class="{ active: isActive('/admin/adminNotApproved') }"
        />
        <q-btn
          v-if="isLoggedIn"
          stretch
          flat
          label="신고 문제 관리"
          to="/admin/adminReported"
          class="toolbar-items"
          :class="{ active: isActive('/admin/adminReported') }"
        />
        <!-- 로그인 상태에 따라 로그아웃 버튼 표시 -->
        <q-btn
          v-if="isLoggedIn"
          rounded
          label="로그아웃"
          color="orange"
          @click="isLogout = true"
          class="logout"
        />
        <q-btn
          class="menu"
          flat
          @click="drawerLeft = !drawerLeft"
          round
          dense
          icon="menu"
        />
      </q-toolbar>

      <!-- 사이드 바 -->
      <q-drawer
        v-model="drawerLeft"
        :width="200"
        :breakpoint="1024"
        elevated
        class="drawer"
      >
        <q-list>
          <q-btn
            v-if="isLoggedIn"
            stretch
            flat
            label="챕터 관리"
            to="/admin/adminSubjectManagement"
            :class="{ active: isActive('/admin/adminSubjectManagement') }"
          />
          <q-btn
            v-if="isLoggedIn"
            stretch
            flat
            label="기본 문제 추가"
            to="/admin/adminCreate"
            :class="{ active: isActive('/admin/adminCreate') }"
          />
          <q-btn
            v-if="isLoggedIn"
            stretch
            flat
            label="기본 문제 관리"
            to="/admin/adminManagement"
            :class="{ active: isActive('/admin/adminManagement') }"
          />
          <q-btn
            v-if="isLoggedIn"
            stretch
            flat
            label="출제자 문제 관리"
            to="/admin/adminUserManagement"
            :class="{ active: isActive('/admin/adminUserManagement') }"
          />
          <q-btn
            v-if="isLoggedIn"
            stretch
            flat
            label="출제자 미승인 문제 관리"
            to="/admin/adminNotApproved"
            :class="{ active: isActive('/admin/adminNotApproved') }"
          />
          <q-btn
            v-if="isLoggedIn"
            stretch
            flat
            label="신고 문제 관리"
            to="/admin/adminReported"
            :class="{ active: isActive('/admin/adminReported') }"
          />
          <q-btn
            stretch
            flat
            v-if="isLoggedIn"
            rounded
            label="로그아웃"
            color="orange"
            @click="isLogout = true"
          />
        </q-list>
      </q-drawer>
    </q-header>

    <!-- 페이지 컨테이너 스타일 조정 -->
    <q-page-container class="page-container">
      <router-view />
    </q-page-container>

    <!-- Footer -->
    <q-footer class="footer">
      <div>CSLU © 2024 . All Rights Reserved.</div>
    </q-footer>

    <!-- AdminLogout 모달 표시 -->
    <AdminLogout
      v-if="isLogout"
      :is-logout="isLogout"
      @update:isLogout="isLogout = $event"
    />
  </q-layout>
</template>

<script setup>
import { computed, ref } from 'vue';
import AdminLogout from 'src/components/auth/AdminLogout.vue';
import { useRoute } from 'vue-router';
import { useAdminAuthStore } from 'src/stores/adminAuth';

const route = useRoute();

// 관리자 스토어 가져오기
const authStore = useAdminAuthStore();

// 로그인 상태를 나타내는 반응형 데이터
const isLoggedIn = computed(() => authStore.isAuthenticated);

// 로그아웃 상태
const isLogout = ref(false);

// 현재 경로와 비교하여 활성화된 버튼을 감지하는 함수
const isActive = path => route.path === path;
const drawerLeft = ref(false);
</script>

<style lang="scss" scoped>
// 헤더
.q-header {
  height: 8%; /* 헤더 높이 조정 */
  display: flex;
  align-items: center; /* 헤더 내부 요소 수직으로 중앙 정렬 */
  justify-content: center; /* 헤더 내부 요소 수평으로 중앙 정렬 */
}

// 푸터
.q-footer {
  height: 100px;
  border-top: 1px solid #dddddd;
  background-color: white;
  color: black;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 0;
  width: 100%;
  z-index: 1;
}

// 툴바
.toolbar {
  font-family: 'Nanum';
  width: 100%; /* 툴바 너비 조정 */
  display: flex;
  justify-content: space-around; /* 아이템 사이 공간을 균등하게 분배 */
  align-items: center; /* 툴바 내부 요소 중앙 정렬 */
}
.toolbar-item {
  margin: 0 8px; /* 버튼 사이 간격 조정 */
  font-size: 1rem; /* 글씨 크기 조정 */
  position: relative;
}
.toolbar-items {
  margin: 0 8px; /* 버튼 사이 간격 조정 */
  font-size: 1rem; /* 글씨 크기 조정 */
  position: relative;
}

.toolbar-item.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: currentColor;
}

.title {
  font-family: 'NotoB';
  font-size: 1.8rem;
}

.page-container {
  width: 80%;
  margin: 20px auto;
  padding: 20px;
  flex: 1;
  position: relative;
  z-index: 0;
}

.drawer {
  z-index: 2;
}
.drawer .q-btn {
  font-size: 1rem;
  margin-bottom: 10px;
  color: black;
}
.drawer .q-btn.active {
  color: var(--q-primary);
}

@media (max-width: 1100px) {
  .toolbar {
    justify-content: space-between; /* 아이템 사이 공간을 균등하게 분배 */
  }
  .toolbar-items {
    display: none;
  }
  .logout {
    display: none;
  }
}

// 큰화면 설정
@media (min-width: 1101px) {
  .menu {
    display: none;
  }
}
@media (min-width: 1980px) {
  .title {
    font-size: 1.8rem;
  }
  .toolbar-items {
    font-size: 1.5rem;
  }
  .logout {
    font-size: 1.5rem;
    padding: 10px 20px;
  }
}
</style>
