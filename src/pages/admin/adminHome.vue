<template>
  <q-page class="q-pa-md">
    <div class="q-gutter-md row">
      <!-- Not Approved Quizzes -->
      <q-card class="col" flat bordered>
        <h5>미승인 문제</h5>
        <notApprovedQuizList />
      </q-card>
      <!-- Reported Quizzes -->
      <q-card class="col" flat bordered>
        <h5>신고 문제</h5>
        <reportedQuizList />
      </q-card>
    </div>
  </q-page>
</template>

<script setup></script>

<style lang="scss" scoped>
.row {
  display: flex;
  justify-content: space-between;
}
.q-card {
  width: 48%; /* 두 카드가 화면의 절반씩 차지하도록 설정 */
}
</style>
