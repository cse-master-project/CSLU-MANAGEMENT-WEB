<template>
  <q-dialog v-model="visible" persistent>
    <q-card class="logoutmodal">
      <q-btn
        flat
        dense
        icon="close"
        @click="close"
        class="close-button"
        style="
          margin-left: auto;
          margin-top: 3%;
          margin-right: 3%;
          color: #929dac;
        "
      ></q-btn>
      <q-card-section>
        <div class="logoutmsg" style="">로그아웃 하시겠습니까?</div>
      </q-card-section>
      <q-btn class="logoutbtn" @click="logout">YES.</q-btn>
      <q-btn class="logoutbtn" @click="close">No.</q-btn>
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
    //console.log('로그아웃 성공');

    // 로그아웃 성공 후 홈 페이지로 리디렉션
    router.push('/home');
  } catch (error) {
    alert('로그아웃 실패.');
    console.error('로그아웃 실패:', error);
  }
};

// 다이얼로그 닫기
const close = () => {
  emit('update:isLogout', false);
  visible.value = false;
};
</script>

<style scoped>
.logoutmodal {
  width: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.logoutbtn {
  background-color: rgba(0, 12, 30, 0.8);
  width: 90%;
  margin: 2% auto;
  font-family: 'Toss Product Sans';
  font-weight: 600;
  color: white;
  font-size: 1rem;
  padding: 10px 90px;
}
.logoutmsg {
  font-size: 1.4rem;
  margin: 10px auto;
  padding: 0;
  font-family: Toss Product Sans;
}
.btn-group {
  display: flex;
  justify-content: center;
  flex-direction: row;
}
@media (min-width: 1024px) and (max-width: 1279px) {
  .logoutmodal {
    width: 50%;
  }
  .logoutmsg {
    font-size: 23px;
  }
}
@media (min-width: 768px) and (max-width: 1023px) {
  .logoutmodal {
    width: 90%;
  }
  .logoutmsg {
    font-size: 23px;
  }
}
@media (min-width: 480px) and (max-width: 767px) {
  .logoutmodal {
    width: 90%;
  }
  .logoutmsg {
    font-size: 23px;
  }
}
@media (max-width: 479px) {
  .logoutmodal {
    width: 90%;
  }
  .logoutmsg {
    font-size: 23px;
  }
}
</style>
