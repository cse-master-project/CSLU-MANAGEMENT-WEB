<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card
      class="my-card"
      v-if="currentQuiz"
      style="width: 90%; max-width: 600px"
    >
      <!-- 과목, 챕터, 생성일 -->
      <q-card-section class="q-pa-md">
        <div class="text-h6 q-mb-xs text-orange">
          과목 : {{ currentQuiz.subject }}
        </div>
        <div class="text-subtitle2 q-mt-sm">
          챕터 : {{ currentQuiz.detailSubject }}
        </div>
        <div class="text-caption text-createAt">
          생성일 : {{ formatDate(currentQuiz.createAt) }}
        </div>
      </q-card-section>

      <!-- 퀴즈 타입에 따라 동적 컴포넌트 표시 -->
      <q-card-section class="q-pa-md">
        <component :is="quizTypeViewForm(type)" :quizcontent="quizContent" />
      </q-card-section>
      <q-card-section>사용자 ID : {{ currentQuiz.userId }}</q-card-section>

      <q-card-actions align="right" class="q-px-md q-py-sm">
        <q-btn flat color="negative" class="q-mr-sm" @click="notPermission"
          >반려</q-btn
        >
        <q-btn flat color="primary" @click="submitQuiz">문제등록</q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, defineAsyncComponent, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { api } from 'src/boot/axios';

const quizzes = ref([]);

const route = useRoute(); // 현재 라우터 파라미터 가져오기
const quizId = route.params.id; // 현재 퀴즈 찾기
const currentQuiz = computed(() => {
  return quizzes.value.find(q => q.quizId === parseInt(quizId));
});

// 현재 퀴즈 내용 찾기(JSON). jsonContent를 파싱하여 quizContent에 저장
const quizContent = computed(() => {
  if (currentQuiz.value && currentQuiz.value.jsonContent) {
    try {
      return JSON.parse(currentQuiz.value.jsonContent);
    } catch (e) {
      console.error('JSON 파싱 오류:', e);
      return null;
    }
  }
  return null;
});

const type = computed(() => {
  return currentQuiz.value ? currentQuiz.value.quizType.toString() : null;
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

// 서버에서 데이터 가져오기
const fetchQuizzes = async () => {
  try {
    const response = await api.get('/api/quiz/user');
    quizzes.value = response.data.content; // 서버로부터 받아온 데이터를 quizzes에 저장
    console.log(quizzes.value);
  } catch (error) {
    console.error('퀴즈 데이터를 불러오는데 실패했습니다.', error);
  }
};

// 퀴즈 등록 함수
// const submitQuiz = async () => {
//   try {
//     const response = await api.post(`/api/quiz/submit/${currentQuiz.value.quizId}`);
//     console.log('퀴즈 등록 성공:', response.data);
//     alert('퀴즈가 성공적으로 등록되었습니다.');
//   } catch (error) {
//     console.error('퀴즈 등록 실패:', error);
//     alert('퀴즈 등록에 실패했습니다.');
//   }
// };

// 퀴즈 반려 함수
// const notPermission = async () => {
//   try {
//     const response = await api.post(`/api/quiz/reject/${currentQuiz.value.quizId}`);
//     console.log('퀴즈 반려 성공:', response.data);
//     alert('퀴즈가 반려되었습니다.');
//   } catch (error) {
//     console.error('퀴즈 반려 실패:', error);
//     alert('퀴즈 반려에 실패했습니다.');
//   }
// };

onMounted(() => {
  fetchQuizzes();
  console.log('currentQuiz:', currentQuiz.value);
  console.log('quizContent:', quizContent.value);
  console.log('type:', type.value);
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
