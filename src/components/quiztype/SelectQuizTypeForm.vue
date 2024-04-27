<template>
  <q-page>
    <q-card class="text-center" flat>
      <div class="quiztype-container">
        <div
          v-for="quizType in quizTypes"
          :key="quizType.id"
          class="quiztype-radio-box"
        >
          <input
            type="radio"
            :id="'quiztype-' + quizType.id"
            :value="quizType.value"
            v-model="selectedQuizType"
            class="info-radio-box-input"
          />
          <label :for="'quiztype-' + quizType.id" class="info-checkbox-label">
            <span
              :class="{ checked: selectedQuizType === quizType.value }"
              class="info-checkbox-span"
              >{{ quizType.name }}</span
            >
          </label>
        </div>
      </div>
      <q-btn @click="emitQuizType" style="width: 30%; margin-top: 20px"
        >문제생성</q-btn
      >
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
const selectedQuizType = ref('');
const emits = defineEmits(['quiz-type-selected']);
// 퀴즈 타입 리스트
const quizTypes = ref([
  { id: 1, value: 'MultipleChoice', name: '4지선다형' },
  { id: 2, value: 'ShortAnswer', name: '단답형' },
  { id: 3, value: 'Matching', name: '선긋기형' },
  { id: 4, value: 'TrueOrFalse', name: 'o/x형' },
  { id: 5, value: 'FillInTheBlank', name: '빈칸 채우기형' },
]);
const emitQuizType = () => {
  emits('quiz-type-selected', selectedQuizType.value);
};
</script>

<style>
.quiztype-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.q-card.text-center {
  margin: 20px auto;
  padding: 10px;
  border-radius: 20px;
  border: 2px solid #000;
}

.createbtn {
  width: fit-content;
  padding: 16px;
  background-color: #191b27;
  border-radius: 12px;
  color: white;
  font-weight: bold;
  cursor: pointer;
}
.info-radio-box-input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.info-checkbox-span.checked {
  background-color: #0091da;
  color: white;
}

.info-checkbox-label {
  cursor: pointer;
}

.info-checkbox-span {
  display: inline-block;
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 20px;
}
</style>
