<template>
  <q-page class="q-pa-md">
    <q-card class="my-card">
      <!-- 버튼 섹션 -->
      <q-card-section class="button-section">
        <q-btn
          round
          :class="{ active: currentSectionName === 'view' }"
          icon="visibility"
          @click="showSection('view')"
          class="action-btn"
        >
          조회
        </q-btn>
        <q-btn
          round
          :class="{ active: currentSectionName === 'add' }"
          icon="add"
          @click="showSection('add')"
          class="action-btn"
        >
          추가
        </q-btn>
        <q-btn
          round
          :class="{ active: currentSectionName === 'edit' }"
          icon="edit"
          @click="showSection('edit')"
          class="action-btn"
        >
          수정
        </q-btn>
        <q-btn
          round
          :class="{ active: currentSectionName === 'delete' }"
          icon="delete"
          @click="showSection('delete')"
          class="action-btn"
        >
          삭제
        </q-btn>
      </q-card-section>

      <!-- 동적 컴포넌트 -->
      <q-card-section class="content-section">
        <component :is="currentSection" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, shallowRef, defineAsyncComponent } from 'vue';

// 현재 활성화된 섹션 이름
const currentSectionName = ref('view');

// 현재 활성화된 섹션을 관리하는 shallowRef 사용
const currentSection = shallowRef(
  defineAsyncComponent(() =>
    import('src/components/chapterManagement/ViewSection.vue'),
  ),
);

// 버튼 클릭 시 보여줄 컴포넌트를 변경하는 함수
const showSection = section => {
  currentSectionName.value = section; // 현재 섹션 이름 업데이트
  switch (section) {
    case 'view':
      currentSection.value = defineAsyncComponent(() =>
        import('src/components/chapterManagement/ViewSection.vue'),
      );
      break;

    case 'add':
      currentSection.value = defineAsyncComponent(() =>
        import('src/components/chapterManagement/AddSection.vue'),
      );
      break;

    case 'edit':
      currentSection.value = defineAsyncComponent(() =>
        import('src/components/chapterManagement/EditSection.vue'),
      );
      break;

    case 'delete':
      currentSection.value = defineAsyncComponent(() =>
        import('src/components/chapterManagement/DeleteSection.vue'),
      );
      break;

    default:
      currentSection.value = defineAsyncComponent(() =>
        import('src/components/chapterManagement/ViewSection.vue'),
      );
      break;
  }
};
</script>

<style scoped>
.my-card {
  max-width: 1200px;
  margin: auto;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background: #ffffff;
}

.button-section {
  display: flex;
  justify-content: center;
  gap: 4rem;
  margin-bottom: 1rem;
}

.action-btn {
  width: 80px;
  height: 80px;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: #f5f5f5;
  color: black;
}

.action-btn.active {
  background-color: #007bff;
  color: white;
}

.action-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.q-card-section.content-section {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (max-width: 600px) {
  .button-section {
    gap: 1rem;
  }
  .action-btn {
    width: 70px;
    height: 70px;
    font-size: 1rem;
  }
}

@media (max-width: 410px) {
  .button-section {
    gap: 1rem;
  }
  .action-btn {
    width: 60px;
    height: 60px;
    font-size: 14px;
  }
}
</style>
