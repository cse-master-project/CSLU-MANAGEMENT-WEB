<template>
  <!-- 퀴즈 등록 폼 -->
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

        <!-- 보기 입력 -->
        <div
          v-for="index in 4"
          :key="`choice-${index}`"
          class="choice-container"
        >
          <q-input
            v-model="option[index - 1].label"
            type="textarea"
            :label="'보기 ' + index"
            outlined
            autogrow
            style="margin: 10px 0"
            class="q-mb-md"
          />
        </div>

        <!-- 정답 입력 (숫자만 가능) -->
        <q-input
          v-model.number="answer"
          type="number"
          label="정답 (숫자 입력)"
          outlined
          style="width: 20%"
          class="q-mb-md"
        />

        <!-- 해설 입력 -->
        <q-input
          v-model="commentary"
          type="textarea"
          placeholder="해설을 입력해주세요"
          outlined
          autogrow
          style="margin: 3% 0"
        />
      </q-card-section>

      <!-- 파일 첨부 섹션 -->
      <q-card-section class="container">
        <label for="file">
          <div class="styled-file-input">
            <div class="attachment-button">🔗 FILE UPLOAD</div>
            <p v-if="fileName" class="attached-file">{{ fileName }}</p>
          </div>
        </label>
        <input type="file" id="file" @change="fileInputHandler" />
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
</template>

<script setup>
import { ref, defineEmits, onMounted } from 'vue';
import { api } from 'src/boot/axios';

// 이벤트 정의.
const emits = defineEmits(['change-quiz-type']);

// 뒤로가기 버튼 눌렀을 때 호출됨.
const goBack = () => {
  emits('change-quiz-type', '');
};

// 파일 첨부와 관련된 상태 및 처리 함수.
const fileName = ref('');
const fileInputHandler = event => {
  const files = event.target && event.target.files;
  if (files && files[0]) {
    fileName.value = event.target.files[0].name;
  }
};

// 서버에서 과목 분류 데이터 가져와 상태로 저장.
const categories = ref([]);
const subjectOptions = ref([]);
const detailSubjectOptions = ref([]);

// 서버에서 카테고리 데이터를 가져오는 함수.
const fetchCategories = async () => {
  try {
    const response = await api.get('/api/quiz/subject');
    categories.value = response.data;

    // 대분류와 소분류 옵션 설정
    subjectOptions.value = categories.value.map(category => category.subject);
    detailSubjectOptions.value = categories.value.flatMap(
      category => category.detailSubject,
    );
  } catch (error) {
    console.error('카테고리를 불러오는 중 오류가 발생했습니다:', error);
  }
};

// 컴포넌트가 마운트된 후에 카테고리 데이터를 가져오는 함수를 호출.
onMounted(fetchCategories);

// 사용자가 입력한 데이터 상태.
const subject = ref('');
const detailSubject = ref('');
const quiz = ref('');
const option = ref([
  { label: '', value: '1' },
  { label: '', value: '2' },
  { label: '', value: '3' },
  { label: '', value: '4' },
]);
const answer = ref(null); // 정답은 숫자
const commentary = ref('');

// 대분류 선택에 따라 소분류 옵션을 업데이트하는 함수.
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

// 서버에 문제 제출.
const submitQuiz = () => {
  const quizData = {
    subject: subject.value,
    detailSubject: detailSubject.value,
    quizType: '1',
    jsonContent: JSON.stringify({
      quiz: quiz.value,
      option: option.value.map(choice => choice.label),
      answer: answer.value,
      commentary: commentary.value,
    }),
    hasImage: false,
  };
  // console.log('서버에 제출될 데이터:', quizData);
  api
    .post('/api/quiz/default', quizData)
    .then(response => {
      console.log('서버 응답:', response.data);
      // 성공적으로 서버에 데이터를 전송한 후의 동작.
    })
    .catch(error => {
      console.error('서버 응답 오류:', error);
      // 서버에 데이터 전송 중 오류가 발생한 경우의 동작 추가
      // 예: 사용자에게 오류 메시지 표시
    });
};
</script>

<style scoped>
@import '/src/css/QuizBtn.css';
</style>
