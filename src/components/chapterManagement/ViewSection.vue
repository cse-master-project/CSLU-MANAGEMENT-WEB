<template>
  <q-card class="custom-card">
    <q-card-section class="q-pa-none">
      <div class="flex-container">
        <!-- 과목 선택 리스트 -->
        <div class="list-container">
          <q-item-label class="list-title">과목</q-item-label>
          <q-list bordered class="custom-list">
            <q-item
              v-for="subject in subjectOptions"
              :key="subject.subject"
              clickable
              :class="{ 'active-item': selectedSubject === subject.subject }"
              @click="selectSubject(subject.subject)"
            >
              <q-item-section>{{ subject.subject }}</q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- 챕터 선택 리스트 -->
        <div class="list-container">
          <q-item-label class="list-title">챕터</q-item-label>
          <q-list bordered class="custom-list">
            <!-- 챕터가 없을 때 -->
            <q-item v-if="chapterOptions.length === 0">
              <q-item-section>챕터가 없습니다.</q-item-section>
            </q-item>
            <!-- 챕터가 있을 때 -->
            <q-item
              v-for="chapter in chapterOptions"
              :key="chapter"
              clickable
              v-else
            >
              <q-item-section>{{ chapter }}</q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { onMounted } from 'vue';
import { useCategorie } from 'src/services/quiz/admin/useCategorie.js';

// 서비스 불러오기
const {
  subjectOptions,
  selectedSubject,
  chapterOptions,
  fetchSubjects,
  selectSubject,
} = useCategorie();

// 컴포넌트 마운트 시 전체 과목 목록 조회
onMounted(() => {
  fetchSubjects();
});
</script>

<style scoped>
.custom-card {
  max-width: 800px;
  margin: auto;
  border-radius: 8px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  background: #f9f9f9;
}

.flex-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.list-container {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.list-title {
  font-weight: bold;
  margin-bottom: 8px;
}

.custom-list {
  border: none;
}

.list-item {
  transition: background-color 0.3s ease;
}

.list-item:hover {
  background-color: #e0e0e0;
}

.active-item {
  background-color: #c6daee;
  font-weight: bold;
}
</style>
