import type { SceneRouteHandle } from '#/base/models/base.model';

export const studentPerformanceRouteHandle: {
  [key: string]: SceneRouteHandle;
} = {
  single: {
    title: 'Performance Details',
    links: [],
  },
  exams: {
    title: 'Exam Performance Details',
    links: [],
  },
  activities: {
    title: 'Activity Performance Details',
    links: [],
  },
  lessons: {
    title: 'Lesson Performance Details',
    links: [],
  },
};
