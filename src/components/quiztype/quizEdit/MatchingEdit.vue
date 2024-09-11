<template>
  <q-form class="q-pa-md">
    <q-card class="q-pa-md form">
      <q-card-section>
        <div class="text-h6 q-mb-md">문제 유형: 선긋기형</div>
        <q-input v-model="localQuizContent.quiz" label="문제" />
      </q-card-section>

      <div class="q-pa-md row">
        <q-card-section class="col">
          <div
            v-for="(option, index) in localQuizContent.left_option"
            :key="index"
          >
            <q-input
              v-model="localQuizContent.left_option[index]"
              :label="`좌측 옵션 ${index + 1}`"
            />
          </div>
        </q-card-section>

        <q-card-section class="col">
          <div
            v-for="(option, index) in localQuizContent.right_option"
            :key="index"
          >
            <q-input
              v-model="localQuizContent.right_option[index]"
              :label="`우측 옵션 ${index + 1}`"
            />
          </div>
        </q-card-section>
      </div>

      <q-input
        v-model.number="localQuizContent.answer"
        type="number"
        label="정답 (숫자 입력)"
        outlined
        style="width: 60%"
        class="q-mb-md"
      />

      <q-input v-model="localQuizContent.commentary" label="해설" />

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
        수정완료
      </q-btn>
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
.form > * {
  margin: 1% 0;
}
.my-btn {
  border-radius: 10px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
  padding: 8px 16px;
  width: 100%;
}
</style>
