<template>
  <q-form class="q-pa-md">
    <div class="title-container">
      <q-title class="title">O/X형</q-title>
    </div>
    <q-card>
      <q-card-section class="cs">
        <!-- 대분류 선택 -->
        <q-label>과목<span class="required">*</span></q-label>
        <q-select
          v-model="subject"
          :options="subjectOptions"
          class="q-mb-md"
          @update:model-value="updateDetailSubjectOptions"
          ref="inputRef"
          outlined
          :rules="inputRules"
        />
        <!-- 소분류 선택 -->
        <q-label>챕터<span class="required">*</span></q-label>
        <q-select
          v-model="detailSubject"
          :options="filteredDetailSubjectOptions"
          ref="inputRef"
          outlined
          :rules="inputRules"
          class="q-mb-md"
        />
        <!-- 문제 입력 -->
        <q-label>문제<span class="required">*</span></q-label>
        <q-input
          v-model="quiz"
          type="textarea"
          rows="3"
          ref="inputRef"
          outlined
          :rules="inputRules"
          placeholder="문제를 입력해주세요"
          maxlength="100"
          counter
          class="q-mb-md"
        />
        <!-- O/X 선택 -->
        <q-label>답안<span class="required">*</span></q-label>
        <q-option-group
          v-model="selectedAnswer"
          :options="options"
          class="q-mb-md"
          style="margin-left: 0px"
        />
        <!-- 해설 입력 -->
        <q-label>해설<span class="required">*</span></q-label>
        <q-input
          v-model="commentary"
          type="textarea"
          placeholder="해설을 입력해주세요"
          ref="inputRef"
          outlined
          :rules="inputRules"
          autogrow
          class="q-mb-md"
        />
      </q-card-section>
      <q-card-section style="width: 30%">
        <!--첨부파일-->
        <section class="container">
          <label for="file">
            <div
              class="styled-file-input"
              @click="triggerFileInput"
              style="height: 60px; cursor: pointer"
            >
              <q-icon
                name="attach_file"
                size="23px"
                :style="{ color: '#929dac' }"
              />
              <p v-if="fileName" class="attached-file">{{ fileName }}</p>
            </div>
          </label>
          <!--이미지만 업로드 가능-->
          <input
            type="file"
            id="file"
            ref="fileInput"
            accept=".jpg, .jpeg, .png"
            class="hidden"
            @change="fileInputHandler"
          />
        </section>
      </q-card-section>
      <!-- 액션 버튼 섹션 -->
      <q-card-actions align="right" class="cs">
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

  <UserSubmitQuizSuccess
    v-if="submitQuizSuccess"
    :submit-quiz-success="submitQuizSuccess"
  />
</template>

<script setup>
import { ref, defineEmits, onMounted, watch } from 'vue';
import { userApi } from 'src/boot/userAxios';
import UserSubmitQuizSuccess from 'src/components/quiz/UserSubmitQuizSuccess.vue';
import userUseCategories from 'src/services/userUseCategories.js';

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

const { subjectOptions, fetchCategories, getDetailSubjectsBySubject } =
  userUseCategories();

onMounted(fetchCategories);

const options = [
  { label: 'O', value: 1 },
  { label: 'X', value: 0 },
];
const subject = ref('');
const detailSubject = ref('');
const quiz = ref('');
const selectedAnswer = ref(null);
const commentary = ref('');
const inputRef = ref(null);

const inputRules = [val => !!val || '필수 입력 사항입니다.'];

const filteredDetailSubjectOptions = ref([]);

// 대분류 선택에 따라 소분류 옵션을 업데이트하는 함수
const updateDetailSubjectOptions = () => {
  filteredDetailSubjectOptions.value = getDetailSubjectsBySubject(
    subject.value,
  );
};

watch(subject, () => {
  // 과목이 변경될 때마다 챕터 선택 초기화
  detailSubject.value = '';
  updateDetailSubjectOptions();
});

const submitQuizSuccess = ref(false);

const submitQuiz = () => {
  const quizData = {
    subject: subject.value,
    detailSubject: detailSubject.value,
    quizType: '4',
    jsonContent: JSON.stringify({
      quiz: quiz.value,
      answer: selectedAnswer.value,
      commentary: commentary.value,
    }),
  };
  console.log('서버에 제출될 데이터:', quizData);
  userApi
    .post('/api/quiz/user', quizData)
    .then(response => {
      submitQuizSuccess.value = true;
    })
    .catch(error => {
      if (error.response.status === 400) {
        alert(
          '입력된 데이터가 부족하거나 잘못되었습니다. 빈칸이 없는지 확인해주세요 ^_^',
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
@import '/src/css/QuizForm.css';
</style>
