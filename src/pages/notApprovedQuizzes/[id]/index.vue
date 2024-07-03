<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card
      class="my-card"
      v-if="currentQuiz"
      style="width: 90%; max-width: 600px"
    >
      <!-- 대분류, 소분류, 만든날짜 -->
      <q-card-section class="q-pa-md">
        <div class="text-h6 q-mb-xs text-orange">{{ currentQuiz.subject }}</div>
        <div class="text-subtitle2 q-mt-sm">
          {{ currentQuiz.detailSubject }}
        </div>
        <div class="text-caption text-createAt">
          {{ formatDate(currentQuiz.createAt) }}
        </div>
      </q-card-section>

      <!-- 퀴즈 타입에 따라 동적 컴포넌트 표시 -->
      <q-card-section class="q-pa-md">
        <component :is="quizTypeViewForm(type)" :quizcontent="quizContent" />
      </q-card-section>

      <q-card-section>
        사용자 ID : {{ currentQuiz.userNickname }}
      </q-card-section>

      <q-card-actions align="right" class="q-px-md q-py-sm">
        <q-btn flat color="negative" class="q-mr-sm" @click="notPermission"
          >반려</q-btn
        >
        <q-btn flat color="primary" @click="submitQuiz">문제 등록</q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, defineAsyncComponent, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { api } from 'src/boot/axios';
import { date } from 'quasar';

const quizzes = ref([]);
const route = useRoute(); // 현재 라우터 파라미터 가져오기
const quizId = ref(route.params.id); // 현재 퀴즈 찾기

const currentQuiz = ref(null);
const quizContent = ref(null);
const type = ref(null);

const fetchQuizzes = async () => {
  try {
    const response = await api.get('/api/management/quiz/unapproved');
    quizzes.value = response.data; // 서버로부터 받아온 데이터를 quizzes에 저장
    console.log(quizzes.value);
    updateCurrentQuiz();
  } catch (error) {
    console.error('퀴즈 데이터를 불러오는데 실패했습니다.', error);
  }
};

const updateCurrentQuiz = () => {
  currentQuiz.value = quizzes.value.find(
    q => q.quizId === parseInt(quizId.value),
  );
  if (currentQuiz.value && currentQuiz.value.jsonContent) {
    try {
      quizContent.value = JSON.parse(currentQuiz.value.jsonContent);
    } catch (e) {
      console.error('JSON 파싱 오류:', e);
      quizContent.value = null;
    }
  } else {
    quizContent.value = null;
  }
  type.value = currentQuiz.value ? currentQuiz.value.quizType.toString() : null;
};

const quizTypeViewForm = quizType => {
  switch (quizType) {
    case '1':
      return defineAsyncComponent(() =>
        import('src/components/quiztype/quizView/MultipleChoiceView.vue'),
      );
    case '2':
      return defineAsyncComponent(() =>
        import('src/components/quiztype/quizView/ShortAnswerView.vue'),
      );
    case '3':
      return defineAsyncComponent(() =>
        import('src/components/quiztype/quizView/MatchingView.vue'),
      );
    case '4':
      return defineAsyncComponent(() =>
        import('src/components/quiztype/quizView/TrueOrFalseView.vue'),
      );
    case '5':
      return defineAsyncComponent(() =>
        import('src/components/quiztype/quizView/FillInTheBlank.vue'),
      );
    default:
      return null;
  }
};

const formatDate = dateString => {
  return date.formatDate(dateString, 'YYYY-MM-DD HH:mm:ss');
};

// 퀴즈 데이터가 업데이트되거나 quizId가 변경될 때마다 현재 퀴즈와 관련 데이터를 업데이트
watch([quizzes, quizId], updateCurrentQuiz);

onMounted(() => {
  fetchQuizzes();
});
</script>

<style>
.my-card {
  max-width: 400px;
  margin: auto;
}
</style>

<route lang="yaml">
meta:
  layout: admin
</route>
