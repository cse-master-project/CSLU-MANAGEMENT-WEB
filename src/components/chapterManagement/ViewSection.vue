<template>
  <q-card>
    <q-card-section class="q-pa-none">
      <div class="flex-container">
        <!-- 대분류 선택 리스트 -->
        <div class="list-container">
          <q-item-label>과목</q-item-label>
          <q-list bordered class="q-mb-md">
            <q-item
              v-for="option in subjectOptions"
              :key="option.value"
              clickable
              :active="subject === option"
              @click="selectSubject(option)"
            >
              <q-item-section>{{ option }}</q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- 소분류 선택 리스트 -->
        <div class="list-container">
          <q-item-label>챕터</q-item-label>
          <q-list bordered class="q-mb-md">
            <q-item
              v-for="option in filteredDetailSubjectOptions"
              :key="option.value"
              clickable
              :active="detailSubject === option"
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
  // 대분류 선택에 따라 소분류 옵션을 업데이트하는 함수
  filteredDetailSubjectOptions.value = getDetailSubjectsBySubject(
    subject.value,
  );
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
.flex-container {
  display: flex;
  justify-content: space-between;
}

.list-container {
  flex: 1;
  margin: 0 10px;
}

.q-item.active {
  background-color: #e0e0e0;
}
</style>
