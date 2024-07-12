<template>
  <q-dialog v-model="visible" persistent>
    <q-card>
      <q-card-section>
        <div class="text-h6">구글로그인</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat color="primary" label="구글로그인" @click="LoginGoogle" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, defineProps } from 'vue';

const props = defineProps({
  isLogin: Boolean,
});

const visible = ref(props.isLogin);

const LoginGoogle = () => {
  console.log('구글로그인');
};
</script>

<style scoped></style>
