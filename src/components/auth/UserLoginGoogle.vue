<template>
  <!-- 로그인 다이얼로그 창 -->
  <q-dialog v-model="visible" transition-show="fade" transition-hide="fade">
    <q-card class="my-card">
      <!-- 닫기 버튼 -->
      <q-btn
        flat
        round
        dense
        icon="close"
        @click="closeDialog"
        class="close-button"
        style="
          margin-left: auto;
          margin-top: 3%;
          margin-right: 3%;
          color: #929dac;
        "
      >
        <q-tooltip style="background-color: black"> 닫기 </q-tooltip>
      </q-btn>

      <!-- 로그인 카드  -->
      <q-card-section align="center" class="card-header">
        <div class="logoimg">
          <img src="/logo.jpg" class="responsive-logo" />
        </div>
        <div class="text-h6">로그인</div>
      </q-card-section>

      <q-separator class="separator" />

      <!-- 구글 로그인 버튼 -->
      <q-card-actions class="google-login">
        <img
          src="/google.png"
          alt="구글 로그인"
          class="google-img"
          @click="LoginGoogle"
          style="cursor: pointer"
        />
      </q-card-actions>

      <!-- 회원가입 시 닉네임 입력 필드 -->
      <q-card-actions align="right" v-show="signUpVisible">
        <q-card-section class="q-pt-none">
          <q-input
            v-model="nickname"
            type="text"
            outlined
            placeholder="닉네임"
            class="q-mb-md"
            maxlength="20"
            counter
          >
            <q-tooltip
              anchor="top middle"
              style="background-color: black; transform: translateY(-20px)"
            >
              20자까지 입력 가능합니다.
            </q-tooltip>
          </q-input>
          <q-btn rounded @click="signUpGoogle" class="signupbtn">
            SIGN UP
          </q-btn>
        </q-card-section>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { Notify } from 'quasar';
import { ref, watch, onMounted } from 'vue';
import { googleAuth } from 'src/services/userAuth.js'; // Google 로그인 서비스 가져오기

// 부모 컴포넌트로부터 전달된 props 정의 (로그인 상태 여부)
const props = defineProps({
  isLogin: Boolean,
});

// 다이얼로그의 표시 여부를 관리하는 상태
const visible = ref(props.isLogin);
// 회원가입 화면 표시 여부 상태
const signUpVisible = ref(false);

// Google 액세스 토큰
const googleacAcessToken = ref(null);

// 회원가입 시 입력된 닉네임
const nickname = ref(null);
// 사용자 정보 저장 변수
const userInfo = ref({});

// 부모 컴포넌트로 로그인 상태 변화를 알리기 위한 emit 설정
const emit = defineEmits(['update:isLogin']);

// Google 클라이언트 ID 및 비밀 키 (clientSecret은 환경 변수로 가져옴)
const clientId = process.env.VUE_APP_GOOGLE_CLIENT_ID;
const clientSecret = process.env.VUE_APP_GOOGLE_SECRET_CODE;

// props의 isLogin 값이 변경될 때 다이얼로그 상태 갱신
watch(
  () => props.isLogin,
  newVal => {
    visible.value = newVal;
    if (!newVal) {
      resetState();
    }
  },
);
// 다이얼로그가 닫히면 상태 초기화 및 부모에 로그인 상태 업데이트 알림
watch(
  () => visible.value,
  newVal => {
    if (!newVal) {
      resetState();
      emit('update:isLogin', false);
    }
  },
);

// 다이얼로그 상태 초기화 함수 (회원가입 화면 및 액세스 토큰 초기화)
function resetState() {
  signUpVisible.value = false;
  googleacAcessToken.value = null;
  nickname.value = null;
}

// 다이얼로그 닫기 함수
function closeDialog() {
  visible.value = false;
}

// Google 로그인 처리 함수
async function LoginGoogle() {
  try {
    // 1-1. Google SDK를 통해 인증 코드 요청
    const code = await googleAuth.getAuthCode(clientId);
    // 1-2. 인증 코드를 통해 액세스 토큰 요청
    googleacAcessToken.value = await googleAuth.getAccessToken(
      code,
      clientId,
      clientSecret,
    );
    // 2. 사용자 등록 상태 확인
    const registered = await googleAuth.checkUserRegistration(
      googleacAcessToken.value,
    );
    // 3-1. 기존유저 로그인 처리
    if (registered) {
      await googleAuth.loginUser(googleacAcessToken.value);
      userInfo.value = await googleAuth.fetchUserInfo();
      // 로그인 알림
      Notify.create({
        message: `${userInfo.value.nickname}님, 환영합니다!`,
        textColor: 'white',
        classes: 'custom-notify',
        timeout: 1500,
        position: 'top',
      });
      closeDialog(); // 다이얼로그 닫기
    } else {
      // 3-2. 신유저 회웝가입 처리
      signUpVisible.value = true;
    }
  } catch (error) {}
}
// 3-2. 신유저 회원가입 처리
async function signUpGoogle() {
  try {
    await googleAuth.signUpGoogle(googleacAcessToken.value, nickname.value);
    userInfo.value = await googleAuth.fetchUserInfo();
    // 로그인 알림
    Notify.create({
      message: `${userInfo.value.nickname}님, 환영합니다!`,
      textColor: 'white',
      classes: 'custom-notify',
      timeout: 1500,
      position: 'top',
    });
    closeDialog(); // 다이얼로그 닫기
  } catch (error) {}
}
</script>

<style scoped>
.logoimg {
  margin: 0 auto;
  width: 150px;
  height: auto;
}

.responsive-logo {
  max-width: 100%;
  height: auto;
}

.my-card {
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 20%;
}

.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  flex-direction: column;
  margin-bottom: auto;
}

.google-login {
  margin-top: 4%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  margin-bottom: 4%;
}

.google-img {
  height: auto;
  width: 75%;
}

.q-input {
  width: 100%;
  margin: 0 auto;
}

.signupbtn {
  background-color: rgba(0, 12, 30, 0.8);
  width: 100%;
  margin: 8% auto;
  font-family: 'Toss Product Sans';
  font-weight: 600;
  color: white;
  font-size: 1rem;
}

.separator {
  width: 80%;
}

.q-dialog--transition {
  transition: opacity 0.3s;
}
.googlebtn {
  width: 75%;
}
.custom-notify {
  background-color: #000000 !important;
  border-radius: 10px; /* 모서리 둥글게 */
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
@media (max-width: 1440px) {
  .my-card {
    width: 300px;
  }
}
</style>
