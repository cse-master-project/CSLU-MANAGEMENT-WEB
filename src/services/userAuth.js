import axios from 'axios';
import { googleSdkLoaded } from 'vue3-google-login'; // Google SDK 로드 함수
import { userApi } from 'src/boot/userAxios';
import { useUserAuthStore } from 'src/stores/userAuth';

// 로그인 로직
export const googleAuth = {
  // Google SDK를 통해 인증 코드 요청
  async getAuthCode(clientId) {
    return new Promise((resolve, reject) => {
      // Google SDK 로드가 완료된 후 인증 코드 요청
      googleSdkLoaded(google => {
        google.accounts.oauth2
          .initCodeClient({
            client_id:
              '703819159310-7pgrn092d6v4mk03mmj89th86d8455ir.apps.googleusercontent.com',
            scope: 'email profile openid',
            redirect_uri: 'http://localhost:9000',
            callback: response => {
              if (response.code) {
                resolve(response.code); // 인증 코드 반환
              } else {
                reject(new Error('Google 인증 실패'));
              }
            },
          })
          .requestCode();
      });
    });
  },

  // 인증 코드를 Google 서버로 전송해 액세스 토큰 요청
  async getAccessToken(code, clientId, clientSecret) {
    try {
      const response = await axios.post('https://oauth2.googleapis.com/token', {
        code,
        client_id:
          '703819159310-7pgrn092d6v4mk03mmj89th86d8455ir.apps.googleusercontent.com',
        client_secret: process.env.VUE_APP_GOOGLE_SECRET_CODE,
        redirect_uri: 'postmessage',
        grant_type: 'authorization_code',
      });
      return response.data.access_token; // 액세스 토큰 반환
    } catch (error) {
      console.error('토큰 교환 실패:', error.response.data);
      throw new Error('토큰 교환 실패');
    }
  },

  // 액세스 토큰을 이용해 Google 사용자 정보 요청
  async getUserInfo(accessToken) {
    try {
      const response = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return response.data; // 사용자 정보 반환
    } catch (error) {
      console.error('Google 사용자 정보 가져오기 실패:', error);
      throw new Error('Google 사용자 정보 가져오기 실패');
    }
  },

  // 사용자 등록 상태 확인
  async checkUserRegistration(accessToken) {
    try {
      const userData = { accessToken };
      const response = await userApi.post(
        '/api/v2/user/auth/google/check',
        userData,
      );
      return response.data.registered; // 사용자 등록 여부 반환
    } catch (error) {
      console.error('사용자 등록 상태 확인 실패:', error);
      throw new Error('사용자 등록 상태 확인 실패');
    }
  },

  // 구글 로그인 처리 (등록된 사용자인 경우)
  async loginUser(accessToken) {
    try {
      const response = await userApi.post(
        '/api/v2/user/auth/google/login',
        accessToken,
      );
      const userStore = useUserAuthStore();
      userStore.setAuthData(response.data); // 사용자 인증 상태 저장
      return response.data;
    } catch (error) {
      console.error('로그인 실패:', error);
      throw new Error('로그인 실패');
    }
  },

  // 구글 계정으로 회원가입 처리
  async signUpGoogle(accessToken, nickname) {
    try {
      const userData = {
        accessToken,
        nickname,
      };
      const response = await userApi.post(
        '/api/v2/user/auth/google/sign-up',
        userData,
      );
      const userStore = useUserAuthStore();
      userStore.setAuthData(response.data); // 사용자 인증 상태 저장
      return response.data;
    } catch (error) {
      console.error('회원가입 실패:', error);
      throw new Error('회원가입 실패');
    }
  },

  // 로그인 후 사용자 정보 가져오기
  async fetchUserInfo() {
    try {
      const response = await userApi.get('/api/user/info');
      return response.data;
    } catch (error) {
      console.error('사용자 정보 가져오기 실패:', error);
      throw new Error('사용자 정보 가져오기 실패');
    }
  },
};

// 로그아웃 로직
export const userAuth = {
  // 로그아웃 함수
  async logoutUser() {
    const userStore = useUserAuthStore(); // 스토어 인스턴스
    const accessToken = userStore.accessToken; // 스토어에서 accessToken 가져오기

    try {
      // 로그아웃 요청을 서버로 전송
      await userApi.post(
        '/api/v2/user/auth/google/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Bearer 토큰으로 accessToken 전송
          },
        },
      );

      // 사용자 인증 정보 초기화
      userStore.logout(); // Pinia 스토어에서 로그아웃 처리
    } catch (error) {
      console.error('로그아웃 실패:', error);
      throw new Error('로그아웃 실패');
    }
  },
};
