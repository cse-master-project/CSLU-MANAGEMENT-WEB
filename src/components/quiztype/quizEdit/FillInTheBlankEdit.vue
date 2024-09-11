<template>
  <q-form class="form-container q-pa-md">
    <!-- 문제 유형을 카드 밖 오른쪽에 배치 -->
    <div class="row justify-end q-mb-md">
      <q-chip small outline class="text-caption text-grey">
        &lt;빈칸 채우기형&gt;
      </q-chip>
    </div>

    <q-card flat bordered>
      <!-- 질문 입력 -->
      <q-card-section class="q-pa-md">
        <div class="text-blue text-h5 text-bold">질문</div>
        <q-input
          v-model="localQuizContent.quiz"
          type="textarea"
          autogrow
          outlined
          dense
          placeholder="문제를 입력해주세요."
          maxlength="300"
          counter
          class="input-quiz"
        />
      </q-card-section>

      <q-separator />

      <!-- 답 입력 -->
      <q-card-section class="q-pa-md">
        <div class="text-blue text-h5 text-bold">답안</div>
        <div
          v-for="(answer, index) in localQuizContent.answer"
          :key="index"
          class="q-mb-md"
        >
          <q-input
            v-model="localQuizContent.answer[index]"
            type="textarea"
            autogrow
            outlined
            dense
            placeholder="답안 입력해주세요 (다수일 경우 , 로 구분)"
            maxlength="100"
            counter
            class="input-answer"
          />
        </div>
      </q-card-section>

      <q-separator />

      <!-- 해설 입력 -->
      <q-card-section class="q-pa-md">
        <div class="text-blue text-h5 text-bold">해설</div>
        <q-input
          v-model="localQuizContent.commentary"
          type="textarea"
          autogrow
          outlined
          placeholder="해설을 입력하세요"
          dense
          maxlength="300"
          counter
          class="input-commentary"
        />
      </q-card-section>

      <q-separator />

      <!-- 버튼 섹션 -->
      <q-card-section class="row justify-center q-gutter-md q-pa-md">
        <q-btn flat color="negative" class="my-btn" @click="editCancle"
          >수정 취소</q-btn
        >
        <q-btn flat color="primary" class="my-btn" @click="submitQuiz"
          >수정 완료</q-btn
        >
      </q-card-section>
    </q-card>
  </q-form>
</template>

<script setup>
import { ref } from 'vue';
import { api } from 'src/boot/axios';

// 데이터 받기.(다른 컴포넌트 -> 현재 컴포넌트)
const props = defineProps({
  quizcontent: Object,
  quizzes: Object,
});

// 이벤트 보내기.(현재 컴포넌트 -> 다른 컴포넌트)
const emit = defineEmits(['update:quizcontent', 'update:isEditing']);

const localQuizContent = ref({ ...props.quizcontent });

// 수정 취소 기능
const editCancle = () => {
  emit('update:isEditing', 'false');
};

// 수정 완료 기능.
const submitQuiz = async () => {
  const quizData = {
    quiz: localQuizContent.value.quiz,
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
.form-container {
  max-width: 800px;
  margin: 0 auto;
}

.q-card {
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.text-blue {
  color: #1e88e5;
}

.text-h5 {
  font-size: 1.25rem;
  font-weight: bold;
}

.input-quiz,
.input-answer,
.input-commentary {
  width: 100%;
}

.my-btn {
  width: auto;
  padding: 12px 24px;
  font-size: 1rem;
  border-radius: 8px;
}

.q-gutter-md {
  gap: 16px;
}
</style>
