<template>
  <div>
    <div>{{ quizcontent.quiz }}</div>
  </div>
</template>

<script setup>
defineProps({
  quizcontent: {
    type: Object,
    required: true,
  },
});
</script>
