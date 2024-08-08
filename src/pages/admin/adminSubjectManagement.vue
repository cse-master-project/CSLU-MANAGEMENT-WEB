<template>
  <q-page class="q-pa-md">
    <q-card class="my-card">
      <!-- 버튼 섹션 -->
      <q-card-section class="button-section">
        <q-btn
          round
          color="primary"
          icon="visibility"
          @click="showSection('view')"
          class="action-btn"
          >조회</q-btn
        >
        <q-btn
          round
          color="secondary"
          icon="add"
          @click="showSection('add')"
          class="action-btn"
          >추가</q-btn
        >
        <q-btn
          round
          color="orange"
          icon="edit"
          @click="showSection('edit')"
          class="action-btn"
          >수정</q-btn
        >
        <q-btn
          round
          color="negative"
          icon="delete"
          @click="showSection('delete')"
          class="action-btn"
          >삭제</q-btn
        >
      </q-card-section>

      <!-- 동적 컴포넌트 -->
      <q-card-section>
        <component :is="currentSection" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue';

const currentSection = ref(
  defineAsyncComponent(() =>
    import('src/components/chapterManagement/ViewSection.vue'),
  ),
);

// 버튼 클릭 시 보여줄 컴포넌트를 변경하는 함수
const showSection = section => {
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
}

.button-section {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.action-btn {
  width: 60px;
  height: 60px;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.q-card-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
