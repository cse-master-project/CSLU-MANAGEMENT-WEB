<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card class="my-card" v-if="quizzes" style="width: 90%; max-width: 600px">
      <!-- 과목, 챕터, 생성일 -->
      <q-card-section class="q-pa-md">
        <div>퀴즈 ID : {{ quizzes.quizId }}</div>
        <div class="text-h6 q-mb-xs text-orange">
          과목 : {{ quizzes.subject }}
        </div>
        <div class="text-subtitle2 q-mt-sm">챕터 : {{ quizzes.chapter }}</div>

        <!-- 이미지 표시 -->
        <div v-if="imageUrl" class="q-mt-md">
          <img
            :src="imageUrl"
            alt="문제 이미지"
            style="max-width: 100%; height: auto; border-radius: 8px"
          />
        </div>
      </q-card-section>

      <!-- 퀴즈 타입에 따라 동적 컴포넌트 표시 -->
      <q-card-section class="q-pa-md">
        <component
          :is="quizTypeViewForm(quizzes.quizType)"
          :quizcontent="quizContent"
        />
      </q-card-section>

      <!-- 승인 상태 및 반려 이유 표시 -->
      <q-card-section class="q-pa-md">
        <QuizPermissionStatus2
          :quizPermissionStatus="quizPermissionStatus"
          :rejectReasons="rejectReasons"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script setup>
import QuizPermissionStatus2 from 'src/components/quiz/QuizPermissionStatus2.vue';
import { ref, computed, defineAsyncComponent, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { userApi } from 'src/boot/userAxios';
import { date } from 'quasar';
import { fetchQuiz, fetchQuizImage } from 'src/services/quiz/userQuizDetail.js';

const quiz = ref(null);

const quizzes = ref([]);
const quizPermissionStatus = ref(null);
const rejectReasons = ref([]);
const route = useRoute();
const quizId = Number(route.params.id); // 현재 퀴즈 ID 가져오기

// 이미지 URL 상태
const imageUrl = ref(null);

// 서버에서 퀴즈 데이터 가져오기.
const fetchQuizzes = async () => {
  try {
    const data = await fetchQuiz(quizId);
    quizzes.value = data;
    // console.log('서버에서 가져온 quiz value : ', quizzes.value);
    // hasImage가 true이면 이미지를 가져옴
    if (quizzes.value.hasImage) {
      await fetchImage(); // 이미지 로드 함수 호출
    }
  } catch (error) {
    console.error('퀴즈 데이터를 불러오는데 실패했습니다.', error);
  }
};
// 서버에서 이미지 가져오기
const fetchImage = async () => {
  try {
    const base64String = await fetchQuizImage(quizId);
    imageUrl.value = `data:image/png;base64,${base64String}`;
  } catch (error) {
    console.error('이미지 데이터를 불러오는 데 실패했습니다.', error);
  }
};

// 승인 여부 가져오기
const fetchQuizPermissionStatus = async () => {
  try {
    const response = await userApi.get('/api/v2/quiz/my');
    const quiz1 = response.data.content.find(item => item.quizId === quizId);
    quizPermissionStatus.value = quiz1 ? quiz1.permissionStatus : '알 수 없음';
    // console.log(
    //   `Quiz ID ${quizId}의 permissionStatus:`,
    //   quizPermissionStatus.value,
    // );
  } catch (error) {
    console.error('퀴즈 승인 상태를 불러오는 데 실패했습니다.', error);
  }
};
// 반려 이유 가져오기
const fetchRejectReasons = async () => {
  try {
    const response = await userApi.get('/api/v2/quiz/my/reject', {
      params: { quizId },
    });
    rejectReasons.value = response.data;

    //console.log('반려 이유:', rejectReasons.value);
  } catch (error) {
    console.error('반려 이유를 불러오는 데 실패했습니다.', error);
  }
};

const formatDate = dateString => {
  return date.formatDate(dateString, 'YYYY-MM-DD HH:mm:ss');
};
// JSON 파싱.
const quizContent = computed(() => {
  if (quizzes.value && quizzes.value.jsonContent) {
    try {
      return JSON.parse(quizzes.value.jsonContent);
    } catch (e) {
      console.error('JSON 파싱 오류:', e);
      return null;
    }
  }
  return null;
});

// 퀴타입별 보여주기.(View)
const quizTypeViewForm = quizType => {
  switch (quizType) {
    case 1:
      return defineAsyncComponent(() =>
        import('src/components/quiztype/quizView/MultipleChoiceView.vue'),
      );
    case 2:
      return defineAsyncComponent(() =>
        import('src/components/quiztype/quizView/ShortAnswerView.vue'),
      );
    case 3:
      return defineAsyncComponent(() =>
        import('src/components/quiztype/quizView/MatchingView.vue'),
      );
    case 4:
      return defineAsyncComponent(() =>
        import('src/components/quiztype/quizView/TrueOrFalseView.vue'),
      );
    case 5:
      return defineAsyncComponent(() =>
        import('src/components/quiztype/quizView/FillInTheBlank.vue'),
      );
    default:
      return null;
  }
};

onMounted(() => {
  fetchQuizzes();
  fetchQuizPermissionStatus();
  fetchRejectReasons();
});
</script>
