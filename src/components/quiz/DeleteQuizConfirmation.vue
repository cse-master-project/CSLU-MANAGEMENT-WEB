<template>
  <q-dialog v-model="visible" persistent>
    <q-card class="delete-success-dialog">
      <q-card-section>
        <div class="text-h6">퀴즈 폐기하시겠습니까 ?</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          color="primary"
          label="취소"
          @click="deleteCancle"
          class="deleteCancle-button"
        />
        <!-- <q-btn
          flat
          color="red"
          label="폐기"
          @click="quizDelete"
          class="deleteCancle-button"
        /> -->
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  isDelete: Boolean,
});

const emit = defineEmits(['update:isDelete']);

const visible = ref(props.isDelete);

const router = useRouter();

const deleteCancle = () => {
  emit('update:isDelete', false);
};
</script>

<style scoped>
.delete-success-dialog {
  max-width: 300px;
  width: 100%;
}

.deleteCancle-button {
  border-radius: 5px;
  padding: 8px 16px;
  font-size: 14px;
}
</style>
