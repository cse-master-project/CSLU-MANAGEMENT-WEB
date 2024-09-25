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
import { ref, onMounted } from 'vue';
import { userInfoService } from 'src/services/userAuth'; // 분리한 서비스 파일
import { useRouter } from 'vue-router'; // 라우터 가져오기

const userInfo = ref({});
const daysSinceJoined = ref(null);

onMounted(async () => {
  await fetchUserInfo(); // 사용자 정보 가져오기
  calculateDaysSinceJoined(); // 가입 날짜 계산
});

// 사용자 정보 가져오는 함수
const fetchUserInfo = async () => {
  try {
    userInfo.value = await userInfoService.fetchInfo();
    console.log('사용자 정보:', userInfo.value);
  } catch (error) {
    console.error('사용자 정보 가져오기 실패:', error);
  }
};

const router = useRouter(); // 라우터 사용 준비

// 탈퇴 요청 함수
const deactivate = async () => {
  try {
    await userInfoService.deactivateUser();
    alert('탈퇴 되었습니다.');
    console.log('탈퇴 요청 성공');
    // 탈퇴 후 /home 페이지로 리디렉션
    router.push('/home');
  } catch (error) {
    console.error('탈퇴 요청 실패:', error);
  }
};

// 가입한지 며칠 지났는지 계산하는 함수
const calculateDaysSinceJoined = () => {
  if (userInfo.value.createAt) {
    daysSinceJoined.value = userInfoService.calculateDaysSinceJoined(
      userInfo.value.createAt,
    );
  }
};
</script>
