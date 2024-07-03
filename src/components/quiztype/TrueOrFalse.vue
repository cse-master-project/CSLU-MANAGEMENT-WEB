<template>
  <div>
    <!-- 문제 입력 -->
    <q-input v-model="localQuizContent.quiz" label="문제" outlined />

    <!-- 정답 입력 (O/X 선택) -->
    <q-option-group
      v-model="localQuizContent.answer"
      :options="options"
      inline
      label="정답"
    />

    <!-- 해설 입력 -->
    <q-input
      v-model="localQuizContent.commentary"
      type="textarea"
      label="해설"
      outlined
      autogrow
    />

    <!-- 수정 완료 버튼 -->
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
import { ref, defineProps, defineEmits } from 'vue';
import { api } from 'src/boot/axios';

// 부모 컴포넌트로부터 데이터를 props로 받음
const props = defineProps({
  quizcontent: Object, // 현재 수정할 O/X 퀴즈 데이터
  currentquiz: Object, // 현재 수정 중인 퀴즈의 기본 정보
});

// 이벤트 emit을 정의하여 부모 컴포넌트에 이벤트를 발생시킴
const emit = defineEmits(['update:quizcontent', 'editComplete']);

// 로컬 상태 변수 정의
const localQuizContent = ref({ ...props.quizcontent }); // 현재 퀴즈 데이터

// O/X 선택 옵션 정의
const options = [
  { label: 'O', value: 1 },
  { label: 'X', value: 0 },
];

// 문제 수정 완료 처리 함수
const submitQuiz = async () => {
  const quizData = {
    quiz: localQuizContent.value.quiz,
    answer: localQuizContent.value.answer,
    commentary: localQuizContent.value.commentary,
  };

  try {
    // API를 통해 수정된 데이터를 서버로 전송
    const response = await api.patch(
      `/api/management/quiz/${props.currentquiz.quizId}`,
      quizData,
    );
    console.log('응답:', response.data); // 서버 응답 확인
    alert('수정이 완료되었습니다 ^_^');

    // 부모 컴포넌트에 수정된 데이터 업데이트 이벤트 발생
    emit('update:quizcontent', localQuizContent.value);
    // 수정 완료 이벤트 발생
    emit('editComplete');
  } catch (error) {
    console.error('수정 오류:', error);
    alert('문제 수정 중 오류가 발생했습니다.');
  }
};
</script>

<style scoped>
.my-btn {
  border-radius: 10px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
  padding: 8px 16px;
}
</style>
