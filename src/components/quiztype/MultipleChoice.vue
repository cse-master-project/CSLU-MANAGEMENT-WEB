<template>
  <q-form class="q-pa-md">
    <q-card>
      <q-card-section>
        <q-select
          v-model="subject"
          :options="subjectOptions"
          label="대분류"
          outlined
          class="q-mb-md"
          @update:model-value="updateDetailSubjectOptions"
        />
        <q-select
          v-model="detailSubject"
          :options="filteredDetailSubjectOptions"
          label="소분류"
          outlined
          class="q-mb-md"
        />
        <q-input
          v-model="quiz"
          type="textarea"
          outlined
          rows="4"
          placeholder="문제를 입력해주세요"
          maxlength="300"
          class="q-mb-md"
        />

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

        <q-input
          v-model="answer"
          type="textarea"
          label="정답"
          outlined
          autogrow
          style="width: 10%"
          class="q-mb-md"
        />

        <q-input
          v-model="commentary"
          type="textarea"
          placeholder="해설을 입력해주세요"
          outlined
          autogrow
          style="margin: 3% 0"
        />
      </q-card-section>

      <q-card-section class="container">
        <label for="file">
          <div class="styled-file-input">
            <div class="attachment-button">🔗 FILE UPLOAD</div>
            <p v-if="fileName" class="attached-file">{{ fileName }}</p>
          </div>
        </label>
        <input type="file" id="file" @change="fileInputHandler" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          class="backbtn"
          @click="goBack()"
          style="width: 10%; margin: 3% 1%"
          >뒤로가기</q-btn
        >
        <q-btn
          class="registerbtn"
          @click="submitQuiz"
          style="width: 10%; margin: 3% 0"
          >문제 등록</q-btn
        >
      </q-card-actions>
    </q-card>
  </q-form>
</template>

<script setup>
import { ref, defineEmits, onMounted, computed } from 'vue';
import { api } from 'src/boot/axios';
import { useManagerStore } from 'src/stores/auth';

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

// 서버에서 과목 분류 가져오기
const categories = ref([]);
const subjectOptions = ref([]);
const detailSubjectOptions = ref([]);

// 서버에서 카테고리 데이터를 가져오는 함수
const fetchCategories = async () => {
  try {
    const response = await api.get('/api/quiz/subject', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    categories.value = response.data;
    console.log('카테고리: ', categories.value);

    // 대분류와 소분류 옵션 설정
    subjectOptions.value = categories.value.map(category => category.subject);
    detailSubjectOptions.value = categories.value.flatMap(
      category => category.detailSubject,
    );
  } catch (error) {
    console.error('카테고리를 불러오는 중 오류가 발생했습니다:', error);
  }
};

// 컴포넌트가 마운트된 후에 카테고리 데이터를 가져오는 함수를 호출합니다.
onMounted(fetchCategories);

const managerStore = useManagerStore();
const accessToken = managerStore.accessToken;

const subject = ref('');
const detailSubject = ref('');
const quiz = ref('');
const option = ref([
  { label: '', value: '1' },
  { label: '', value: '2' },
  { label: '', value: '3' },
  { label: '', value: '4' },
]);
const answer = ref('');
const commentary = ref('');

// 대분류 선택에 따라 소분류 옵션을 업데이트하는 함수
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
  console.log('서버에 제출될 데이터:', quizData);
  api
    .post('/api/quiz/default', quizData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => {
      console.log('서버 응답:', response.data);
      // 성공적으로 서버에 데이터를 전송한 후의 동작
    })
    .catch(error => {
      console.error('서버 응답 오류:', error);
      // 서버에 데이터 전송 중 오류가 발생한 경우의 동작
    });
};
</script>

<style scoped>
@import '/src/css/QuizBtn.css';
</style>
