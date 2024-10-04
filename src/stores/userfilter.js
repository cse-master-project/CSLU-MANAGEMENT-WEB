import { defineStore } from 'pinia';

export const userFilterStore = defineStore('filters', {
  state: () => ({
    subject: '선택해주세요.',
    detailSubject: '선택해주세요.',
    quizType: '선택해주세요.',
    PermissionStatus: '선택해주세요',
  }),
  actions: {
    setSubject(subject) {
      this.subject = subject;
    },
    setDetailSubject(detailSubject) {
      this.detailSubject = detailSubject;
    },
    setQuizType(quizType) {
      this.quizType = quizType;
    },
    setPermissionStatus(PermissionStatus) {
      this.PermissionStatus = PermissionStatus;
    },
  },
});
