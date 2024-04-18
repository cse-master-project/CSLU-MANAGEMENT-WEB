<template>
  <q-form>
    <q-card>
      <div class="q-gutter-sm">
        <q-radio
          v-model="selectedQuizType"
          val="MultipleChoice"
          label="4지선다형"
        />
        <q-radio v-model="selectedQuizType" val="ShortAnswer" label="단답형" />
        <q-radio v-model="selectedQuizType" val="Matching" label="선긋기형" />
        <q-radio v-model="selectedQuizType" val="TrueOrFalse" label="o/x형" />
        <q-radio
          v-model="selectedQuizType"
          val="FillInTheBlank"
          label="빈칸 채우기형"
        />
      </div>
      <q-btn label="문제 생성" @click="emitQuizType" />
    </q-card>
  </q-form>
</template>

<script setup>
import { ref } from 'vue';

const emits = defineEmits(['quiz-type-selected']);

// 퀴즈 유형저장.
const selectedQuizType = ref('');
// 이벤트 발생.
const emitQuizType = () => {
  emits('quiz-type-selected', selectedQuizType.value);
};
</script>
