<template>
  <q-form class="q-pa-md">
    <!-- 문제 유형을 카드 밖 오른쪽에 배치 -->
    <div class="row justify-end q-mb-md">
      <q-chip small outline class="text-caption text-grey">
        &lt;O/X형&gt;
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
          <span class="text-positive">{{
            quizcontent.answer === 0 ? 'X' : 'O'
          }}</span>
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
.text-blue {
  color: #1e88e5;
}

.text-bold {
  font-weight: 700;
}

.text-h5 {
  font-size: 1.25rem;
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
