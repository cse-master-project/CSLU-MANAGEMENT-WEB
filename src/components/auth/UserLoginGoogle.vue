<template>
  <q-dialog v-model="visible">
    <q-card class="my-card"
      ><q-btn
        flat
        round
        dense
        icon="close"
        @click="visible = false"
        class="close-button"
        style="
          margin-left: auto;
          margin-top: 3%;
          margin-right: 3%;
          color: #929dac;
        "
        ><q-tooltip style="background-color: black"> 닫기 </q-tooltip></q-btn
      >
      <q-card-section align="right" class="card-header">
        <div class="text-h4" style="font-family: 'NotoB', sans-serif">
          CSLU로고
        </div>
        <div class="text-h6">로그인</div>
      </q-card-section>
      <q-separator class="separator" />

      <q-card-actions class="google-login">
        <q-btn flat color="primary" @click="LoginGoogle">
          <img src="/google.png" alt="구글 로그인" class="google-img" />
        </q-btn>
      </q-card-actions>

      <q-card-actions align="right" v-show="false">
        <q-card-section class="q-pt-none">
          <q-input
            v-model="nickname"
            type="text"
            outlined
            placeholder="닉네임"
            class="q-mb-md"
            maxlength="20"
            ><q-tooltip
              anchor="top middle"
              style="background-color: black; transform: translateY(-20px)"
              >20자까지 입력 가능합니다.</q-tooltip
            ></q-input
          >

          <q-btn rounded @click="signUpGoogle" class="signupbtn">
            <img
              src="public\signup.png"
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
import { ref, defineProps } from 'vue';
import { userApi } from 'src/boot/userAxios';
import { useCookies } from 'vue3-cookies'; //쿠키 관리 라이브러리
import { useUserAuthStore } from 'src/stores/userAuth'; //사용자 인증 상태관리

const { cookies } = useCookies(); //쿠키 사용.

const props = defineProps({
  isLogin: Boolean,
});
const visible = ref(props.isLogin); //다이얼로그의 가시성(부모로부터 isLogin받음.)
const signUpVisible = ref(false);
const googleacAcessToken = ref(null);
const nickname = ref(null);
const emit = defineEmits(['update:isLogin']);

let userDetails = {}; //사용자 정보 저장.
const LoginGoogle = () => {
  //구글 로그인 과정.
  //console.log('구글로그인');
  //emit('update:isLogin', false);
  googleSdkLoaded(google => {
    //구글 SDK 로드된 후 실행.
    google.accounts.oauth2
      .initCodeClient({
        //구글 OAuth 클라이언트 초기화하고 인증 코드를 요청.
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
    //인증코드를 백엔드로 보내고,
    try {
      const response = await axios.post('https://oauth2.googleapis.com/token', {
        code,
        client_id:
          '703819159310-7pgrn092d6v4mk03mmj89th86d8455ir.apps.googleusercontent.com',
        client_secret: '',
        redirect_uri: 'postmessage',
        grant_type: 'authorization_code',
      }); //구글에서 액세스 토큰을 받아오기.
      const accessToken = response.data.access_token;
      googleacAcessToken.value = accessToken;
      console.log('구글에서 액세스 토큰 : ', accessToken);

      // Fetch user details using the access token
      const userResponse = await axios.get(
        //액세스 토큰을 사용해 사용자 정보를 가져온다.
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      console.log('구글에서 정보 받은거 : ', userResponse);
      if (userResponse && userResponse.data) {
        //console.log('1');
        //console.log('userResponse.data', userResponse.data);
        // Set the userDetails data property to the userResponse object
        userDetails = userResponse.data; //가져온 사용자 정보를 저장한다.
        console.log('사용자 정보를 저장한거 userDetails !!!', userDetails);
        const userData = {
          //백엔드에 보내기 위한 사용자 데이터 객체.
          accessToken: accessToken,
          //nickname: userDetails.email,
        };
        userApi
          .post('/api/user/auth/google/check', userData) //백엔드에 사용자 등록여부를 확인.
          .then(response => {
            console.log('registered(회원가입여부)', response.data.registered);
            const registered = response.data.registered;
            if (registered) {
              //이미 등록된 경우
              userApi
                .post('/api/user/auth/google/login', userData.accessToken)
                .then(response => {
                  const userStore = useUserAuthStore();
                  userStore.setAuthData(response.data);
                  console.log('로그인 성공:', response.data);
                  emit('update:isLogin', false);
                })
                .catch(error => {
                  console.log('로그인 실패:', error);
                  emit('update:isLogin', false);
                });
            } else if (!registered) {
              //동록되지 않은 경우
              console.log('nickname', signUpVisible);

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
        //console.log('12');
        // Handle the case where userResponse or userResponse.data is undefined
        console.error('Failed to fetch user details.');
      }
    } catch (error) {
      //console.log('3');
      console.error('Token exchange failed:', error.response.data);
    }
  };
  const callback = response => {
    // This callback will be triggered when the user selects or login to
    // his Google account from the popup
    console.log('Handle the response', response);
  };
};
const signUpGoogle = () => {
  console.log('nickname setting', signUpVisible);
  const userData2 = {
    accessToken: googleacAcessToken.value,
    nickname: nickname.value,
  };
  userApi
    .post('/api/user/auth/google/sign-up', userData2)
    .then(response => {
      const userStore = useUserAuthStore();
      userStore.setAuthData(response.data);
      console.log('회원가입 성공:', response.data);
      emit('update:isLogin', false);
    })
    .catch(error => {
      console.log('회원가입 실패:', error);
    });
};
</script>

<style scoped>
/* 카드 스타일링 */
.my-card {
  height: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 20%;
}

/* 카드 헤더 스타일링 */
.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  flex-direction: column; /* 수직 정렬 */
  margin-bottom: auto; /* 카드의 위쪽에 배치 */
}

/* 구글 로그인 버튼 스타일링 */
.google-login {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1; /* 남은 공간을 차지하도록 설정 */
}

.google-img {
  height: auto;
  width: 75%; /* 이미지 비율 유지 */
}
.q-input {
  width: 100%;
  margin: 0 auto;
}
/* 회원가입 버튼 스타일링 */
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
</style>
