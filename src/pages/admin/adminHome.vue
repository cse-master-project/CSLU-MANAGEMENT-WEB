<template>
  <q-page class="q-pa-md">
    <div class="q-gutter-md row justify-center">
      <!-- 미승인 문제 카드 -->
      <q-card class="my-card col-12 col-md-5" flat bordered>
        <q-card-section class="bg-grey-2">
          <div class="text-h6 text-center">미승인 문제</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <NotApprovedQuizList />
        </q-card-section>
      </q-card>
      <!-- 신고 문제 카드 -->
      <q-card class="my-card col-12 col-md-5" flat bordered>
        <q-card-section class="bg-grey-2">
          <div class="text-h6 text-center">신고 문제</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <ReportedQuizList />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import NotApprovedQuizList from 'src/pages/notApprovedQuizzes/[id]/components/NotApprovedQuizList.vue';
import ReportedQuizList from 'src/pages/reportedQuizzes/[id]/components/ReportedQuizList.vue';
</script>

<style scoped>
.my-card {
  margin: 10px; /* 카드 간의 간격을 조정합니다. */
  /* 반응형 디자인을 위해 미디어 쿼리를 사용할 수 있습니다. */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 카드에 약간의 그림자를 추가하여 입체감을 줍니다. */
}

.bg-grey-2 {
  background-color: #f5f5f5; /* 카드 섹션의 배경색을 약간 더 밝게 변경합니다. */
}

.text-center {
  text-align: center; /* 텍스트를 가운데 정렬합니다. */
}

.text-h6 {
  font-weight: bold; /* 제목 텍스트의 가중치를 증가시켜 강조합니다. */
  color: #faa108; /* 제목 텍스트 색상을 변경합니다. */
}

.q-gutter-md > .q-card {
  transition: transform 0.2s; /* 카드에 호버 효과를 추가하여 반응성을 높입니다. */
}

.q-gutter-md > .q-card:hover {
  transform: translateY(
    -5px
  ); /* 마우스를 올리면 카드가 살짝 떠오르는 효과를 줍니다. */
}
</style>
