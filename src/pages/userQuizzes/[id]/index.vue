<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-card class="my-card" v-if="currentQuiz">
        <q-card-section>
          <div class="text-h5">{{ currentQuiz.subject }}</div>
          <div class="text-subtitle2 q-mt-xs">
            {{ currentQuiz.detailSubject }}
          </div>
        </q-card-section>

        <!-- 퀴즈 승인 상태 -->
        <QuizPermssionStatus :quiz="currentQuiz" />

        <!-- 여기서부터 퀴즈 내용을 표시하는 부분입니다. -->
        <q-card-section v-if="quizContent">
          <div>{{ quizContent.quiz }}</div>
          <q-option-group
            :options="quizOptions"
            v-model="selectedOption"
            inline
          ></q-option-group>
          <div v-if="selectedOption === quizContent.answer">
            정답입니다! {{ quizContent.commentary }}
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import QuizPermssionStatus from 'src/components/quiz/QuizPermissionStatus.vue';
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const quizzes = ref([
  {
    quizId: 1,
    subject: '자료구조',
    detailSubject: '스택',
    jsonContent:
      '{"type" : "1","quiz" : "맞는 답을 고르시오.","option" : ["101호", "102호", "103호", "104호"],"answer" : "4", "commentary" : "해설 ~~~"}',
    createAt: '2024-04-27T11:38:12.753Z',
    permission: 0,
  },
  {
    quizId: 2,
    subject: 'c언어',
    detailSubject: '포인터',
    jsonContent: '{}',
    createAt: '2024-04-27T11:40:00.000Z',
    permission: 1,
  },
  {
    quizId: 3,
    subject: '파이썬',
    detailSubject: 'list',
    jsonContent: '{}',
    createAt: '2024-04-27T11:42:00.000Z',
    permission: 2,
  },
]);

// 현재 라우터 파라미터 가져오기
const route = useRoute();
const quizId = route.params.id;
const currentQuiz = computed(() => {
  return quizzes.value.find(q => q.quizId === parseInt(quizId));
});

const selectedOption = ref('');

// jsonContent를 파싱하여 quizContent에 저장
const quizContent = computed(() => {
  if (currentQuiz.value) {
    return JSON.parse(currentQuiz.value.jsonContent);
  }
  return null;
});

// 퀴즈 옵션을 quizContent에서 추출
const quizOptions = computed(() => {
  if (quizContent.value && quizContent.value.option) {
    return quizContent.value.option.map((option, index) => ({
      label: option,
      value: String(index + 1), // 옵션의 인덱스를 값으로 사용합니다.
    }));
  }
  return [];
});
</script>

<style>
.my-card {
  max-width: 400px;
  margin: auto;
}
</style>
