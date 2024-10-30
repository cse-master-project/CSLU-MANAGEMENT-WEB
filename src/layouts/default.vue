<template>
  <q-layout view="lHh Lpr lff">
    <q-header bordered class="bg-info q-header">
      <q-toolbar class="toolbar">
        <!--로고&홈-->
        <q-btn flat dense to="/" class="toolbar-item">
          <q-toolbar-title class="title">
            <q-avatar class="avatar">
              <img src="/logo.jpg" />
            </q-avatar>
            CSLU
          </q-toolbar-title>
        </q-btn>

        <q-btn
          stretch
          flat
          label="소개"
          to="/about"
          class="toolbar-items"
          :class="{ active: isActive('/about'), loggedIn: isUserLoggedIn }"
        />
        <!--바로가기 메뉴-->
        <div>
          <q-btn
            stretch
            flat
            label="문제 만들기"
            to="/create"
            class="toolbar-items"
            :class="{ active: isActive('/create'), loggedIn: isUserLoggedIn }"
            @mouseover="showMenu = true"
            color="primary"
            text-color="white"
            v-if="isUserLoggedIn"
            style="font-size: 18px; padding: 10px"
          />
          <q-menu
            v-model="showMenu"
            anchor="bottom middle"
            self="top middle"
            @mouseover="showMenu = true"
            @mouseleave="showMenu = false"
            class="custom-menu"
          >
            <q-list>
              <q-item
                v-for="quizType in quizTypes"
                :key="quizType.id"
                clickable
                class="menu-item"
                v-ripple
                :class="{
                  'selected-btn': selectedQuizType === quizType.value,
                }"
                @click="selectQuizType(quizType.value)"
                style="padding: 10px 20px"
              >
                <q-item-section>{{ quizType.name }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>

        <q-btn
          stretch
          flat
          label="문제 관리"
          to="/management"
          class="toolbar-items"
          v-if="isUserLoggedIn"
          :class="{ active: isActive('/management'), loggedIn: isUserLoggedIn }"
        />
        <q-btn
          stretch
          flat
          label="마이 페이지"
          to="/mypage"
          class="toolbar-items"
          v-if="isUserLoggedIn"
          :class="{ active: isActive('/mypage'), loggedIn: isUserLoggedIn }"
        />
        <q-btn
          v-if="!isUserLoggedIn"
          rounded
          label="LOG IN"
          @click="isLogin = true"
          @update:isLogin="false"
          class="loginbtn"
        />
        <q-btn
          v-if="isUserLoggedIn"
          rounded
          label="LOG OUT"
          class="loginbtn"
          @click="isLogout = true"
        />
        <q-btn
          class="side-menu"
          flat
          @click="drawerLeft = !drawerLeft"
          round
          dense
          icon="menu"
        />
      </q-toolbar>
    </q-header>

    <!--사이드바 메뉴-->
    <q-drawer
      v-model="drawerLeft"
      :width="200"
      :breakpoint="1024"
      elevated
      class="drawer"
    >
      <q-list>
        <q-item clickable to="/about" @click="drawer = false">
          <q-item-section>소개</q-item-section>
        </q-item>
        <q-item
          clickable
          to="/create"
          @click="drawer = false"
          v-if="isUserLoggedIn"
        >
          <q-item-section>문제 만들기</q-item-section>
        </q-item>
        <q-item
          clickable
          to="/management"
          v-if="isUserLoggedIn"
          @click="drawer = false"
        >
          <q-item-section>문제 관리</q-item-section>
        </q-item>
        <q-item
          clickable
          to="/mypage"
          v-if="isUserLoggedIn"
          @click="drawer = false"
        >
          <q-item-section>마이 페이지</q-item-section>
        </q-item>
        <q-item
          clickable
          @click="
            isLogin = true;
            drawer = false;
          "
          v-if="!isUserLoggedIn"
        >
          <q-item-section>LOG IN</q-item-section>
        </q-item>
        <q-item
          clickable
          @click="
            isLogout = true;
            drawer = false;
          "
          v-if="isUserLoggedIn"
        >
          <q-item-section>LOG OUT</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container :style="pageContainerStyles">
      <router-view v-if="!selectedQuizType" />
      <component v-else :is="getQuizComponent(selectedQuizType)" />
    </q-page-container>

    <!-- 바닥 -->
    <q-footer class="q-footer footer-bar">
      <div class="footer-content">
        <div>CSLU © 2024 . All Rights Reserved.</div>
        <q-btn flat dense class="footer-btn" to="/privacyPolicy">
          개인정보처리 방침
        </q-btn>
      </div>
    </q-footer>

    <UserLoginGoogle
      v-if="isLogin"
      :is-login="isLogin"
      @update:isLogin="isLogin = false"
    />
    <UserLogout
      v-if="isLogout"
      :is-logout="isLogout"
      @update:isLogout="isLogout = false"
    />
  </q-layout>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import UserLoginGoogle from 'src/components/auth/UserLoginGoogle.vue';
import { useUserAuthStore } from 'src/stores/userAuth'; // 사용자 인증 상태관리
import UserLogout from 'src/components/auth/UserLogout.vue';

import UserMultipleChoice from 'src/components/quiztype/quizCreate/UserMultipleChoice.vue';
import UserShortAnswer from 'src/components/quiztype/quizCreate/UserShortAnswer.vue';
import UserMatching from 'src/components/quiztype/quizCreate/UserMatching.vue';
import UserTrueOrFalse from 'src/components/quiztype/quizCreate/UserTrueOrFalse.vue';
import UserFillInTheBlank from 'src/components/quiztype/quizCreate/UserFillInTheBlank.vue';

// 페이지 크기를 나타내는 코드.
const route = useRoute();
const router = useRouter();

const pageContainerStyles = computed(() => ({
  maxWidth: route.meta?.width || '1280px',
  margin: '0 auto',
  minHeight: 'calc(100vh - 100px)', // 헤더와 푸터를 제외한 높이 설정
}));

// 로그인 다이얼로그 상태
const isLogin = ref(false);
const showMenu = ref(false); // 드롭다운 메뉴의 표시 상태를 제어하는 변수

// 관리자 스토어 가져오기
const userStore = useUserAuthStore();
// 로그인 상태를 나타내는 반응형 데이터
const isUserLoggedIn = computed(() => userStore.isAuthenticated);

// 로그아웃 기능
const isLogout = ref(false);

// 현재 경로와 비교하여 활성화된 버튼을 감지하는 함수
const isActive = path => route.path === path;

const quizTypes = ref([
  { id: 1, value: 'MultipleChoice', name: '4지선다형' },
  { id: 2, value: 'ShortAnswer', name: '단답형' },
  { id: 3, value: 'Matching', name: '선긋기형' },
  { id: 4, value: 'TrueOrFalse', name: 'o/x형' },
  { id: 5, value: 'FillInTheBlank', name: '빈칸 채우기형' },
]);

const selectedQuizType = ref(null);

const selectQuizType = quizType => {
  selectedQuizType.value = quizType;
  router.push('/create');
};

watch(route, newRoute => {
  if (newRoute.path !== '/create') {
    selectedQuizType.value = null;
  }
});

const getQuizComponent = quizType => {
  switch (quizType) {
    case 'MultipleChoice':
      return UserMultipleChoice;
    case 'ShortAnswer':
      return UserShortAnswer;
    case 'Matching':
      return UserMatching;
    case 'TrueOrFalse':
      return UserTrueOrFalse;
    case 'FillInTheBlank':
      return UserFillInTheBlank;
    default:
      return null;
  }
};

//사이드바 메뉴
const drawerLeft = ref(false);
</script>

<style>
.q-header {
  height: 8%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.q-footer {
  height: 100px;
  border-top: 1px solid #dddddd;
  background-color: white;
  color: black;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 푸터를 고정하지 않음 */
}
.toolbar {
  font-family: 'Toss Product Sans';
  width: 70%;
  display: flex;
  justify-content: space-between;
  position: relative;
}

.title {
  font-size: 1.8rem;
  font-family: 'NotoB', sans-serif;
  display: flex;
  align-items: center;
}
.avatar {
  margin-right: 10px;
}

.toolbar-item {
  font-size: 1.2rem;
  position: relative;
  padding: 10px 20px;
  margin: 0 10px; /* 항목 간 간격 추가 */
  transition: color 0.3s ease;
}
.toolbar-items {
  font-size: 1.2rem;
  position: relative;
  padding: 10px 20px;
  margin: 0 auto; /* 항목 간 간격 추가 */
  transition: color 0.3s ease;
}
.toolbar-items.active::after,
.toolbar-items:hover::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: currentColor;
  transform: scaleX(1);
  transition: transform 0.3s ease;
}
.toolbar-items::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: currentColor;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}
.q-menu {
  padding: 0;
  opacity: 0.9;
}

.menu-item {
  display: flex;
  align-items: center;
  font-size: 1rem;
  padding: 6px 10px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.q-menu .q-list {
  min-width: 150px;
  color: black;
  border-radius: 20px;
  font-family: 'Toss Product Sans';
}
.custom-menu {
  min-width: 150px;
  border-radius: 20px;
  position: relative;
  padding: 10px 6px;
}

.loginbtn {
  background-color: rgba(33, 44, 60, 0.8);
  font-family: 'Toss Product Sans';
  font-weight: 600;
  color: white;
  font-size: 1rem;
  border-radius: 40px;
  padding: 0 20px;
}
.drawer .q-item {
  font-size: 1rem;
  margin-bottom: 10px;
}

@media (max-width: 1200px) {
  .toolbar {
    font-family: 'Toss Product Sans';
    width: 100%;
  }

  .side-menu {
    display: block;
  }

  .toolbar-items,
  .loginbtn {
    display: none;
  }
}
@media (min-width: 1200px) {
  .toolbar {
    font-family: 'Toss Product Sans';
  }
  .side-menu {
    display: none;
  }
}
.toolbar-item.loggedIn {
  margin: 0 10px; /* Margin when logged in */
}
.toolbar-items.loggedIn {
  margin: 0 10px; /* Margin when logged in */
}
</style>
