<template>
  <q-dialog>
    <!-- 다이얼로그 내용 -->

    <q-card-actions align="right">
      <q-btn label="닫기" @click="closeDialog" />
    </q-card-actions>
  </q-dialog>
</template>

<script setup>
defineEmits(['close-dialog']);

const closeDialog = () => {
  emit('close-dialog');
};
</script>
