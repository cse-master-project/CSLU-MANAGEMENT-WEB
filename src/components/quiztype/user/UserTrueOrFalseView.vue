<template>
  <q-form class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6 q-mb-md">문제 유형: o/x형</div>
        <div class="text-subtitle1">문제 : {{ quizcontent.quiz }}</div>
      </q-card-section>

      <q-card-section>
        <!-- 삼항 연산자를 사용하여 0이면 'X', 1이면 'O'로 표시 -->
        <div>정답: {{ quizcontent.answer === 0 ? 'X' : 'O' }}</div>
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
