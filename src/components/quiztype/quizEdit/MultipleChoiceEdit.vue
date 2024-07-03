<template>
  <div>
    <q-input v-model="localQuizContent.quiz" label="문제" />

    <div v-for="(option, index) in localQuizContent.option" :key="index">
      <q-input
        v-model="localQuizContent.option[index]"
        :label="`옵션 ${index + 1}`"
      />
    </div>

    <q-select
      v-model="localQuizContent.answer"
      :options="answerOptions"
      label="정답"
      option-value="value"
      option-label="label"
    />

    <q-input v-model="localQuizContent.commentary" label="해설" />

    <q-btn
      flat
      color="negative"
      class="my-btn small-btn"
      icon="edit"
      @click="submitQuiz"
    >
      수정완료
    </q-btn>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { api } from 'src/boot/axios';

//데이터 받기.(다른컴포넌트->현재컴포넌트)
const props = defineProps({
  quizcontent: Object,
  currentquiz: Object,
});

//이벤트 보내기.(현재컴포넌트->다른컴포넌트)
const emit = defineEmits(['update:quizcontent', 'editComplete']);

const localQuizContent = ref(props.quizcontent);

const answerOptions = ref([
  { value: 1, label: '1번' },
  { value: 2, label: '2번' },
  { value: 3, label: '3번' },
  { value: 4, label: '4번' },
]);

const submitQuiz = async () => {
  // 올바른 보기값을 추출하여 optionsValues에 할당
  const optionsValues = Object.values(localQuizContent.value.option);

  const quizData = {
    quiz: localQuizContent.value.quiz,
    option: optionsValues, // 옵션 라벨만 추출하여 배열로 전달
    answer: localQuizContent.value.answer.value,
    commentary: localQuizContent.value.commentary,
  };

  try {
    const response = await api.patch(
      `/api/management/quiz/${props.currentquiz.quizId}`,
      quizData,
    );
    console.log('응답:', response.data); // 서버 응답 확인
    alert('수정이 완료되었습니다 ^_^');

    emit('update:quizcontent', localQuizContent.value);
  } catch (error) {
    console.error('수정 오류:', error);
    alert('문제 수정 중 오류가 발생했습니다.');
  }
};
</script>
