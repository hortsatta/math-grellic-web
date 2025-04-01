import type { Duration } from 'dayjs/plugin/duration';
import type { AuditTrail, RecordStatus } from '#/core/models/core.model';
import type { Lesson } from '#/lesson/models/lesson.model';
import type { StudentUserAccount } from '#/user/models/user.model';
import type { ExamUpsertFormData } from './exam-form-data.model';
import type { ExamSchedule, ExamScheduleStatus } from './exam-schedule.model';

export type Exam = Partial<AuditTrail> & {
  id: number;
  orderNumber: number;
  status: RecordStatus;
  title: string;
  slug: string;
  randomizeQuestions: boolean;
  visibleQuestionsCount: number;
  pointsPerQuestion: number;
  passingPoints: number;
  questions: ExamQuestion[];
  description?: string;
  excerpt?: string;
  coveredLessons?: Partial<Lesson>[];
  schedules?: ExamSchedule[];
  completions?: ExamCompletion[];
  scheduleStatus?: ExamScheduleStatus;
  rank?: number | null;
};

export type ExamWithDuration = {
  exam: Exam | null;
  duration: Duration | null;
};

export type ExamQuestion = Partial<AuditTrail> & {
  id: number;
  orderNumber: number;
  text: string;
  choices: ExamQuestionChoice[];
};

export type ExamQuestionChoice = Partial<AuditTrail> & {
  id: number;
  orderNumber: number;
  text: string;
  isCorrect: boolean;
};

export type ExamCompletion = Partial<AuditTrail> & {
  id: number;
  submittedAt: Date;
  score: number | null;
  questionAnswers: ExamCompletionQuestionAnswer[];
  exam: Exam;
  schedule: Partial<ExamSchedule>;
  student: StudentUserAccount;
  isHighest: boolean | null;
  isRecent: boolean | null;
};

export type ExamCompletionQuestionAnswer = Partial<AuditTrail> & {
  id: number;
  question: ExamQuestion;
  selectedQuestionChoice: ExamQuestionChoice | null;
};

export type ExamSlice = {
  examFormData?: ExamUpsertFormData | null;
  setExamFormData: (examFormData?: ExamUpsertFormData) => void;
};

export type StudentExamList = {
  latestExam: Exam | null;
  upcomingExam: Exam | null;
  previousExams: Exam[];
  ongoingExams: Exam[];
};
