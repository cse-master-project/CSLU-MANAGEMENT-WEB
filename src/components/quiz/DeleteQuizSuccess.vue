<template>
  <q-dialog v-model="visible" persistent>
    <q-card class="delete-success-dialog">
      <q-card-section>
        <div class="text-h6">퀴즈 삭제 완료</div>
        <p>퀴즈가 성공적으로 삭제되었습니다.</p>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          color="primary"
          label="확인"
          @click="confirm"
          class="confirm-button"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  deleteQuizSuccess: Boolean,
});

const emit = defineEmits(['update:deleteQuizSuccess']);

const visible = ref(props.deleteQuizSuccess);

const router = useRouter();

const confirm = () => {
  emit('update:deleteQuizSuccess', false);
  router.push('/admin/adminManagement'); // 성공 후 페이지 이동
};
</script>

<style scoped>
.delete-success-dialog {
  max-width: 300px;
  width: 100%;
}

.confirm-button {
  border-radius: 5px;
  padding: 8px 16px;
  font-size: 14px;
}
</style>
