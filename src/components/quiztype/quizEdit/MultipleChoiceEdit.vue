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
import { ref, watch } from 'vue';

const props = defineProps({
  quizcontent: Object,
});

const emit = defineEmits(['update:quizcontent']);

const localQuizContent = ref({ ...props.quizcontent });

watch(
  () => props.quizcontent,
  newContent => {
    localQuizContent.value = { ...newContent };
  },
);

const submitQuiz = () => {
  emit('update:quizcontent', localQuizContent.value);
  console.log(localQuizContent.value);
};

const answerOptions = ref([
  { value: 1, label: '1번' },
  { value: 2, label: '2번' },
  { value: 3, label: '3번' },
  { value: 4, label: '4번' },
]);
</script>
