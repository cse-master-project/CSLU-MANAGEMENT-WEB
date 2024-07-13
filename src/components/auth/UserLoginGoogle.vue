<template>
  <q-dialog v-model="visible" persistent>
    <q-card>
      <q-card-section>
        <div class="text-h6">구글로그인</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat color="primary" label="구글로그인" @click="LoginGoogle" />
      </q-card-actions>
    </q-card>

    <GoogleLogin :callback="callback" />
  </q-dialog>
</template>

<script setup>
import { googleSdkLoaded } from 'vue3-google-login';
import axios from 'axios';
import { ref, defineProps } from 'vue';
import { api } from 'src/boot/axios';
import { useCookies } from 'vue3-cookies';
import { useUserAuthStore } from 'src/stores/userAuth';
const { cookies } = useCookies();
const props = defineProps({
  isLogin: Boolean,
});
let userDetails = {};
const visible = ref(props.isLogin);

const LoginGoogle = () => {
  console.log('구글로그인');
  googleSdkLoaded(google => {
    google.accounts.oauth2
      .initCodeClient({
        client_id:
          '130884765327-jacvju4thl4c1u6eduvb9v42i761itn5.apps.googleusercontent.com',
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
          '130884765327-jacvju4thl4c1u6eduvb9v42i761itn5.apps.googleusercontent.com',
        client_secret: 'secret',
        redirect_uri: 'postmessage',
        grant_type: 'authorization_code',
      });
      const accessToken = response.data.access_token;
      //console.log(accessToken);

      // Fetch user details using the access token
      const userResponse = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      //console.log('userResponse', userResponse);
      if (userResponse && userResponse.data) {
        //console.log('1');
        //console.log('userResponse.data', userResponse.data);
        // Set the userDetails data property to the userResponse object
        userDetails = userResponse.data;

        console.log('userDetails', userDetails);
        const userData = {
          accessToken: accessToken,
          nickname: userDetails.email,
        };
        api
          .post('/api/user/auth/google/check', userData)
          .then(response => {
            console.log('registered', response.data.registered);
            const registered = response.data.registered;
            if (registered) {
              api
                .post('/api/user/auth/google/login', userData.accessToken)
                .then(response => {
                  const adminStore = useUserAuthStore();
                  adminStore.setAuthData(response.data);
                  console.log('로그인 성공:', response.data);
                })
                .catch(error => {
                  console.log('로그인 실패:', error);
                });
            } else if (!registered) {
              api
                .post('/api/user/auth/google/sign_up', userData)
                .then(response => {
                  const adminStore = useUserAuthStore();
                  adminStore.setAuthData(response.data);
                  console.log('회원가입 성공:', response.data);
                })
                .catch(error => {
                  console.log('회원가입 실패:', error);
                });
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
</script>

<style scoped></style>
