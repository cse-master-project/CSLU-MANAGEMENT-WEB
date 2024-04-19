<template>
  <q-form class="q-pa-md">
    <q-card>
      <q-card-section class="text-h6">단답형 문제 만들기</q-card-section>

      <q-card-section>
        <q-input v-model="quizTitle" label="문제 제목" class="q-mb-md" />

        <q-select
          v-model="mainCategory"
          :options="mainCategoryOptions"
          label="대분류"
          class="q-mb-md"
        />
        <q-select
          v-model="subCategory"
          :options="subCategoryOptions"
          label="소분류"
          class="q-mb-md"
        />

        <q-input
          v-model="question"
          label="문제 내용"
          type="textarea"
          class="q-mb-md"
        />

        <q-input v-model="correctAnswer" label="정답" class="q-mb-md" />

        <q-input
          v-model="explanation"
          label="문제 해설"
          type="textarea"
          class="q-mb-md"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          @click="submitQuiz"
          label="문제 제출"
          color="positive"
          class="q-mr-sm"
        />
        <q-btn @click="goBack" label="뒤로가기" color="primary" flat />
      </q-card-actions>
    </q-card>
  </q-form>
</template>

<script setup>
import { ref } from 'vue';

const emits = defineEmits(['change-quiz-type']);

const quizTitle = ref('');
const mainCategory = ref('');
const subCategory = ref('');
const question = ref('');
const correctAnswer = ref('');
const explanation = ref('');

// 대분류와 소분류를 위한 콤보박스 옵션 예시
const mainCategoryOptions = [
  { label: '과일', value: 'Fruit' },
  { label: 'c언어', value: 'C' },
  { label: '파이썬', value: 'Python' },
  { label: '자료구조', value: 'Data structure' },
];

const subCategoryOptions = [
  { label: '색', value: 'Color' },
  { label: '스택', value: 'Stack' },
  { label: '큐', value: 'Queue' },
  { label: '그래프', value: 'Graph' },
];

const goBack = () => {
  emits('change-quiz-type', '');
};

const submitQuiz = () => {
  // 여기에 문제 제출 로직을 구현합니다.
  console.log('제출된 문제:', {
    quizTitle: quizTitle.value,
    mainCategory: mainCategory.value,
    subCategory: subCategory.value,
    question: question.value,
    correctAnswer: correctAnswer.value,
    explanation: explanation.value,
  });
};
</script>

<style lang="scss" scoped></style>
