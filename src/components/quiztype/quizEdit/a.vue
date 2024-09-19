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
        <q-input
          v-model="localQuizContent.quiz"
          label="문제"
          outlined
          autogrow
          dense
          maxlength="300"
          class="text-subtitle1"
        />
      </q-card-section>

      <q-separator />

      <!-- 정답 표시 -->
      <q-card-section class="answer-container">
        <q-label class="label-answer">답안</q-label>
        <div
          v-for="(answer, index) in answers"
          :key="index"
          class="q-mb-md input-answer"
        >
          <q-input
            v-model="localQuizContent.answer[index]"
            type="textarea"
            autogrow
            outlined
            dense
            placeholder="답안 입력해주세요. "
            maxlength="300"
            counter
          />
        </div>
      </q-card-section>

      <q-separator />

      <!-- 해설 표시 -->
      <q-card-section>
        <div class="text-weight-medium">
          해설 :
          <q-markdown
            ><q-input
              v-model="localQuizContent.commentary"
              label="해설"
              outlined
              dense
              autogrow
              maxlength="300"
          /></q-markdown>
        </div>
      </q-card-section>
      <q-card-section class="btn-container">
        <q-btn
          flat
          color="negative"
          class="my-btn small-btn"
          icon="edit"
          @click="editCancle"
        >
          수정 취소
        </q-btn>
        <q-btn
          flat
          color="negative"
          class="my-btn small-btn"
          icon="edit"
          @click="submitQuiz"
        >
          수정 완료
        </q-btn>
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
