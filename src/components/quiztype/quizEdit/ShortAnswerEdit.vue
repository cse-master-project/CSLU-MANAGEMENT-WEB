<template>
  <q-form class="q-pa-md">
    <div class="row justify-end q-mb-md">
      <q-chip small outline class="text-caption text-grey">
        &lt;단답형&gt;
      </q-chip>
    </div>

    <q-card flat bordered>
      <!-- 문제 내용 -->
      <q-card-section class="bg-primary text-white q-pa-md content-section">
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
          <div
            v-for="(answer, index) in localQuizContent.answer"
            :key="index"
            class="q-mb-md input-answer"
          >
            <q-input
              v-model="localQuizContent.answer[index]"
              type="textarea"
              autogrow
              outlined
              dense
              placeholder="답안 입력해주세요. "
              maxlength="300"
              counter
              class="input-field"
            />
          </div>
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
    </q-card>
    <div class="button-container">
      <q-btn
        flat
        color="negative"
        class="my-btn small-btn"
        icon="close"
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
    </div>
  </q-form>
</template>

<script setup>
import { ref } from 'vue';
import { quizPactchApi } from 'src/services/quiz/quizManagement.js';

// 데이터 받기.(다른 컴포넌트 -> 현재 컴포넌트)
const props = defineProps({
  quizcontent: Object,
  quizzes: Object,
});

// 이벤트 보내기.(현재 컴포넌트 -> 다른 컴포넌트)
const emit = defineEmits(['update:quizcontent', 'update:isEditing']);

// 서버에서 받아온 answer를 배열로 그대로 사용
const localQuizContent = ref({
  ...props.quizcontent,
  answer: [...props.quizcontent.answer], // 배열을 복사하여 사용
});

// 수정 취소 기능
const editCancle = () => {
  emit('update:isEditing', 'false');
};

// 답안 정리 함수
const normalizeAnswers = answers => {
  return answers
    .map(
      answer =>
        answer
          .split(',') // 콤마로 구분
          .map(part => part.trim()) // 각 부분의 앞뒤 공백 제거
          .filter(part => part) // 빈 값 제거
          .join(', '), // 다시 콤마와 공백으로 구분된 문자열로 변환
    )
    .filter(answer => answer); // 빈 값 제거 후 최종 배열 반환
};

// 수정 완료 기능
const submitQuiz = async () => {
  // 답안 정리
  const normalizedAnswers = normalizeAnswers(localQuizContent.value.answer);

  const quizData = {
    quiz: localQuizContent.value.quiz,
    answer: normalizedAnswers, // 정리된 배열 전송
    commentary: localQuizContent.value.commentary,
  };
  const confirmation = confirm('수정 하시겠습니까 ?');
  if (!confirmation) {
    return;
  }
  try {
    await quizPactchApi(props.quizzes.quizId, quizData);
    alert('수정이 완료되었습니다 ^_^');
    // 수정된 데이터를 부모 컴포넌트에 전달
    emit('update:quizcontent', localQuizContent.value);
    emit('update:isEditing', false);
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
  width: 200px;
}

.button-container {
  display: flex;
  flex-direction: row; /* 버튼을 수평으로 정렬 */
  justify-content: center; /* 버튼을 가운데 정렬 */
  gap: 100px; /* 버튼 사이 간격 */
  padding: 0 32px; /* 양옆 마진을 카드와 동일하게 */
  margin-top: 30px;
}
</style>
