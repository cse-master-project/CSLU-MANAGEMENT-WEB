<template>
  <q-page class="page">
    <div class="center-container">
      <q-toolbar-title class="title">문제 유형 선택</q-toolbar-title>
      <q-card class="text-center" flat>
        <!--사진 + 텍스트 조합-->
        <div class="quiztype-container">
          <div
            v-for="quizType in quizTypes"
            :key="quizType.id"
            :class="{ 'selected-btn': selectedQuizType === quizType.value }"
            class="quiz-type-btn"
            @click="selectQuizType(quizType.value)"
          >
            <div class="quiz-type-image-container">
              <img
                :src="quizType.image"
                alt="Quiz Type Image"
                class="quiz-type-image"
              />
            </div>
            <hr class="line" />
            <div class="quiz-type-text">
              {{ quizType.name }}
            </div>
          </div>
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
  {
    id: 1,
    value: 'MultipleChoice',
    name: '4지선다형',
    image: '/quizimg/m_c.png',
  },
  {
    id: 2,
    value: 'ShortAnswer',
    name: '단답형',
    image: '/quizimg/s_a.png',
  },
  {
    id: 3,
    value: 'Matching',
    name: '선긋기형',
    image: '/quizimg/mat.png',
  },
  {
    id: 4,
    value: 'TrueOrFalse',
    name: 'o/x형',
    image: '/quizimg/t_f.png',
  },
  {
    id: 5,
    value: 'FillInTheBlank',
    name: '빈칸 채우기형',
    image: '/quizimg/f_b.png',
  },
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
  height: 50vh;
  display: flex;
  justify-content: center;
}

.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  width: 90%;
}

.title {
  font-size: 2rem;
  font-family: 'NotoB', sans-serif;
  margin-right: auto;
}

.quiztype-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 150px;
  height: 150px;
  background-color: #ffffff;
  border-radius: 20px;
  border: 1px solid #e0e0e0;
  color: black;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  margin: 10% auto;
}

.quiz-type-btn:hover {
  transform: scale(1.075);
  border: 2px solid #99c6ec;
}

.quiz-type-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 66%;
  width: 100%;
  overflow: hidden;
}

.quiz-type-image {
  max-width: 80px;
  max-height: 80px;
}

.quiz-type-text {
  height: 33%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
}

.line {
  width: 80%;
  padding: 0;
  border-top: 1px solid #ccc;
}
@media (max-width: 430px) {
  .page {
    height: 140vh;
  }
}
</style>
