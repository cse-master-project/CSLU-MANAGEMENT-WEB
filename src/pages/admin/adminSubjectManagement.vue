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
import { ref, defineAsyncComponent } from 'vue';

const currentSectionName = ref('view'); // 현재 활성화된 섹션 이름

const currentSection = ref(
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
  max-width: 1200px; /* 카드의 최대 너비를 설정 */
  margin: auto; /* 카드의 좌우 여백을 자동으로 설정하여 중앙 정렬 */
  border-radius: 12px; /* 카드 모서리의 둥글기를 설정 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 카드에 그림자 효과 추가 */
  background: #ffffff; /* 카드 배경 색상 설정 (흰색) */
}

.button-section {
  display: flex; /* 버튼 섹션을 flexbox로 설정 */
  justify-content: center; /* 버튼을 가로 방향으로 중앙 정렬 */
  gap: 4rem; /* 버튼 사이의 간격을 4rem으로 설정 */
  margin-bottom: 1rem; /* 버튼 섹션의 하단 여백을 1rem으로 설정 */
}

.action-btn {
  width: 80px; /* 버튼의 너비를 80px로 설정 */
  height: 80px; /* 버튼의 높이를 80px로 설정 */
  font-size: 18px; /* 버튼 텍스트의 폰트 크기를 18px로 설정 */
  display: flex; /* 버튼의 내용을 flexbox로 배치 */
  align-items: center; /* 버튼의 내용이 수직 방향으로 중앙 정렬 */
  justify-content: center; /* 버튼의 내용이 수평 방향으로 중앙 정렬 */
  border-radius: 50%; /* 버튼의 모서리를 둥글게 (원형) 설정 */
  transition: all 0.3s ease; /* 버튼 상태 변경 시 애니메이션 효과 추가 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 버튼에 그림자 효과 추가 */
  background-color: #f5f5f5; /* 버튼의 기본 배경 색상 설정 (연한 회색) */
  color: black; /* 버튼 텍스트 색상 설정 (검은색) */
}

.action-btn.active {
  background-color: #007bff; /* 클릭 시 버튼 배경색을 파란색으로 변경 */
  color: white; /* 클릭 시 버튼 텍스트 색상 변경 */
}

.action-btn:hover {
  transform: scale(1.1); /* 버튼에 마우스를 올렸을 때 크기를 10% 확대 */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); /* 호버 시 그림자 효과 강화 */
}

.q-card-section.content-section {
  padding: 1rem; /* 콘텐츠 섹션의 내부 여백을 1rem으로 설정 */
  display: flex; /* 콘텐츠 섹션을 flexbox로 설정 */
  flex-direction: column; /* 콘텐츠를 세로 방향으로 배치 */
  gap: 1rem; /* 콘텐츠 간의 간격을 1rem으로 설정 */
}
@media (max-width: 600px) {
  .button-section {
    gap: 1rem;
  }
  .action-btn {
    width: 70px;
    height: 70px;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    background-color: #f5f5f5;
    color: black;
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
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    background-color: #f5f5f5;
    color: black;
  }
}
</style>
