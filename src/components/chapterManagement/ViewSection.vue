<template>
  <q-card class="custom-card">
    <q-card-section class="q-pa-none">
      <div class="flex-container">
        <!-- 대분류 선택 리스트 -->
        <div class="list-container">
          <q-item-label class="list-title">과목</q-item-label>
          <q-list bordered class="custom-list">
            <q-item
              v-for="option in subjectOptions"
              :key="option.value"
              clickable
              :class="{ 'active-item': subject === option }"
              @click="selectSubject(option)"
            >
              <q-item-section>{{ option }}</q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- 소분류 선택 리스트 -->
        <div class="list-container">
          <q-item-label class="list-title">챕터</q-item-label>
          <q-list bordered class="custom-list">
            <q-item
              v-for="option in filteredDetailSubjectOptions"
              :key="option.value"
              clickable
              @click="selectDetailSubject(option)"
            >
              <q-item-section>{{ option }}</q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { api } from 'src/boot/axios';
import useCategories from 'src/services/useCategories.js';

// 카테고리 조회 기능
const subject = ref('');
const detailSubject = ref('');
const { subjectOptions, fetchCategories, getDetailSubjectsBySubject } =
  useCategories();
const filteredDetailSubjectOptions = ref([]);

const updateDetailSubjectOptions = () => {
  const detailSubjects = getDetailSubjectsBySubject(subject.value);
  if (detailSubjects.length === 0) {
    filteredDetailSubjectOptions.value = ['챕터가 없습니다.'];
  } else {
    filteredDetailSubjectOptions.value = detailSubjects;
  }
};

const selectSubject = value => {
  subject.value = value;
  detailSubject.value = ''; // 선택 시 소분류 초기화
  updateDetailSubjectOptions(); // 소분류 옵션 업데이트
};

const selectDetailSubject = value => {
  detailSubject.value = value;
};

watch(subject, () => {
  detailSubject.value = '';
  updateDetailSubjectOptions();
});

onMounted(fetchCategories);
</script>

<style scoped>
.custom-card {
  max-width: 800px; /* 카드의 최대 너비를 설정 */
  margin: auto; /* 카드의 좌우 여백을 자동으로 설정하여 중앙 정렬 */
  border-radius: 8px; /* 카드 모서리의 둥글기를 설정 */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); /* 카드에 그림자 효과 추가 */
  background: #f9f9f9; /* 카드 배경 색상 설정 (연한 회색) */
}

.flex-container {
  display: flex;
  justify-content: space-between;
  gap: 20px; /* 리스트 간의 간격을 설정 */
}

.list-container {
  flex: 1;
  padding: 10px; /* 리스트 컨테이너의 내부 여백 설정 */
  border-radius: 8px; /* 컨테이너 모서리의 둥글기를 설정 */
  background: #ffffff; /* 컨테이너 배경 색상 설정 (흰색) */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 컨테이너에 그림자 효과 추가 */
}

.list-title {
  font-weight: bold;
  margin-bottom: 8px; /* 리스트 제목과 항목 간의 간격 설정 */
}

.custom-list {
  border: none; /* 리스트의 테두리 제거 */
}

.list-item {
  transition: background-color 0.3s ease; /* 배경색 변화 애니메이션 추가 */
}

.list-item:hover {
  background-color: #e0e0e0; /* 마우스를 올렸을 때 배경색 변경 */
}

/* 추가된 active-item 클래스 스타일 */
.active-item {
  background-color: #c6daee; /* 선택된 항목의 배경색 변경 */
  font-weight: bold; /* 선택된 항목의 글자 두께를 굵게 설정 */
}
@media (max-width: 450px) {
  .flex-container {
    flex-direction: column;
  }
}
</style>
