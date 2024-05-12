<template>
  <q-form class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6 q-mb-md">문제 유형: 선긋기형</div>
        <div class="text-subtitle1">문제 : {{ quizcontent.quiz }}</div>
      </q-card-section>

      <div class="q-pa-md row">
        <q-card-section class="col">
          <div
            v-for="(option, index) in quizcontent.left_option"
            :key="index"
            class="q-mb-md"
          >
            {{ index + 1 }}. {{ option }}
          </div>
        </q-card-section>

        <q-card-section class="col">
          <div
            v-for="(option, index) in quizcontent.right_option"
            :key="index"
            class="q-mb-md"
          >
            {{ index + 1 }}. {{ option }}
          </div>
        </q-card-section>
      </div>

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
