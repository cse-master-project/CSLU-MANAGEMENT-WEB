<template>
  <q-dialog v-model="visible">
    <q-card>
      <q-card-section class="row items-center justify-end">
        <div>로그아웃 하시겠습니까?</div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="취소" color="primary" @click="close" />
        <q-btn flat label="로그아웃" color="primary" @click="logout" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useUserAuthStore } from 'src/stores/userAuth'; //사용자 인증 상태관리
import { userApi } from 'src/boot/userAxios';
import { useRouter } from 'vue-router';

const props = defineProps({
  isLogout: Boolean,
});
const visible = ref(props.isLogout);

const emit = defineEmits(['update:isLogout']);

// Pinia 스토어 사용
const userStore = useUserAuthStore();
const router = useRouter();

// 로그아웃 데이터를 서버에 post 요청 전송
const logout = async () => {
  try {
    emit('update:isLogout', false);
    const accessToken = userStore.accessToken; // accessToken을 스토어에서 가져옵니다.
    // 서버에 로그아웃 요청 보내기
    await userApi.post(
      '/api/user/auth/google/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // 인자로 받은 accessToken 사용
        },
      },
    );

    // 사용자 상태 초기화
    userStore.logout();
    console.log('로그아웃 성공');

    // 로그아웃 성공 후 홈 페이지로 리디렉션
    router.push('/home');
  } catch (error) {
    console.error('로그아웃 실패:', error);
  }
};

// 다이얼로그 닫기
const close = () => {
  emit('update:isLogout', false);
};
</script>

<style scoped>
/* 필요한 스타일 추가 */
</style>
