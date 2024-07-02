<template>
  <q-form class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6 q-mb-md">문제 유형: 단답형</div>
        <div class="text-subtitle1">문제 : {{ quizcontent.quiz }}</div>
      </q-card-section>
      <q-card-section>
        <div>정답: {{ quizcontent.answer }}</div>
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
