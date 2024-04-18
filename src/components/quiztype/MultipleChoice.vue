<template>
  <div>4지선다형폼</div>
  <q-btn @click="goBack" label="뒤로가기" />
</template>

<script setup>
import { defineEmits } from 'vue';

const emits = defineEmits(['change-quiz-type']);

// 뒤로가기 이벤트 핸들러
const goBack = () => {
  emits('change-quiz-type', '');
};
</script>

<style lang="scss" scoped></style>
