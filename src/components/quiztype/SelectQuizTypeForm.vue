<template>
  <q-page>
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
      <q-btn @click="emitQuizType" class="createbtn">문제생성</q-btn>
    </q-card>
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
};

const emitQuizType = () => {
  emits('quiz-type-selected', selectedQuizType.value);
};
</script>

<style>
.quiztype-container {
  display: flex;
  flex-direction: column; /* 이 부분을 추가하여 세로 나열 */
  align-items: center; /* 가운데 정렬 */
  padding: 0 16px;
  max-width: 800px;
  margin: auto;
}

.q-card.text-center {
  margin: 20px auto;
  padding: 20px;
  border-radius: 20px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
}

.createbtn {
  padding: 12px 24px;
  background-color: hsl(188, 51%, 54%);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 30%;
  margin-top: 20px;
}
.quiz-type-btn {
  padding: 12px 24px;
  background-color: hsl(192, 29%, 84%);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 30%;
  margin-top: 20px;
}

.createbtn:hover,
.quiz-type-btn:hover {
  background-color: hsl(188, 51%, 54%);
}

.selected-btn {
  background-color: hsl(188, 51%, 54%); /* 선택된 버튼의 배경 색상 */
}

/* 추가된 스타일 */
.quiz-type-btn {
  margin: 10px; /* 버튼 간격 조절 */
}
</style>
