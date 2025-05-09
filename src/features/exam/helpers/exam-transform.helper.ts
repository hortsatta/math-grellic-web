import dayjs from '#/config/dayjs.config';
import { attachCompleteImageSrcs, hasImage } from '#/utils/html.util';
import { transformToBaseModel } from '#/base/helpers/base.helper';
import { transformToLesson } from '#/lesson/helpers/lesson-transform.helper';
import { transformToExamSchedule } from './exam-schedule-transform.helper';

import type { StudentUserAccount } from '#/user/models/user.model';
import type { Lesson } from '#/lesson/models/lesson.model';
import type {
  Exam,
  ExamCompletion,
  ExamCompletionQuestionAnswer,
  ExamQuestion,
  ExamQuestionChoice,
} from '../models/exam.model';
import type {
  ExamQuestionChoiceFormData,
  ExamQuestionFormData,
  ExamUpsertFormData,
} from '../models/exam-form-data.model';

const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const VITE_SUPABASE_STORAGE_BASE_PATH = import.meta.env
  .VITE_SUPABASE_STORAGE_BASE_PATH;

const imgBaseUrl = `${VITE_SUPABASE_URL}${VITE_SUPABASE_STORAGE_BASE_PATH}/`;

export function transformToExam(
  {
    id,
    createdAt,
    updatedAt,
    status,
    orderNumber,
    title,
    slug,
    randomizeQuestions,
    visibleQuestionsCount,
    pointsPerQuestion,
    passingPoints,
    description,
    excerpt,
    coveredLessons,
    questions,
    schedules,
    scheduleStatus,
    completions,
    rank,
  }: any,
  withLesson?: boolean,
): Exam {
  const transformedCoveredLessons = withLesson
    ? coveredLessons?.map((lesson: any) => transformToLesson(lesson)) || []
    : coveredLessons?.map((lesson: any) => ({ id: lesson.id })) || [];

  const transformedQuestions =
    questions?.map((question: any) => transformToExamQuestion(question)) || [];

  const transformedSchedules = schedules
    ? schedules.map((schedule: any) => transformToExamSchedule(schedule))
    : undefined;

  const transformedCompletions = completions
    ? completions.map((completion: any) =>
        transformToExamCompletion(completion),
      )
    : undefined;

  return {
    status,
    orderNumber,
    title,
    slug,
    randomizeQuestions,
    visibleQuestionsCount,
    pointsPerQuestion,
    passingPoints,
    description,
    excerpt,
    coveredLessons: transformedCoveredLessons,
    questions: transformedQuestions,
    schedules: transformedSchedules,
    scheduleStatus,
    completions: transformedCompletions,
    rank,
    ...transformToBaseModel(id, createdAt, updatedAt),
  };
}

export function transformToExamQuestion({
  id,
  createdAt,
  updatedAt,
  orderNumber,
  text,
  choices,
}: any): ExamQuestion {
  const updatedText = hasImage(text)
    ? attachCompleteImageSrcs(text, imgBaseUrl, true)
    : text;

  const transformedChoices = choices
    ? choices.map((choice: any) => transformToExamQuestionChoice(choice))
    : [];

  return {
    orderNumber,
    text: updatedText,
    choices: transformedChoices,
    ...transformToBaseModel(id, createdAt, updatedAt),
  };
}

export function transformToExamQuestionChoice({
  id,
  createdAt,
  updatedAt,
  orderNumber,
  text,
  isCorrect,
}: any): ExamQuestionChoice {
  const updatedText = hasImage(text)
    ? attachCompleteImageSrcs(text, imgBaseUrl, true)
    : text;

  return {
    orderNumber,
    text: updatedText,
    isCorrect,
    ...transformToBaseModel(id, createdAt, updatedAt),
  };
}

export function transformToExamCompletion({
  id,
  createdAt,
  updatedAt,
  submittedAt,
  score,
  questionAnswers,
  exam,
  schedule,
  student,
  isHighest,
  isRecent,
}: any): Partial<ExamCompletion> {
  const transformedQuestionAnswers =
    questionAnswers?.map((answer: any) =>
      transformToExamCompletionQuestionAnswer(answer),
    ) || [];

  const transformedSchedule = schedule
    ? transformToExamSchedule(schedule)
    : undefined;

  const transformedStudent = student
    ? ({ id: student.id } as StudentUserAccount)
    : undefined;

  return {
    submittedAt: dayjs(submittedAt).toDate(),
    score,
    questionAnswers: transformedQuestionAnswers,
    exam,
    schedule: transformedSchedule,
    student: transformedStudent,
    isHighest: isHighest ?? null,
    isRecent: isRecent ?? null,
    ...transformToBaseModel(id, createdAt, updatedAt),
  };
}

export function transformToExamCompletionQuestionAnswer({
  id,
  createdAt,
  updatedAt,
  question,
  selectedQuestionChoice,
}: any): Partial<ExamCompletionQuestionAnswer> {
  return {
    question: { id: question.id } as ExamQuestion,
    selectedQuestionChoice: selectedQuestionChoice
      ? ({
          id: selectedQuestionChoice.id,
        } as ExamQuestionChoice)
      : null,
    ...transformToBaseModel(id, createdAt, updatedAt),
  };
}

export function transformToExamFormData({
  status,
  orderNumber,
  slug,
  title,
  randomizeQuestions,
  visibleQuestionsCount,
  pointsPerQuestion,
  passingPoints,
  description,
  excerpt,
  coveredLessons,
  questions,
  schedules,
}: any): ExamUpsertFormData {
  let startDate = undefined;
  let startTime = undefined;
  let endDate = undefined;
  let endTime = undefined;
  let studentIds = undefined;

  if (schedules?.length === 1) {
    const dayJsStartDate = dayjs(schedules[0].startDate);
    const dayJsEndDate = dayjs(schedules[0].endDate);

    startDate = dayJsStartDate.toDate();
    startTime = dayJsStartDate.format('hh:mm A');
    endDate = dayJsEndDate.toDate();
    endTime = dayJsEndDate.format('hh:mm A');
    studentIds =
      schedules[0].students?.map((student: StudentUserAccount) => student.id) ||
      [];
  }

  const coveredLessonIds =
    coveredLessons?.map((lesson: Partial<Lesson>) => lesson.id) || [];

  const transformedQuestions =
    questions?.map((question: any) =>
      transformToExamQuestionFormData(question),
    ) || [];

  return {
    status,
    orderNumber,
    slug,
    title,
    randomizeQuestions,
    visibleQuestionsCount,
    pointsPerQuestion,
    passingPoints,
    description: description || undefined,
    excerpt: excerpt || undefined,
    coveredLessonIds,
    questions: transformedQuestions,
    startDate,
    startTime,
    endDate,
    endTime,
    studentIds,
  };
}

export function transformToExamQuestionFormData({
  id,
  orderNumber,
  text,
  choices,
}: any): ExamQuestionFormData {
  const transformedChoices =
    choices?.map((choice: any) =>
      transformToExamQuestionChoiceFormData(choice),
    ) || [];

  return {
    id,
    orderNumber,
    text,
    choices: transformedChoices,
  };
}

export function transformToExamQuestionChoiceFormData({
  id,
  orderNumber,
  text,
  isCorrect,
}: any): ExamQuestionChoiceFormData {
  return {
    id,
    orderNumber,
    text,
    isCorrect,
  };
}

export function transformToExamUpsertDto({
  status,
  orderNumber,
  title,
  randomizeQuestions,
  visibleQuestionsCount,
  pointsPerQuestion,
  passingPoints,
  description,
  excerpt,
  coveredLessonIds,
  questions,
  scheduleTitle,
  startDate,
  startTime,
  endDate,
  endTime,
  studentIds,
  schoolYearId,
}: any) {
  const transformedStartDate = startDate
    ? dayjs(`${dayjs(startDate).format('YYYY-MM-DD')} ${startTime}`).toDate()
    : undefined;

  const transformedEndDate = endDate
    ? dayjs(`${dayjs(endDate).format('YYYY-MM-DD')} ${endTime}`).toDate()
    : undefined;

  const transformedStudentsIds = !studentIds?.length ? null : studentIds;

  const questionsDto =
    questions?.map((question: any) =>
      transformToExamQuestionUpsertDto(question),
    ) || [];

  return {
    status,
    orderNumber,
    title,
    randomizeQuestions,
    visibleQuestionsCount,
    pointsPerQuestion,
    passingPoints,
    description,
    excerpt,
    coveredLessonIds: coveredLessonIds?.length ? coveredLessonIds : undefined,
    questions: questionsDto,
    scheduleTitle,
    startDate: transformedStartDate,
    endDate: transformedEndDate,
    studentIds: transformedStudentsIds,
    schoolYearId,
  };
}

export function transformToExamQuestionUpsertDto({
  id,
  orderNumber,
  text,
  choices,
}: any) {
  const choicesDto =
    choices?.map((choice: any) =>
      transformToExamQuestionChoiceUpsertDto(choice),
    ) || [];

  return {
    id,
    orderNumber,
    text,
    choices: choicesDto,
  };
}

export function transformToExamQuestionChoiceUpsertDto({
  id,
  orderNumber,
  text,
  isCorrect,
}: any) {
  return {
    id,
    orderNumber,
    text,
    isCorrect,
  };
}
