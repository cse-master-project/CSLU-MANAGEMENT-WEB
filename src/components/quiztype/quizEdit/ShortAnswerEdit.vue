<template>
  <div class="q-mb-md form">
    <div class="text-h6 q-mb-md">문제 유형: 단답형</div>
    <q-input
      v-model="localQuizContent.quiz"
      label="문제"
      outlined
      autogrow
      dense
      maxlength="300"
    />

    <q-input
      v-model="localQuizContent.answer"
      label="정답"
      outlined
      dense
      autogrow
      maxlength="300"
    />

    <q-input
      v-model="localQuizContent.commentary"
      label="해설"
      outlined
      dense
      autogrow
      maxlength="300"
    />
    <q-btn
      flat
      color="negative"
      class="my-btn small-btn"
      icon="edit"
      @click="editCancle"
    >
      수정 취소
    </q-btn>
    <q-btn
      flat
      color="negative"
      class="my-btn small-btn"
      icon="edit"
      @click="submitQuiz"
    >
      수정 완료
    </q-btn>
  </div>
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

<style scoped>
.form > * {
  margin: 1% 0;
}
.my-btn {
  border-radius: 10px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
  padding: 8px 16px;
  width: 100%;
}
</style>
