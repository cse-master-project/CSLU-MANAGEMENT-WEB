<template>
  <q-page>
    <SelectQuizTypeForm
      @quiz-type-selected="changeQuizType"
      v-if="quizType === ''"
    />
    <!-- quizType에 따라 동적 컴포넌트를 표시. -->
    <component
      :is="quizTypeViewForm[quizType]"
      @change-quiz-type="changeQuizType"
      v-if="quizType !== ''"
    />
  </q-page>
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue';
import SelectQuizTypeForm from 'src/components/quiztype/SelectQuizTypeForm.vue';

// 선택 퀴즈 유형 저장.
const quizType = ref('');
// 유형에서 발생항 이벤트 처리 & 선택된 퀴즈 유형 저장.
const changeQuizType = mode => {
  quizType.value = mode;
};
// 동적컴포넌트 정의 (비동기적)
const quizTypeViewForm = {
  MultipleChoice: defineAsyncComponent(() =>
    import('src/components/quiztype/MultipleChoice.vue'),
  ),
  ShortAnswer: defineAsyncComponent(() =>
    import('src/components/quiztype/ShortAnswer.vue'),
  ),
  Matching: defineAsyncComponent(() =>
    import('src/components/quiztype/Matching.vue'),
  ),
  TrueOrFalse: defineAsyncComponent(() =>
    import('src/components/quiztype/TrueOrFalse.vue'),
  ),
  FillInTheBlank: defineAsyncComponent(() =>
    import('src/components/quiztype/FillInTheBlank.vue'),
  ),
};
</script>
