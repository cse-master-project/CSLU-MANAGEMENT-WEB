<template>
  <q-badge
    v-if="quiz.permissionStatus === 0"
    color="orange"
    text-color="white"
    class="badge-style"
  >
    승인 대기 중
  </q-badge>

  <q-badge
    v-else-if="quiz.permissionStatus === 1"
    color="green"
    text-color="white"
    class="badge-style"
  >
    승인
  </q-badge>

  <q-badge
    v-else-if="quiz.permissionStatus === -1"
    color="red"
    text-color="white"
    class="badge-style"
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

<style scoped>
.badge-style {
  font-size: 0.875rem;
  padding: 6px 16px;
  min-width: 100px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  line-height: 1; /* 라인 높이 조정 */
}
</style>
