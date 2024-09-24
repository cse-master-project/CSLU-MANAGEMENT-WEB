<template>
  <q-dialog v-model="visible" transition-show="fade" transition-hide="fade">
    <q-card class="my-card">
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
      <q-card-section align="center" class="card-header">
        <div class="logoimg">
          <img src="/logo.jpg" class="responsive-logo" />
        </div>
        <div class="text-h6">로그인</div>
      </q-card-section>
      <q-separator class="separator" />
      <q-card-actions class="google-login">
        <q-btn flat color="primary" @click="LoginGoogle">
          <img src="/google.png" alt="구글 로그인" class="google-img" />
        </q-btn>
      </q-card-actions>
      <q-card-actions align="right" v-show="signUpVisible">
        <q-card-section class="q-pt-none">
          <q-input
            v-model="nickname"
            type="text"
            outlined
            placeholder="닉네임"
            class="q-mb-md"
            maxlength="20"
          >
            <q-tooltip
              anchor="top middle"
              style="background-color: black; transform: translateY(-20px)"
            >
              20자까지 입력 가능합니다.
            </q-tooltip>
          </q-input>
          <q-btn rounded @click="signUpGoogle" class="signupbtn">
            <img
              src="public/signup.png"
              alt="adduser"
              style="height: 16px; width: auto; filter: invert(1)"
            />SIGN UP
          </q-btn>
        </q-card-section>
      </q-card-actions>
    </q-card>
    <GoogleLogin :callback="callback" />
  </q-dialog>
</template>

<script setup>
import { googleSdkLoaded } from 'vue3-google-login';
import axios from 'axios';
import { ref, watch } from 'vue';
import { userApi } from 'src/boot/userAxios';
import { useCookies } from 'vue3-cookies'; //쿠키 관리 라이브러리
import { useUserAuthStore } from 'src/stores/userAuth'; //사용자 인증 상태관리

const { cookies } = useCookies(); //쿠키 사용.

const userStore = useUserAuthStore();
userStore.loadAuthDataFromCookies();

const props = defineProps({
  isLogin: Boolean,
});
const visible = ref(props.isLogin); //다이얼로그의 가시성(부모로부터 isLogin받음.)
const signUpVisible = ref(false);
const googleacAcessToken = ref(null);
const nickname = ref(null);
const emit = defineEmits(['update:isLogin']);

watch(
  () => props.isLogin,
  newVal => {
    visible.value = newVal;
    if (!newVal) {
      resetState();
    }
  },
);

watch(
  () => visible.value,
  newVal => {
    if (!newVal) {
      resetState();
      emit('update:isLogin', false);
    }
  },
);

function resetState() {
  signUpVisible.value = false;
  googleacAcessToken.value = null;
  nickname.value = null;
}

function closeDialog() {
  visible.value = false;
}

let userDetails = {}; //사용자 정보 저장.

const LoginGoogle = () => {
  googleSdkLoaded(google => {
    google.accounts.oauth2
      .initCodeClient({
        client_id:
          '703819159310-7pgrn092d6v4mk03mmj89th86d8455ir.apps.googleusercontent.com',
        scope: 'email profile openid',
        redirect_uri: 'http://localhost:9000',
        callback: response => {
          if (response.code) {
            sendCodeToBackend(response.code);
          }
        },
      })
      .requestCode();
  });

  const sendCodeToBackend = async code => {
    try {
      const response = await axios.post('https://oauth2.googleapis.com/token', {
        code,
        client_id:
          '703819159310-7pgrn092d6v4mk03mmj89th86d8455ir.apps.googleusercontent.com',
        client_secret: process.env.VUE_APP_GOOGLE_SECRET_CODE,
        redirect_uri: 'postmessage',
        grant_type: 'authorization_code',
      });

      const accessToken = response.data.access_token;
      googleacAcessToken.value = accessToken;

      const userResponse = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (userResponse && userResponse.data) {
        userDetails = userResponse.data;

        const userData = {
          accessToken: accessToken,
        };

        userApi
          .post('/api/user/auth/google/check', userData)
          .then(response => {
            const registered = response.data.registered;
            if (registered) {
              userApi
                .post('/api/user/auth/google/login', userData.accessToken)
                .then(response => {
                  const userStore = useUserAuthStore();
                  userStore.setAuthData(response.data);
                  closeDialog();
                })
                .catch(error => {
                  console.log('로그인 실패:', error);
                  closeDialog();
                });
            } else if (!registered) {
              signUpVisible.value = true;
            }
          })
          .catch(error => {
            if (error.response.status === 400) {
              alert(
                '입력된 데이터가 부족하거나 잘못되었습니다. 빈칸이 없는지 확인해주세요.',
              );
            }
          });
      } else {
        console.error('Failed to fetch user details.');
      }
    } catch (error) {
      console.error('Token exchange failed:', error.response.data);
    }
  };

  const callback = response => {
    console.log('Handle the response', response);
  };
};

const signUpGoogle = () => {
  const userData2 = {
    accessToken: googleacAcessToken.value,
    nickname: nickname.value,
  };

  userApi
    .post('/api/user/auth/google/sign-up', userData2)
    .then(response => {
      const userStore = useUserAuthStore();
      userStore.setAuthData(response.data);
      closeDialog();
    })
    .catch(error => {
      console.log('회원가입 실패:', error);
    });
};
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
  height: 60%;
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
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
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
  margin: 4% auto;
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
</style>
