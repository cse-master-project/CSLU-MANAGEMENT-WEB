<template>
  <q-card class="custom-card">
    <q-card-section class="card-section">
      <q-p class="section-title">과목 수정</q-p>
      <q-select
        v-model="atSubject"
        :options="subjectOptions.map(s => s.subject)"
        label="과목"
        outlined
        class="q-mb-md select-box"
      />
      <q-input
        v-model="subject"
        type="textarea"
        autogrow
        outlined
        placeholder="수정 과목을 입력해주세요."
        class="textbox"
      />
      <q-btn @click="submitsubject" class="submit-btn">과목 수정</q-btn>
    </q-card-section>
    <q-card-section class="card-section">
      <q-p class="section-title">챕터 수정</q-p>
      <q-select
        v-model="atSubject2"
        :options="subjectOptions.map(s => s.subject)"
        label="과목"
        outlined
        class="q-mb-md select-box"
      />
      <q-select
        v-model="atChapter"
        :options="chapterOptions"
        label="챕터"
        outlined
        class="q-mb-md select-box"
      />
      <q-input
        v-model="chapter"
        type="textarea"
        autogrow
        outlined
        placeholder="수정 챕터를 입력해주세요."
        class="textbox"
      />
      <q-btn @click="submitchapter" class="submit-btn">챕터 수정</q-btn>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { api } from 'src/boot/axios';
import {
  useCategorie,
  useCategorieUpdate,
} from 'src/services/quiz/admin/useCategorie.js';

// 서비스 불러오기
const {
  subjectOptions,
  chapterOptions,
  fetchSubjects,
  selectSubject,
  fetchChapters,
} = useCategorie();
const { updateSubject, updateChapter } = useCategorieUpdate();

// 과목 수정 기능
const atSubject = ref('');
const subject = ref('');
const submitsubject = async () => {
  const response = await updateSubject(atSubject.value, subject.value);
  if (response.success) {
    alert('과목이 수정되었습니다.');
    atSubject.value = '';
    subject.value = '';
    fetchSubjects(); // 과목 목록 갱신
  } else {
    alert('과목 수정 중 오류가 발생했습니다.');
  }
};

// 챕터 수정 기능
const atSubject2 = ref('');
const atChapter = ref('');
const chapter = ref('');
const submitchapter = async () => {
  const response = await updateChapter(
    atSubject2.value,
    atChapter.value,
    chapter.value,
  );
  if (response.success) {
    alert('챕터가 수정되었습니다.');
    atSubject2.value = '';
    atChapter.value = '';
    chapter.value = '';
  } else {
    alert('챕터 수정 중 오류가 발생했습니다.');
  }
};

// 과목 변경 시 챕터 옵션 업데이트
watch(atSubject2, newSubject => {
  if (newSubject) {
    selectSubject(newSubject);
    atChapter.value = ''; // 과목 변경 시 챕터 초기화
    chapter.value = ''; // 챕터 입력 필드 초기화
  }
});

onMounted(fetchSubjects);
</script>

<style scoped>
.custom-card {
  max-width: 650px; /* 카드의 최대 너비를 설정 */
  margin: auto; /* 카드의 좌우 여백을 자동으로 설정하여 중앙 정렬 */
  border-radius: 12px; /* 카드 모서리의 둥글기를 설정 */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); /* 카드에 그림자 효과 추가 */
  background: #ffffff; /* 카드 배경 색상 설정 (흰색) */
}

.card-section {
  padding: 20px; /* 카드 섹션의 내부 여백 설정 */
  border-bottom: 1px solid #e0e0e0; /* 카드 섹션의 하단 테두리 추가 */
}

.section-title {
  font-size: 1.2rem; /* 섹션 제목 폰트 크기 설정 */
  font-weight: bold; /* 섹션 제목의 폰트 굵기 설정 */
  margin-bottom: 1rem; /* 제목과 입력 필드 간의 간격 설정 */
}

.textbox {
  margin: 10px 0; /* 입력 필드의 상하 여백 설정 */
  width: 100%; /* 입력 필드의 너비를 100%로 설정 */
}

.submit-btn {
  width: 100%; /* 버튼의 너비를 100%로 설정 */
  background-color: rgb(224, 224, 224); /* 버튼 배경색을 파란색으로 설정 */
  color: #030303; /* 버튼 텍스트 색상을 흰색으로 설정 */
  font-weight: bold; /* 버튼 텍스트 굵기 설정 */
  margin-top: 10px; /* 버튼 상단 여백 설정 */
}

.submit-btn:hover {
  background-color: #c6daee; /* 버튼에 마우스를 올렸을 때 배경색 변경 */
}

.select-box {
  width: 100%; /* 선택 박스의 너비를 100%로 설정 */
}
</style>
