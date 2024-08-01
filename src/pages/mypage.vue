<template>
  <q-page>
    <q-card class="q-pa-md q-mx-auto q-my-lg" flat bordered>
      <div class="text-center">
        <q-title class="title q-mb-md"
          >{{ userInfo.nickname }}님의 정보</q-title
        >
        <q-separator dark class="q-my-md" />
        <q-card-section>
          <p class="q-mb-md">
            저의 서비스와 함께 한 지
            <strong>{{ daysSinceJoined }}일</strong> 입니다
          </p>
          <!-- 가입한지 며칠 지났는지 표시 -->
        </q-card-section>
        <q-separator dark class="q-my-md" />
        <q-card-actions align="center">
          <q-btn color="negative" class="quiz-type-btn" @click="deactivate"
            >탈퇴하기</q-btn
          >
        </q-card-actions>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { useUserAuthStore } from 'src/stores/userAuth'; // 사용자 인증 상태관리
import { ref, onMounted } from 'vue';
import { userApi } from 'src/boot/userAxios'; // userAxios 파일에서 userApi를 가져옴

const userStore = useUserAuthStore();

const userInfo = ref({});
const daysSinceJoined = ref(null);

onMounted(async () => {
  await fetchInfo();
  calculateDaysSinceJoined();
});

// 내 정보 가져오기
const fetchInfo = async () => {
  try {
    const response = await userApi.get('/api/user/info');
    userInfo.value = response.data;
    console.log('사용자 정보 : ', userInfo.value);
  } catch (error) {
    console.error('실패', error);
  }
};

// 탈퇴요청 기능
const deactivate = async () => {
  console.log(userStore.accessToken);
  try {
    const response = await userApi.post('/api/user/deactivate');
    console.log('탈퇴 요청 성공:', response.data);
  } catch (error) {
    console.error('탈퇴 요청 실패:', error);
  }
};

// 가입한지 며칠 지났는지 계산하는 함수
const calculateDaysSinceJoined = () => {
  if (!userInfo.value.createAt) {
    console.error('createAt 값이 없습니다.');
    return;
  }
  // 서버에서 받은 날짜를 Date 객체로 변환
  const joinedDate = new Date(userInfo.value.createAt);

  // 현재 날짜를 가져옴
  const currentDate = new Date();

  // 두 날짜의 차이를 밀리초 단위로 계산
  const differenceInTime = currentDate - joinedDate;

  // 밀리초 단위를 일 단위로 변환
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));

  // 가입한지 며칠 지났는지 설정
  daysSinceJoined.value = differenceInDays;
};
</script>

<style lang="scss" scoped>
.q-card {
  max-width: 400px;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
}

p {
  font-size: 1.2rem;
  color: #555;
}

.q-btn {
  width: 100%;
  font-size: 1rem;
}
</style>
