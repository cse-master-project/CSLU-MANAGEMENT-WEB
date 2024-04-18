<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="val => $emit('update:modelValue', val)"
    transition-show="none"
    transition-hide="none"
    @hide="changeViewMode('SignInForm')"
  >
    <q-card :style="{ width: '400px' }">
      <q-card-section class="flex">
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="q-px-xl q-pb-xl">
        <!-- v-if 조건부 렌더링 -->
        <!-- <SignInForm
          v-if="viewMode === 'SignInForm'"
          @change-view="changeViewMode"
        />
        <GoogleSignInForm v-else @change-view="changeViewMode" /> -->

        <!-- 동적 컴포넌트 -->
        <component
          :is="authViewComponents[viewMode]"
          @change-view="changeViewMode"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue';

// import SignInForm from './SignInFrom.vue';
// import GoogleSignInForm from './GoogleSignInForm.vue';

defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});
defineEmits(['update:modelValue']);

// 구글 로그인 폼 띄울지
const viewMode = ref('SignInForm'); //디폴트로는 로그인 폼.
const changeViewMode = mode => (viewMode.value = mode);
// 동적 컴포넌트 뷰
// const authViewComponents = {
//   SignInForm,
//   GoogleSignInForm,
// };

// defineAsys ?
const authViewComponents = {
  SignInForm: defineAsyncComponent(() => import('./SignInFrom.vue')),
};
</script>

<style lang="scss" scoped></style>
