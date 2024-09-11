<template>
  <q-form class="q-pa-md">
    <q-card class="my-card form">
      <!-- 문제 유형 표시 -->
      <q-card-section>
        <div class="text-h6 q-mb-md">문제 유형: 선긋기형</div>
        <q-input
          v-model="localQuizContent.quiz"
          label="문제"
          outlined
          dense
          class="q-mb-md"
        />
      </q-card-section>

      <!-- 좌측/우측 옵션 입력 -->
      <div class="q-pa-md row">
        <q-card-section class="col">
          <div
            v-for="(option, index) in localQuizContent.left_option"
            :key="index"
            class="q-mb-md"
          >
            <q-input
              v-model="localQuizContent.left_option[index]"
              :label="`좌측 옵션 ${index + 1}`"
              outlined
              dense
            />
          </div>
        </q-card-section>

        <q-card-section class="col">
          <div
            v-for="(option, index) in localQuizContent.right_option"
            :key="index"
            class="q-mb-md"
          >
            <q-input
              v-model="localQuizContent.right_option[index]"
              :label="`우측 옵션 ${index + 1}`"
              outlined
              dense
            />
          </div>
        </q-card-section>
      </div>

      <!-- 정답 입력 -->
      <q-card-section>
        <q-input
          v-model.number="localQuizContent.answer"
          type="number"
          label="정답 (숫자 입력)"
          outlined
          dense
          style="width: 100%"
          class="q-mb-md"
        />
      </q-card-section>

      <!-- 해설 입력 -->
      <q-card-section>
        <q-input
          v-model="localQuizContent.commentary"
          label="해설"
          outlined
          dense
          class="q-mb-md"
        />
      </q-card-section>

      <!-- 버튼 섹션 -->
      <q-card-section class="button-container">
        <q-btn
          flat
          color="negative"
          class="my-btn small-btn"
          icon="cancel"
          @click="editCancle"
        >
          수정 취소
        </q-btn>
        <q-btn
          flat
          color="primary"
          class="my-btn small-btn"
          icon="save"
          @click="submitQuiz"
        >
          수정 완료
        </q-btn>
      </q-card-section>
    </q-card>
  </q-form>
</template>

<script setup>
import { ref } from 'vue';
import { api } from 'src/boot/axios';

const props = defineProps({
  quizcontent: Object,
  quizzes: Object,
});

const emit = defineEmits(['update:quizcontent', 'update:isEditing']);

const localQuizContent = ref({ ...props.quizcontent });

// 수정 취소 기능
const editCancle = () => {
  emit('update:isEditing', 'false');
};

//수정 완료 기능.
const submitQuiz = async () => {
  const quizData = {
    quiz: localQuizContent.value.quiz,
    left_option: localQuizContent.value.left_option,
    right_option: localQuizContent.value.right_option,
    answer: localQuizContent.value.answer,
    commentary: localQuizContent.value.commentary,
  };

  try {
    const response = await api.patch(
      `/api/management/quiz/${props.quizzes.quizId}`,
      quizData,
    );
    console.log('응답:', response.data); // 서버 응답 확인
    alert('수정이 완료되었습니다 ^_^');

    emit('update:quizcontent', localQuizContent.value);
    emit('update:isEditing');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      alert('바뀐게 없습니다 .. ㅜㅠ');
    } else {
      console.error('수정 오류:', error);
      alert('문제 수정 중 오류가 발생했습니다.');
    }
  }
};
</script>

<style scoped>
.my-card {
  max-width: 600px;
  margin: auto;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* 카드 그림자 강화 */
  border-radius: 12px; /* 카드 테두리 둥글게 */
  padding: 20px;
}

.text-h6 {
  font-weight: bold;
}

.my-btn {
  border-radius: 8px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);
  padding: 12px 24px;
  font-size: 1rem;
}

.button-container {
  display: flex;
  flex-direction: row;
  justify-content: center; /* 버튼을 가운데 정렬 */
  gap: 20px; /* 버튼 사이 간격 */
}
</style>
