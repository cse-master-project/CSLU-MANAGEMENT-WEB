<template>
  <q-form class="q-pa-md">
    <div class="row justify-end q-mb-md">
      <q-chip small outline class="text-caption text-grey">
        &lt;단답형&gt;
      </q-chip>
    </div>

    <q-card flat bordered>
      <!-- 문제 내용 -->
      <q-card-section class="bg-primary text-white q-pa-md">
        <div class="text-subtitle1">Q. {{ quizcontent.quiz }}</div>
      </q-card-section>

      <q-separator />

      <!-- 정답 표시 -->
      <q-card-section>
        <div class="text-weight-medium">
          정답 :
          <span class="text-positive">{{ quizcontent.answer.join(', ') }}</span>
        </div>
      </q-card-section>

      <q-separator />

      <!-- 해설 표시 -->
      <q-card-section>
        <div class="text-weight-medium">
          해설 : {{ quizcontent.commentary }}
        </div>
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

<style scoped>
.option-text {
  padding: 8px;
  font-size: 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.text-caption {
  font-size: 12px;
}

.text-weight-medium {
  font-weight: 500;
}

.text-positive {
  color: #43a047;
}
</style>
