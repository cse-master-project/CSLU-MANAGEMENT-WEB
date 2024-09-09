<template>
  <q-badge
    v-if="quiz.permissionStatus === 0"
    color="orange"
    text-color="white"
    style="font-size: 0.875rem; padding: 6px 16px"
  >
    승인 대기 중
  </q-badge>

  <q-badge
    v-else-if="quiz.permissionStatus === 1"
    color="green"
    text-color="white"
    style="font-size: 0.875rem; padding: 6px 16px"
  >
    승인
  </q-badge>

  <q-badge
    v-else-if="quiz.permissionStatus === -1"
    color="red"
    text-color="white"
    style="font-size: 0.875rem; padding: 6px 16px"
  >
    반려 {{ quiz.reason }}
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
