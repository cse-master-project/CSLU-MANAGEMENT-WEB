<template>
  <q-form class="q-pa-md">
    <div class="row justify-end q-mb-md">
      <q-chip small outline class="text-caption text-grey">
        &lt;4지선다형&gt;
      </q-chip>
    </div>

    <q-card flat bordered>
      <!-- 문제 내용 -->
      <q-card-section class="bg-primary text-white q-pa-md">
        <div class="label-container">
          <label class="label-quiz">Q. </label>
          <q-input
            v-model="localQuizContent.quiz"
            outlined
            autogrow
            dense
            counter
            maxlength="300"
            class="text-subtitle1 input-field"
          />
        </div>
      </q-card-section>

      <q-separator />

      <!-- 정답 표시 및 선택지 -->
      <q-card-section class="answer-container">
        <div
          v-for="(choice, index) in localQuizContent.option"
          :key="`choice-${index}`"
          class="label-container"
        >
          <q-radio
            v-model="localQuizContent.answer"
            :val="index + 1"
            name="answer"
            class="q-mr-sm"
          />
          <q-input
            v-model="localQuizContent.option[index]"
            outlined
            dense
            maxlength="300"
            autogrow
            class="input-field"
            placeholder="지문을 입력하세요"
          />
        </div>
      </q-card-section>

      <q-separator />

      <!-- 해설 표시 -->
      <q-card-section>
        <div class="label-container">
          <label class="label-commentary">해설 : </label>

          <q-input
            v-model="localQuizContent.commentary"
            outlined
            dense
            autogrow
            maxlength="300"
            counter
            class="input-field"
          />
        </div>
      </q-card-section>

      <q-card-section class="btn-container">
        <q-btn
          flat
          color="negative"
          class="my-btn small-btn"
          @click="editCancle"
        >
          수정 취소
        </q-btn>
        <q-btn
          flat
          color="primary"
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
import { ref } from 'vue';
import { api } from 'src/boot/axios';

// 데이터 받기.(다른컴포넌트->현재컴포넌트)
const props = defineProps({
  quizcontent: Object,
  quizzes: Object,
});

//이벤트 보내기.(현재 컴포넌트 -> 다른 컴포넌트)
const emit = defineEmits(['update:quizcontent', 'update:isEditing']);

// 서버에서 받아온 데이터를 그대로 사용
const localQuizContent = ref({ ...props.quizcontent });

// 수정 취소 기능.
const editCancle = () => {
  emit('update:isEditing', 'false');
};

// 수정 완료 기능.
const submitQuiz = async () => {
  const quizData = {
    quiz: localQuizContent.value.quiz,
    option: localQuizContent.value.option, // 수정된 옵션 전송
    answer: localQuizContent.value.answer, // 선택된 정답 전송
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
.label-container {
  display: flex;
  align-items: center;
  gap: 16px; /* 라벨과 입력 필드 사이의 간격 */
}

.text-subtitle1 {
  font-size: 18px;
  font-weight: bold;
}

.input-field {
  flex: 1;
}

.my-btn {
  border-radius: 8px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);
  padding: 14px 24px;
  font-size: 1.1rem;
  width: auto;
}

.btn-container {
  display: flex;
  justify-content: center;
  gap: 100px;
  padding: 0 32px;
  margin-bottom: 20px;
}
</style>
