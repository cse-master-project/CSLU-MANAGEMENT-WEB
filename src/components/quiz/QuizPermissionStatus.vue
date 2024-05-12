<template>
  <q-badge v-if="quiz.permission === 0" color="orange" text-color="white">
    승인 대기 중
  </q-badge>
  <q-badge v-else-if="quiz.permission === 1" color="green" text-color="white">
    승인됨
  </q-badge>
  <q-badge v-else-if="quiz.permission === 2" color="red" text-color="white">
    반려됨 {{ quiz.reason }}
  </q-badge>
</template>

<script setup>
defineProps({
  quiz: {
    type: Object,
    required: true,
  },
});
</script>
