<template>
  <div>
    <q-badge
      v-if="quizPermissionStatus === 0"
      color="orange"
      text-color="white"
    >
      승인 대기 중
    </q-badge>
    <q-badge
      v-else-if="quizPermissionStatus === 1"
      color="green"
      text-color="white"
    >
      승인됨
    </q-badge>
    <q-badge
      v-else-if="quizPermissionStatus === -1"
      color="red"
      text-color="white"
    >
      반려됨
    </q-badge>
    <div v-if="rejectReasons.length > 0">
      <div v-for="reason in rejectReasons" :key="reason.quizId" class="q-mb-md">
        <q-card>
          <q-card-section>
            <div>반려이유 : {{ reason.reason }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  quizPermissionStatus: {
    type: Number,
    required: true,
  },
  rejectReasons: {
    type: Array,
    required: true,
  },
});
</script>
