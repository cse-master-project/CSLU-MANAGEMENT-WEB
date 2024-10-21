import { googleSdkLoaded } from 'vue3-google-login'; // Google SDK 로드 함수
import { userApi } from 'src/boot/userAxios';
import { useUserAuthStore } from 'src/stores/userAuth';
import { Notify } from 'quasar';
// 사용자용 계정

// <구글 로그인 로직>
export const googleAuth = {
  // 1-1. [구글 인증 코드 요청]
  async getAuthCode(clientId) {
    return new Promise((resolve, reject) => {
      const redirectUri =
        process.env.NODE_ENV === 'production'
          ? 'https://cslu-studying-web.duckdns.org/callback'
          : 'http://localhost:9000/callback';
      googleSdkLoaded(google => {
        google.accounts.oauth2
          .initCodeClient({
            client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID,
            scope: 'email profile openid',
            redirect_uri: redirectUri,
            callback: response => {
              if (response.code) {
                resolve(response.code); // 인증 코드 반환
              } else {
                // 인증 실패시 사용자에게 알림
                Notify.create({
                  message: 'Google 인증에 실패했습니다. 다시 시도해주세요.',
                  color: 'negative',
                  position: 'center', // 중앙 띄우기
                  timeout: 500, // 1초
                });
                reject(new Error('Google 인증 실패'));
              }
            },
          })
          .requestCode();
      });
    });
  },
  // 1-2. [구글 사용자 정보 패치]
  async getUserInfo(accessToken) {
    try {
      const response = await userApi.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return response.data; // 사용자 정보 반환
    } catch (error) {
      // 인증 실패시 사용자에게 알림
      Notify.create({
        message: 'Google 인증에 실패했습니다. 다시 시도해주세요.',
        color: 'negative',
        position: 'center', // 중앙 띄우기
        timeout: 500, // 1초
      });
      throw new Error('Google 사용자 정보 가져오기 실패');
    }
  },
  // 1-3. [구글 액세스 토큰 요청]
  async getAccessToken(code, clientId, clientSecret) {
    try {
      const response = await userApi.post(
        'https://oauth2.googleapis.com/token',
        {
          code,
          client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID,
          client_secret: process.env.VUE_APP_GOOGLE_SECRET_CODE,
          redirect_uri: 'postmessage',
          grant_type: 'authorization_code',
        },
      );
      return response.data.access_token; // 액세스 토큰 반환
    } catch (error) {
      // 인증 실패시 사용자에게 알림
      Notify.create({
        message: 'Google 인증에 실패했습니다. 다시 시도해주세요.',
        color: 'negative',
        position: 'center', // 중앙 띄우기
        timeout: 500, // 1초
      });
      throw new Error('토큰 교환 실패');
    }
  },

  // 3. [서버 : 사용자 등록 확안 ]
  async checkUserRegistration(accessToken) {
    try {
      const userData = { accessToken };
      const response = await userApi.post(
        '/api/v2/user/auth/google/check',
        userData,
      );
      return response.data.registered; // 사용자 등록 여부 반환
    } catch (error) {
      // 인증 실패시 사용자에게 알림
      Notify.create({
        message: '지금 서버에 문제가 있습니다. 잠시후 이용해주세요.',
        color: 'negative',
        position: 'center', // 중앙 띄우기
        timeout: 500, // 1초
      });
      throw new Error('사용자 등록 상태 확인 실패');
    }
  },
  // 4-1. [서버 : 로그인 처리 (기존유저 O)]
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
      // 로그인 실패 알림
      Notify.create({
        message: '로그인에 실패했습니다. 다시 시도해주세요.',
        color: 'negative',
        position: 'center', // 중앙 띄우기
        timeout: 500, // 1초
      });
      throw new Error('로그인 실패');
    }
  },
  // 4-2. [서버 : 회원가입 처리 (신유저 O )]
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
      // 로그인 실패 알림
      if (error.status == 400) {
        Notify.create({
          message: '이미 있는 닉네임입니다.',
          color: 'negative',
          position: 'center', // 중앙 띄우기
          timeout: 500, // 1초
        });
      } else {
        Notify.create({
          message: '지금 서버에 문제가 있습니다. 잠시후 이용해주세요.',
          color: 'negative',
          position: 'center', // 중앙 띄우기
          timeout: 500, // 1초
        });
      }

      throw new Error('회원가입 실패');
    }
  },
  // 5. [서버 : 로그인 후 정보 fecth]
  async fetchUserInfo() {
    try {
      const response = await userApi.get('/api/v2/user/info');
      return response.data;
    } catch (error) {
      // 사용자 정보 가져오기 실패 알림
      Notify.create({
        message: '지금 서버에 문제가 있습니다. 잠시후 이용해주세요.',
        color: 'negative',
        position: 'center', // 중앙 띄우기
        timeout: 500, // 1초
      });
      throw new Error('사용자 정보 가져오기 실패');
    }
  },
};

// <로그아웃>
export const userAuth = {
  // 1. [로그아웃]
  async logoutUser() {
    const userStore = useUserAuthStore(); // 스토어 인스턴스
    const accessToken = userStore.accessToken; // 스토어에서 accessToken 가져오기
    try {
      await userApi.post(
        '/api/v2/user/auth/google/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Bearer 토큰으로 accessToken 전송
          },
        },
      );
      // 2. [다 로그아웃]
      userStore.logout(); // Pinia 스토어에서 로그아웃 처리
    } catch (error) {
      Notify.create({
        message: '지금 서버에 문제가 있습니다. 잠시후 이용해주세요.',
        color: 'negative',
        position: 'center', // 중앙 띄우기
        timeout: 500, // 1초
      });
      throw new Error('로그아웃 실패');
    }
  },
};

// <사용자 계정관리>
export const userInfoService = {
  // 1. [사용자 정보 조회]
  async fetchInfo() {
    try {
      const response = await userApi.get('/api/v2/user/info');
      return response.data;
    } catch (error) {
      Notify.create({
        message: '지금 서버에 문제가 있습니다. 잠시후 이용해주세요.',
        color: 'negative',
        position: 'center', // 중앙 띄우기
        timeout: 500, // 1초
      });
      throw error;
    }
  },
  // 1-1. [사용자 가입일 계산]
  calculateDaysSinceJoined(createAt) {
    if (!createAt) {
      return null;
    }
    const joinedDate = new Date(createAt); // 서버에서 받은 날짜를 Date 객체로 변환
    const currentDate = new Date(); // 현재 날짜를 가져옴
    const differenceInTime = currentDate - joinedDate; // 두 날짜의 차이를 밀리초 단위로 계산
    // 밀리초 단위를 일 단위로 변환
    const differenceInDays = Math.ceil(
      differenceInTime / (1000 * 60 * 60 * 24),
    );
    return differenceInDays;
  },
  // 2. [사용자 닉네임 변경]
  async changeNicknameUser(newNickname) {
    try {
      const response = await userApi.put('/api/v2/user/info/nickname', {
        nickname: newNickname,
      });
    } catch (error) {
      // 로그인 실패 알림
      if (error.status == 400) {
        Notify.create({
          message: '이미 있는 닉네임입니다.',
          color: 'negative',
          position: 'center', // 중앙 띄우기
          timeout: 500, // 1초
        });
      } else {
        Notify.create({
          message: '지금 서버에 문제가 있습니다. 잠시후 이용해주세요.',
          color: 'negative',
          position: 'center', // 중앙 띄우기
          timeout: 500, // 1초
        });
      }
      throw error;
    }
  },
  // 2. [사용자 탈퇴]
  async deactivateUser() {
    try {
      // 1. 탈퇴 요청 (로그아웃 전)
      const response = await userApi.post('/api/v2/user/deactivate');
      console.log('탈퇴 요청 성공:', response.data);
      // 2. 로그아웃 처리 (탈퇴 후)
      await userAuth.logoutUser(); // 로그아웃 로직 호출
      return response.data;
    } catch (error) {
      console.error('탈퇴 요청 실패:', error);
      throw error;
    }
  },
};
