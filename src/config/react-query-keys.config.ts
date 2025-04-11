export const queryCoreKey = {
  time: ['core', 'time'],
};

export const queryUserKey = {
  currentUser: ['users', 'current-user'],
  adminList: ['users', 'admin-list'],
  adminSingle: ['users', 'admin-single'],
  teacherList: ['users', 'teacher-list'],
  teacherSingle: ['users', 'teacher-single'],
  studentList: ['users', 'student-list'],
  studentSingle: ['users', 'student-single'],
  studentAssignedTeacher: ['users', 'student-assigned-teacher'],
  allAdminList: ['users', 'all-admin-list'],
  allTeacherList: ['users', 'all-teacher-list'],
  allStudentList: ['users', 'all-student-list'],
  selectedStudentList: ['users', 'selected-student-list'],
};

export const queryTeacherPerformanceKey = {
  class: ['performances', 'class'],
  lesson: ['performances', 'lesson'],
  exam: ['performances', 'exam'],
  activity: ['performances', 'activity'],
};

export const queryStudentPerformanceKey = {
  list: ['performances', 'list'],
  single: ['performances', 'single'],
};

export const queryLessonKey = {
  list: ['lessons', 'list'],
  single: ['lessons', 'single'],
  selectedLessonList: ['lessons', 'selected-lesson-list'],
  studentPerformance: ['lessons', 'student-performance'],
};

export const queryExamKey = {
  list: ['exams', 'list'],
  single: ['exams', 'single'],
  studentPerformance: ['exams', 'student-performance'],
  studentPerformanceResult: ['exams', 'student-performance-result'],
};

export const queryActivityKey = {
  list: ['activities', 'list'],
  single: ['activities', 'single'],
  studentPerformance: ['activities', 'student-performance'],
  gameList: ['activities', 'game-list'],
};

export const queryScheduleKey = {
  timeline: ['schedules', 'timeline'],
  daily: ['schedules', 'daily'],
  list: ['schedules', 'list'],
  single: ['schedules', 'single'],
};

export const queryAnnouncementKey = {
  list: ['announcement', 'list'],
  single: ['announcement', 'single'],
};
