<template>
  <q-page class="page">
    <div class="center-container">
      <q-title class="title">문제 유형 선택</q-title>
      <q-card class="text-center" flat>
        <div class="quiztype-container">
          <q-btn
            v-for="quizType in quizTypes"
            :key="quizType.id"
            :class="{ 'selected-btn': selectedQuizType === quizType.value }"
            class="quiz-type-btn"
            @click="selectQuizType(quizType.value)"
          >
            {{ quizType.name }}
          </q-btn>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';

const selectedQuizType = ref('');
const emits = defineEmits(['quiz-type-selected']);

const quizTypes = ref([
  { id: 1, value: 'MultipleChoice', name: '4지선다형' },
  { id: 2, value: 'ShortAnswer', name: '단답형' },
  { id: 3, value: 'Matching', name: '선긋기형' },
  { id: 4, value: 'TrueOrFalse', name: 'o/x형' },
  { id: 5, value: 'FillInTheBlank', name: '빈칸 채우기형' },
]);

const selectQuizType = value => {
  selectedQuizType.value = value;
  emitQuizType(); // 퀴즈 유형을 선택하자마자 내보냅니다.
};

const emitQuizType = () => {
  emits('quiz-type-selected', selectedQuizType.value);
};
</script>

<style>
.page {
  height: 80vh; /* 페이지 전체 높이 설정 */
  display: flex;
  justify-content: center;
}

.center-container {
  display: flex;
  justify-content: center; /* 가로 중앙 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  flex-direction: column;
  height: 100%; /* 부모 컨테이너의 전체 높이 사용 */
  width: 70%; /* 부모 컨테이너의 전체 너비 사용 */
}

.title {
  font-size: 2rem;
  font-family: 'NotoB', sans-serif;
  margin-right: auto;
}

.quiztype-container {
  flex-direction: column; /* 세로 나열 */
  align-items: center; /* 가운데 정렬 */
  padding: 0 16px;
  width: 100%;
}

.q-card.text-center {
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.quiz-type-btn {
  padding: 12px 24px;
  background-color: #ffffff;
  border-radius: 20px;
  border: none;
  color: black;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 80%;
  margin: 3%;
}

.createbtn:hover,
.quiz-type-btn:hover {
  background-color: #0091da;
  color: white;
}
@font-face {
  font-family: 'NotoB';
  src: url('/NotoSansKR-Bold.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
</style>
