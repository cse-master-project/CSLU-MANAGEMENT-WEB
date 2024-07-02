<template>
  <q-form class="q-pa-md">
    <q-card>
      <q-card-section>
        <!-- 대분류 선택 -->
        <q-select
          v-model="subject"
          :options="subjectOptions"
          label="대분류"
          outlined
          class="q-mb-md"
          @update:model-value="updateDetailSubjectOptions"
        />
        <!-- 소분류 선택 -->
        <q-select
          v-model="detailSubject"
          :options="filteredDetailSubjectOptions"
          label="소분류"
          outlined
          class="q-mb-md"
        />
        <!-- 문제 입력 -->
        <q-input
          v-model="quiz"
          type="textarea"
          outlined
          rows="4"
          placeholder="문제를 입력해주세요"
          maxlength="300"
          class="q-mb-md"
        />

        <!-- 왼쪽 그룹 옵션 입력 -->
        <div class="option-container">
          <div class="left">
            <q-input
              v-model="leftOptions[0]"
              outlined
              placeholder="왼쪽 그룹의 옵션을 입력하세요"
              class="q-mb-md"
            />
            <q-input
              v-model="leftOptions[1]"
              outlined
              placeholder="왼쪽 그룹의 옵션을 입력하세요"
              class="q-mb-md"
            />
            <q-input
              v-model="leftOptions[2]"
              outlined
              placeholder="왼쪽 그룹의 옵션을 입력하세요"
              class="q-mb-md"
            />
          </div>
          <!-- 오른쪽 그룹 옵션 입력 -->
          <div class="right">
            <q-input
              v-model="rightOptions[0]"
              outlined
              placeholder="오른쪽 그룹의 옵션을 입력하세요"
              class="q-mb-md"
            />
            <q-input
              v-model="rightOptions[1]"
              outlined
              placeholder="오른쪽 그룹의 옵션을 입력하세요"
              class="q-mb-md"
            />
            <q-input
              v-model="rightOptions[2]"
              outlined
              placeholder="오른쪽 그룹의 옵션을 입력하세요"
              class="q-mb-md"
            />
          </div>
        </div>

        <!-- 정답 입력 -->
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
        <q-input
          v-model="commentary"
          type="textarea"
          placeholder="해설을 입력해주세요"
          outlined
          autogrow
          style="margin: 3% 0"
        />

        <!-- 파일 첨부 섹션 -->
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
import { ref, defineEmits, onMounted } from 'vue';
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
const { categories, subjectOptions, detailSubjectOptions, fetchCategories } =
  useCategories();

onMounted(fetchCategories);

const subject = ref('');
const detailSubject = ref('');
const quiz = ref('');
const answers = ref(['', '', '']);
const leftOptions = ref(['', '', '']);
const rightOptions = ref(['', '', '']);
const commentary = ref('');

const updateDetailSubjectOptions = () => {
  const selectedCategory = categories.value.find(
    category => category.subject === subject.value,
  );
  if (selectedCategory) {
    filteredDetailSubjectOptions.value = selectedCategory.detailSubject;
  } else {
    filteredDetailSubjectOptions.value = [];
  }
};

const filteredDetailSubjectOptions = ref([]);

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
    .post('/api/quiz/default', quizData)
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
.option-container {
  display: flex;
  margin: 30px 0;
}

.left,
.right {
  display: flex;
  flex-direction: column;
  margin: 10px auto;
  width: 300px;
}

.left > *,
.right > * {
  margin: 10px 0;
}
</style>
