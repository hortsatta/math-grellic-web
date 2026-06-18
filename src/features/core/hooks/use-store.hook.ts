import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';

import { createUserSlice } from '#/user/store/user.store';
import { createSchoolYearSlice } from '#/school-year/store/school-year.store';
import { createLessonSlice } from '#/lesson/store/lesson.store';
import { createExamSlice } from '#/exam/store/exam.store';
import { createActivitySlice } from '#/activity/store/activity.store';
import { createGlobalSearchSlice } from '#/global-search/store/global-search.store';
import { createCoreSlice } from '../store/core.store';

import type { UserSlice } from '#/user/models/user.model';
import type { SchoolYearSlice } from '#/school-year/models/school-year.model';
import type { LessonSlice } from '#/lesson/models/lesson.model';
import type { ExamSlice } from '#/exam/models/exam.model';
import type { ActivitySlice } from '#/activity/models/activity.model';
import type { CoreSlice } from '../models/core.model';
import type { GlobalSearchSlice } from '#/global-search/models/global-search.model';

export const useBoundStore = create<
  CoreSlice &
    UserSlice &
    SchoolYearSlice &
    LessonSlice &
    ExamSlice &
    ActivitySlice &
    GlobalSearchSlice
>()(
  devtools(
    persist(
      subscribeWithSelector((...a) => ({
        ...createCoreSlice(...a),
        ...createUserSlice(...a),
        ...createSchoolYearSlice(...a),
        ...createLessonSlice(...a),
        ...createExamSlice(...a),
        ...createActivitySlice(...a),
        ...createGlobalSearchSlice(...a),
      })),
      {
        name: 'main-storage',
        partialize: (state) => ({
          sidebarMode: state.sidebarMode,
          rightSidebarMode: state.rightSidebarMode,
          schoolYear: state.schoolYear,
          lessonFormData: state.lessonFormData,
          examFormData: state.examFormData,
          activityFormData: state.activityFormData,
          searchKeyword: state.searchKeyword,
        }),
        // Always set user field's initial value to undefined, to prevent localstorage manipulation
        merge: (persistedState, currentState) => ({
          ...currentState,
          ...(persistedState as any),
          user: undefined,
          syEnrollment: undefined,
        }),
      },
    ),
  ),
);
