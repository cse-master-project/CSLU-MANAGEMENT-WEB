<template>
  <q-page class="q-pa-md flex flex-center">
    <div class="q-gutter-md row justify-center">
      <div class="col">
        <ApprovalRequestList />
      </div>
      <div class="col">
        <ReportHistoryList />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import ApprovalRequestList from 'src/components/admin/ApprovalRequestList.vue';
import ReportHistoryList from 'src/components/admin/ReportHistoryList.vue';
</script>

<style lang="scss" scoped>
// 필요한 스타일을 여기에 정의
.col {
  max-width: 50%;
}
</style>
