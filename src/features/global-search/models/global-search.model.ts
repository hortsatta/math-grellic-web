import type { RefObject } from 'react';
import type { IconName } from '#/base/models/base.model';
import type { Activity } from '#/activity/models/activity.model';
import type { Exam } from '#/exam/models/exam.model';
import type { Lesson } from '#/lesson/models/lesson.model';
import type { StudentPerformance } from '#/performance/models/performance.model';
import type { MeetingSchedule } from '#/schedule/models/schedule.model';

export enum SearchFilter {
  Lesson = 'lesson',
  Exam = 'exam',
  Activity = 'activity',
  StudentPerformance = 'student-performance',
  MeetingSchedule = 'meeting-schedule',
  Others = 'others',
}

export type OtherLink = {
  name: string;
  label: string;
  to: string;
  icon?: IconName;
};

export type SearchResults = {
  lessons: Lesson[];
  exams: Exam[];
  activities: Activity[];
  studentPerformances: StudentPerformance[];
  meetingSchedules: MeetingSchedule[];
  others: OtherLink[];
};

export type GlobalSearchSlice = {
  searchKeyword: string | null;
  setSearchKeyword: (value: string | null) => void;
  setSearchInputRef: (ref: RefObject<HTMLInputElement>) => void;
  searchInputRef?: RefObject<HTMLInputElement>;
};
