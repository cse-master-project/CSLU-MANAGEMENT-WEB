<template>
  <q-form class="q-pa-md">
    <div class="row justify-end q-mb-md">
      <q-chip small outline class="text-caption text-grey">
        &lt;o/x형&gt;
      </q-chip>
    </div>

    <q-card flat bordered>
      <!-- 문제 내용 -->
      <q-card-section class="bg-primary text-white q-pa-md">
        <div class="label-container">
          <label class="label-quiz">Q. </label>
          <q-input
            v-model="localQuizContent.quiz"
            outlined
            autogrow
            dense
            maxlength="300"
            class="text-subtitle1 input-field"
          />
        </div>
      </q-card-section>
      <q-separator />

      <!-- 정답 표시 -->
      <q-card-section class="answer-container">
        <div class="label-container">
          <label class="label-answer">정답 : </label>
          <q-option-group
            v-model="localQuizContent.answer"
            :options="options"
            class="q-mb-md large-option-group"
          />
        </div>
      </q-card-section>
      <q-separator />

      <!-- 해설 표시 -->
      <q-card-section>
        <div class="label-container">
          <label class="label-commentary">해설 : </label>

          <q-input
            v-model="localQuizContent.commentary"
            outlined
            dense
            autogrow
            maxlength="300"
            class="input-field"
          />
        </div>
      </q-card-section>

      <q-card-section class="btn-container">
        <q-btn
          flat
          color="negative"
          class="my-btn small-btn"
          @click="editCancle"
        >
          수정 취소
        </q-btn>
        <q-btn
          flat
          color="primary"
          class="my-btn small-btn"
          icon="edit"
          @click="submitQuiz"
        >
          수정 완료
        </q-btn>
      </q-card-section>
    </q-card>
  </q-form>
</template>

<script setup>
import { ref } from 'vue';

import { quizPactchApi } from 'src/services/quiz/quizManagement.js';

const options = [
  { label: 'O', value: 1 },
  { label: 'X', value: 0 },
];

// 데이터 받기.(다른 컴포넌트 -> 현재 컴포넌트)
const props = defineProps({
  quizcontent: Object,
  quizzes: Object,
});

// 이벤트 보내기.(현재 컴포넌트 -> 다른 컴포넌트)
const emit = defineEmits(['update:quizcontent', 'update:isEditing']);

const localQuizContent = ref({ ...props.quizcontent });
console.log('퀴즈', localQuizContent);

// 수정 취소 기능
const editCancle = () => {
  emit('update:isEditing', 'false');
};

// 수정 완료 기능.
const submitQuiz = async () => {
  const quizData = {
    quiz: localQuizContent.value.quiz,
    answer: localQuizContent.value.answer,
    commentary: localQuizContent.value.commentary,
  };

  console.log(quizData);
  try {
    // API 호출을 기다린 후 다음 작업을 진행합니다.
    await quizPactchApi(props.quizzes.quizId, quizData);
    alert('수정이 완료되었습니다 ^_^');
    emit('update:quizcontent', localQuizContent.value);
    emit('update:isEditing');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      alert('바뀐게 없습니다 .. ㅜㅠ');
    } else {
      console.error('수정 오류:', error);
      alert('문제 수정 중 오류가 발생했습니다.');
    }
  }
};
</script>

<style scoped>
.option-text {
  padding: 8px;
  font-size: 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.text-caption {
  font-size: 12px;
}

.text-weight-medium {
  font-weight: 500;
}

.text-positive {
  color: #43a047;
}

/* 입력 필드와 라벨을 수평으로 배치 */
.label-container {
  display: flex;
  align-items: center; /* 수직 가운데 정렬 */
  gap: 8px; /* 라벨과 입력 필드 사이 간격 */
}

.input-field {
  flex: 1; /* 입력 필드가 가로로 꽉 차도록 확장 */
}

.my-btn {
  border-radius: 8px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);
  padding: 14px 24px; /* 버튼 패딩을 키워서 버튼 크기를 늘림 */
  font-size: 1.1rem; /* 버튼 글자 크기를 키움 */
  width: auto;
}

.btn-container {
  display: flex;
  flex-direction: row; /* 버튼을 수평으로 정렬 */
  justify-content: center; /* 버튼을 가운데 정렬 */
  gap: 100px; /* 버튼 사이 간격 */
  padding: 0 32px; /* 양옆 마진을 카드와 동일하게 */
  margin-bottom: 20px;
}
</style>
