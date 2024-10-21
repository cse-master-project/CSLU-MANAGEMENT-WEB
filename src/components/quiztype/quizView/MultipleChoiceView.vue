<template>
  <q-form class="q-pa-md">
    <div class="row justify-end q-mb-md">
      <q-chip small outline class="text-caption text-grey">
        &lt;4지선다형&gt;
      </q-chip>
    </div>

    <q-card flat bordered>
      <!-- 문제 내용 -->
      <q-card-section class="bg-primary text-white q-pa-md content-section">
        <div class="text-subtitle1">Q. {{ quizcontent.quiz }}</div>
      </q-card-section>

      <q-separator />

      <!-- 4지선다형 옵션이 있을 경우 옵션을 표시 -->
      <q-card-section
        class="content-section"
        v-if="quizcontent.option && quizcontent.option.length"
      >
        <q-list bordered padding>
          <q-item v-for="(option, index) in quizcontent.option" :key="index">
            <q-item-section>
              <!-- 정답일 경우 색상을 변경 -->
              <div
                :class="{
                  'correct-answer': index + 1 === quizcontent.answer,
                  'option-text': true,
                }"
              >
                {{ index + 1 }}. {{ option }}
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <!-- 4지선다형 정답 표시 -->
      <q-card-section class="content-section">
        <div class="text-weight-medium">
          정답 :
          <span class="text-positive">{{ quizcontent.answer }}</span>
          <!-- 정답은 그대로 표시 (사용자에게 1부터 시작하는 번호) -->
        </div>
      </q-card-section>

      <q-separator />

      <!-- 해설 -->
      <q-card-section class="content-section">
        <div class="text-weight-medium">
          해설 : {{ quizcontent.commentary }}
        </div>
      </q-card-section>
    </q-card>
  </q-form>
</template>

<script setup>
const props = defineProps({
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

.correct-answer {
  background-color: #43a047; /* 정답일 때의 배경색 */
  color: white; /* 정답일 때의 텍스트 색 */
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

.content-section {
  word-break: break-word; /* 긴 단어를 적절히 줄바꿈 */
  white-space: pre-wrap; /* 공백과 줄바꿈을 그대로 유지 */
}
</style>
