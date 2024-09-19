<template>
  <q-form class="q-pa-md">
    <div class="row justify-end q-mb-md">
      <q-chip small outline class="text-caption text-grey">
        &lt;빈칸채우기형&gt;
      </q-chip>
    </div>

    <q-card flat bordered>
      <!-- 문제 내용 -->
      <q-card-section class="bg-primary text-white q-pa-md">
        <div class="text-subtitle1">Q. {{ quizcontent.quiz }}</div>
      </q-card-section>

      <q-separator />

      <!-- 2차원 배열의 정답 표시 -->
      <q-card-section>
        <div class="text-weight-medium">
          <div
            v-for="(group, groupIndex) in quizcontent.answer"
            :key="groupIndex"
            class="answer-group"
          >
            <span class="group-label"
              >{{ groupIndex + 1 }}번째 <<빈칸>> :
            </span>
            <span class="text-positive">
              {{ group.join(', ') }}
              <!-- 각 그룹의 답을 콤마로 구분하여 표시 -->
            </span>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <!-- 해설 표시 -->
      <q-card-section>
        <div class="text-weight-medium">
          해설 : <q-markdown>{{ quizcontent.commentary }}</q-markdown>
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
.text-caption {
  font-size: 12px;
}

.text-weight-medium {
  font-weight: 500;
}

.answer-group {
  margin-top: 8px;
}

.text-positive {
  color: #43a047;
}
</style>
