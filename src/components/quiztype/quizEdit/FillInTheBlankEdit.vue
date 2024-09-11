<template>
  <q-form class="form-container">
    <div class="title-container">
      <q-title class="title">빈칸 채우기형</q-title>
    </div>
    <q-card>
      <q-card-section class="quiz-container">
        <q-label class="label-quiz">질문</q-label>
        <q-input
          v-model="localQuizContent.quiz"
          type="textarea"
          autogrow
          outlined
          dense
          placeholder="문제를 입력해주세요."
          maxlength="300"
          counter
          class="input-quiz"
        />
      </q-card-section>
      <!-- 답 입력 -->
      <q-card-section class="answer-container">
        <q-label class="label-answer">답안</q-label>
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
            placeholder="답안 입력해주세요 (다수일 경우 , 로 구분) "
            maxlength="100"
            counter
          />
        </div>
      </q-card-section>
      <!-- 해설 입력 -->
      <q-card-section class="comment-container">
        <q-label class="label-quiz">해설 </q-label>
        <q-input
          v-model="localQuizContent.commentary"
          type="textarea"
          autogrow
          outlined
          placeholder="해설을 입력하세요"
          dense
          maxlength="300"
          counter
          class="input-commentary"
      /></q-card-section>
      <q-card-section class="btn-container">
        <q-btn class="btn-back" @click="editCancle"> 수정 취소 </q-btn>
        <q-btn class="btn-submit" @click="submitQuiz"> 수정 완료 </q-btn>
      </q-card-section>
    </q-card>
  </q-form>
</template>

<script setup>
import { ref } from 'vue';
import { api } from 'src/boot/axios';

// 데이터 받기.(다른 컴포넌트 -> 현재 컴포넌트)
const props = defineProps({
  quizcontent: Object,
  quizzes: Object,
});

// 이벤트 보내기.(현재 컴포넌트 -> 다른 컴포넌트)
const emit = defineEmits(['update:quizcontent', 'update:isEditing']);

const localQuizContent = ref({ ...props.quizcontent });

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

  try {
    const response = await api.patch(
      `/api/management/quiz/${props.quizzes.quizId}`,
      quizData,
    );
    console.log('응답:', response.data); // 서버 응답 확인
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

<style>
.form-container {
  max-width: 1000px;
  margin-bottom: 20px;
}

.q-card {
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.title-container {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 20px;
}
.title {
  font-size: 2rem;
  color: #0080ff;
}

.quiz-container {
  display: flex;
  justify-content: center; /* 중앙 정렬 */
  align-items: baseline; /* 수직 중앙 정렬 */
}
.label-quiz {
  font-size: 1rem;
  color: #000000;
  margin-right: 15px;
  font-weight: bold;
}
.input-quiz {
  width: 80%;
}

.answer-container {
  display: flex;
  justify-content: center; /* 중앙 정렬 */
  align-items: baseline; /* 수직 중앙 정렬 */
}
.label-answer {
  font-size: 1rem;
  color: #000000;
  margin-right: 15px;
  font-weight: bold;
}
.input-answer {
  width: 80%;
}

.comment-container {
  display: flex;
  justify-content: center; /* 중앙 정렬 */
  align-items: baseline; /* 수직 중앙 정렬 */
}
.input-commentary {
  width: 80%;
}

.btn-container {
  display: flex;
  justify-content: end; /* 중앙 정렬 */
  justify-content: space-evenly; /* 중앙 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
}
.btn-back {
  background-color: rgb(213, 213, 213);
}
.btn-submit {
  background-color: primary;
}
</style>
