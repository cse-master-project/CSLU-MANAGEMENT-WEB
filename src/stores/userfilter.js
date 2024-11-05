import { defineStore } from 'pinia';

export const userFilterStore = defineStore('filters', {
  state: () => ({
    subject: '',
    detailSubject: '',
    quizType: '',
    PermissionStatus: '',
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
