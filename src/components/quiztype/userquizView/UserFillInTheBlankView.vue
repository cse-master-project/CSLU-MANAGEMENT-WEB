<template>
  <q-form class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6 q-mb-md">문제 유형: 빈칸채우기형</div>
        <div class="text-subtitle1">문제: {{ quizcontent.quiz }}</div>
      </q-card-section>
      <q-card-section>
        <!-- 배열의 모든 원소를 쉼표와 공백으로 구분하여 출력 -->
        <div>정답: {{ quizcontent.answer.join(', ') }}</div>
      </q-card-section>
      <q-card-section>
        <div>해설: {{ quizcontent.commentary }}</div>
      </q-card-section>
    </q-card>
  </q-form>
</template>

<script setup>
defineProps({
  quizcontent: {
    type: Object,
    required: true,
  },
});
</script>
