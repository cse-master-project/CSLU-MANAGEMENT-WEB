<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card class="my-card" v-if="quiz" style="width: 90%; max-width: 600px">
      <!-- 과목, 챕터, 생성일 -->
      <q-card-section class="q-pa-md">
        <div class="text-h6 q-mb-xs text-orange">과목 : {{ quiz.subject }}</div>
        <div class="text-subtitle2 q-mt-sm">
          챕터 : {{ quiz.detailSubject }}
        </div>
        <div class="text-caption text-createAt">
          생성일 : {{ formatDate(quiz.createAt) }}
        </div>
      </q-card-section>

      <!-- 퀴즈 타입에 따라 동적 컴포넌트 표시 -->
      <q-card-section class="q-pa-md">
        <component
          :is="quizTypeViewForm(quiz.quizType)"
          :quizcontent="quizContent"
          v-if="!isEditing"
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

const quiz = ref(null);
const quizPermissionStatus = ref(null);
const rejectReasons = ref([]);
const route = useRoute();
const quizId = Number(route.params.id); // 현재 퀴즈 ID 가져오기

const fetchQuiz = async () => {
  try {
    const response = await userApi.get(`/api/quiz/${quizId}`);
    quiz.value = response.data;
    console.log('신고 문제:', quiz.value);
  } catch (error) {
    console.error('퀴즈 데이터를 불러오는 데 실패했습니다.', error);
  }
};

const fetchQuizPermissionStatus = async () => {
  try {
    const response = await userApi.get('/api/quiz/my');
    const quiz1 = response.data.find(item => item.quizId === quizId);
    quizPermissionStatus.value = quiz1 ? quiz1.permissionStatus : '알 수 없음';
    console.log(
      `Quiz ID ${quizId}의 permissionStatus:`,
      quizPermissionStatus.value,
    );
  } catch (error) {
    console.error('퀴즈 승인 상태를 불러오는 데 실패했습니다.', error);
  }
};

const fetchRejectReasons = async () => {
  try {
    const response = await userApi.get('/api/quiz/my/reject', {
      params: { quizId },
    });
    rejectReasons.value = response.data;
    console.log('반려 이유:', rejectReasons.value);
  } catch (error) {
    console.error('반려 이유를 불러오는 데 실패했습니다.', error);
  }
};

const formatDate = dateString => {
  return date.formatDate(dateString, 'YYYY-MM-DD HH:mm:ss');
};

const quizContent = computed(() => {
  if (quiz.value && quiz.value.jsonContent) {
    try {
      return JSON.parse(quiz.value.jsonContent);
    } catch (e) {
      console.error('JSON 파싱 오류:', e);
      return null;
    }
  }
  return null;
});

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
  fetchQuiz();
  fetchQuizPermissionStatus();
  fetchRejectReasons();
});
</script>
