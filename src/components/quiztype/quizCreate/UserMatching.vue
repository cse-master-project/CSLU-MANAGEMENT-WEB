<template>
  <q-form class="q-pa-md">
    <div class="title-container">
      <q-title class="title">선긋기형</q-title>
    </div>
    <q-card>
      <q-card-section>
        <!-- 대분류 선택 -->
        <q-label>과목<span class="required">*</span></q-label>
        <q-select
          v-model="subject"
          :options="subjectOptions"
          outlined
          class="q-mb-md"
          @update:model-value="updateDetailSubjectOptions"
        />
        <!-- 소분류 선택 -->
        <q-label>챕터<span class="required">*</span></q-label>
        <q-select
          v-model="detailSubject"
          :options="filteredDetailSubjectOptions"
          outlined
          class="q-mb-md"
        />
        <!-- 문제 입력 -->
        <q-label>문제<span class="required">*</span></q-label>
        <q-input
          v-model="quiz"
          type="textarea"
          outlined
          rows="3"
          maxlength="100"
          class="q-mb-md"
          counter
        />

        <!-- 왼쪽 그룹 옵션 입력 -->
        <div class="option-container">
          <div class="left">
            <div>
              <q-label>a-1</q-label>
              <q-input v-model="leftOptions[0]" outlined class="q-mb-md" />
            </div>

            <div>
              <q-label>a-2</q-label>
              <q-input v-model="leftOptions[1]" outlined class="q-mb-md" />
            </div>
            <div>
              <q-label>a-3</q-label>
              <q-input v-model="leftOptions[2]" outlined class="q-mb-md" />
            </div>
          </div>
          <!-- 오른쪽 그룹 옵션 입력 -->
          <div class="right">
            <div>
              <q-label>b-1</q-label>
              <q-input v-model="rightOptions[0]" outlined class="q-mb-md" />
            </div>
            <div>
              <q-label>b-2</q-label>
              <q-input v-model="rightOptions[1]" outlined class="q-mb-md" />
            </div>
            <div>
              <q-label>b-3</q-label>
              <q-input v-model="rightOptions[2]" outlined class="q-mb-md" />
            </div>
          </div>
        </div>

        <!-- 정답 입력 -->
        <q-label>답안<span class="required">*</span></q-label>
        <div v-for="(answer, index) in answers" :key="index" class="q-mb-md">
          <q-input
            v-model="answers[index]"
            type="text"
            outlined
            placeholder="답을 입력해주세요 (예: 0는0)"
            class="q-mb-md"
          />
        </div>

        <!-- 해설 입력 -->
        <q-label>해설<span class="required">*</span></q-label>
        <q-input
          v-model="commentary"
          type="textarea"
          outlined
          autogrow
          class="q-mb-md"
        />
      </q-card-section>
      <!-- 파일 첨부 섹션 -->

      <q-card-section>
        <section class="container">
          <label for="file">
            <div class="styled-file-input">
              <div class="attachment-button">🔗 FILE UPLOAD</div>
              <p v-if="fileName" class="attached-file">{{ fileName }}</p>
            </div>
          </label>
          <input type="file" id="file" @change="fileInputHandler" />
        </section>
      </q-card-section>

      <!-- 액션 버튼 섹션 -->
      <q-card-actions align="right">
        <q-btn
          class="backbtn"
          @click="goBack"
          style="width: 10%; margin: 3% 1%"
        >
          뒤로가기
        </q-btn>
        <q-btn
          class="registerbtn"
          @click="submitQuiz"
          style="width: 10%; margin: 3% 0"
        >
          문제 등록
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-form>

  <!-- SubmitQuizSuccess 컴포넌트 -->
  <SubmitQuizSuccess
    v-if="submitQuizSuccess"
    :submit-quiz-success="submitQuizSuccess"
  />
</template>

<script setup>
import { ref, defineEmits, onMounted, watch } from 'vue';
import { api } from 'src/boot/axios';
import SubmitQuizSuccess from 'src/components/quiz/SubmitQuizSuccess.vue';
import useCategories from 'src/services/useCategories.js';

const emits = defineEmits(['change-quiz-type']);

const goBack = () => {
  emits('change-quiz-type', '');
};

const fileName = ref('');
const fileInputHandler = event => {
  const files = event.target && event.target.files;
  if (files && files[0]) {
    fileName.value = event.target.files[0].name;
  }
};

// useCategories에서 가져오는 데이터와 상태 변수들
const { subjectOptions, fetchCategories, getDetailSubjectsBySubject } =
  useCategories();

onMounted(fetchCategories);

const subject = ref('');
const detailSubject = ref('');
const quiz = ref('');
const answers = ref(['', '', '']);
const leftOptions = ref(['', '', '']);
const rightOptions = ref(['', '', '']);
const commentary = ref('');

const filteredDetailSubjectOptions = ref([]);

watch(subject, () => {
  // 과목이 변경될 때마다 챕터 선택 초기화
  detailSubject.value = '';
  updateDetailSubjectOptions();
});

// 대분류 선택에 따라 소분류 옵션을 업데이트하는 함수
const updateDetailSubjectOptions = () => {
  filteredDetailSubjectOptions.value = getDetailSubjectsBySubject(
    subject.value,
  );
};

const submitQuizSuccess = ref(false);

const submitQuiz = () => {
  // 사용자가 입력한 답을 서버에 보낼 형식으로 변환
  const transformedAnswers = answers.value.map(answer => {
    const [left, right] = answer.trim().split('는');
    return `${left.trim()}t${right.trim()}`;
  });
  const quizData = {
    subject: subject.value,
    detailSubject: detailSubject.value,
    quizType: '3',
    jsonContent: JSON.stringify({
      quiz: quiz.value,
      left_option: leftOptions.value,
      right_option: rightOptions.value,
      answer: transformedAnswers,
      commentary: commentary.value,
    }),
    hasImage: false,
  };
  console.log('서버에 제출될 데이터:', quizData);
  api
    .post('/api/quiz/user', quizData)
    .then(response => {
      submitQuizSuccess.value = true;
    })
    .catch(error => {
      if (error.response.status === 400) {
        alert(
          '입력된 데이터가 부족하거나 잘못되었습니다. 빈칸이 없는지 확인해주세요.',
        );
      } else if (error.response.status === 500) {
        alert(
          '서버에서 문제를 처리하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
        );
      } else {
        alert('문제 등록 중 예상치 못한 오류가 발생했습니다.');
      }
    });
};
</script>

<style scoped lang="scss">
@import '/src/css/QuizBtn.css';

.option-container {
  display: flex;
  margin: 30px 0;
}

.left,
.right {
  display: flex;
  flex-direction: column;
  margin: 10px auto;
  width: 400px;
}

.left > *,
.right > * {
  margin: 10px 0;
}
</style>
