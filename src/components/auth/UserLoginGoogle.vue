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

const props = defineProps({
  isLogin: Boolean,
});

const visible = ref(props.isLogin);

const LoginGoogle = () => {
  console.log('구글로그인');
  googleSdkLoaded(google => {
    google.accounts.oauth2
      .initCodeClient({
        scope: 'email profile openid',
        redirect_uri: 'http://localhost:9000',
        callback: response => {
          if (response.code) {
            this.sendCodeToBackend(response.code);
          }
        },
      })
      .requestCode();
  });
  sendCodeToBackend = async code => {
    try {
      const response = await axios.post('https://oauth2.googleapis.com/token', {
        code,
        redirect_uri: 'postmessage',
        grant_type: 'authorization_code',
      });

      const accessToken = response.data.access_token;
      console.log(accessToken);

      // Fetch user details using the access token
      const userResponse = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (userResponse && userResponse.data) {
        // Set the userDetails data property to the userResponse object
        this.userDetails = userResponse.data;
      } else {
        // Handle the case where userResponse or userResponse.data is undefined
        console.error('Failed to fetch user details.');
      }
    } catch (error) {
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
