<template>
  <q-page>
    <!-- 퀴즈유형선택 받는 이벤트 -->
    <SelectQuizTypeForm
      @quiz-type-selected="changeQuizType"
      v-if="quizType === ''"
    />
    <!-- quizType에 따라 동적 컴포넌트를 표시. -->
    <component
      :is="quizTypeCreateForm[quizType]"
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
const quizTypeCreateForm = {
  MultipleChoice: defineAsyncComponent(() =>
    import('src/components/quiztype/quizCreate/AdminMultipleChoiceCreate.vue'),
  ),
  ShortAnswer: defineAsyncComponent(() =>
    import('src/components/quiztype/quizCreate/AdminShortAnswerCreate.vue'),
  ),
  Matching: defineAsyncComponent(() =>
    import('src/components/quiztype/quizCreate/AdminMatchingCreate.vue'),
  ),
  TrueOrFalse: defineAsyncComponent(() =>
    import('src/components/quiztype/quizCreate/AdminTrueOrFalseCreate.vue'),
  ),
  FillInTheBlank: defineAsyncComponent(() =>
    import('src/components/quiztype/quizCreate/AdminFillInTheBlankCreate.vue'),
  ),
};
</script>
<style>
@media (max-width: 500px) {
  .q-page {
    height: 130vh;
  }
}
@media (max-width: 376px) {
  .q-page {
    height: 170vh;
  }
}
</style>
