import { memo, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import { Menu } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import isTime from 'validator/lib/isTime';
import toast from 'react-hot-toast';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { getErrorMessage } from '#/utils/string.util';
import { getDayJsDuration } from '#/utils/time.util';
import { stripHtml } from '#/utils/html.util';
import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { RecordStatus } from '#/core/models/core.model';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseStepper } from '#/base/components/base-stepper.component';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseDropdownMenu } from '#/base/components/base-dropdown-menu.component';
import { BaseDropdownButton } from '#/base/components/base-dropdown-button.component';
import { BaseStepperStep } from '#/base/components/base-stepper-step.component';
import { defaultQuestion } from '../helpers/exam-form.helper';
import { ExamUpsertFormStep1 } from './exam-upsert-form-step-1.component';
import { ExamUpsertFormStep2 } from './exam-upsert-form-step-2.component';
import { ExamUpsertFormStep3 } from './exam-upsert-form-step-3.component';

import type { FormProps, IconName } from '#/base/models/base.model';
import type { Exam } from '../models/exam.model';
import type { ExamUpsertFormData } from '../models/exam-form-data.model';

type Props = FormProps<'div', ExamUpsertFormData, Promise<Exam | undefined>> & {
  schoolYearId: number;
};

const EXAM_PREVIEW_PATH = `/${teacherBaseRoute}/${teacherRoutes.exam.to}/${teacherRoutes.exam.previewTo}`;
const EXAM_LIST_PATH = `/${teacherBaseRoute}/${teacherRoutes.exam.to}`;

const choiceSchema = z.object({
  id: z.number().optional(),
  orderNumber: z
    .number({ required_error: 'Choice number is required' })
    .int()
    .gt(0, 'Choice number is invalid'),
  text: z.string().optional(),
  isCorrect: z.boolean(),
  imageData: z.string().optional(),
});

const questionSchema = z.object({
  id: z.number().optional(),
  orderNumber: z
    .number({ required_error: 'Question number is required' })
    .int()
    .gt(0, 'Question number is invalid'),
  text: z.string().optional(),
  choices: z.array(choiceSchema).min(2),
  imageData: z.string().optional(),
});

const schema = z
  .object({
    orderNumber: z
      .number({
        required_error: 'Exam number is required',
        invalid_type_error: 'Exam number is invalid ',
      })
      .int()
      .gt(0),
    title: z
      .string()
      .min(1, 'Exam title is required')
      .max(255, 'Title is too long'),
    coveredLessonIds: z.array(z.number()).optional(),
    randomizeQuestions: z.boolean(),
    visibleQuestionsCount: z
      .number({
        required_error: 'Visible questions is required',
        invalid_type_error: 'Visible questions is invalid',
      })
      .int()
      .gt(0, 'Visible questions should be greater than zero'),
    pointsPerQuestion: z
      .number()
      .int()
      .gt(0, 'Points per question should be greater than zero'),
    passingPoints: z
      .number({
        required_error: 'Passing points is required',
        invalid_type_error: 'Passing points is invalid',
      })
      .int()
      .gt(0, 'Passing points should be greater than zero'),
    description: z.string().optional(),
    excerpt: z.string().optional(),
    status: z.nativeEnum(RecordStatus),
    questions: z.array(questionSchema).min(1),
    // Schedule
    scheduleTitle: z
      .string()
      .min(1, 'Schedule title is required')
      .max(255, 'Schedule title is too long')
      .optional(),
    startDate: z
      .date()
      .min(new Date(`${new Date().getFullYear()}-01-01`), 'Date is invalid')
      .optional(),
    endDate: z
      .date()
      .min(new Date(`${new Date().getFullYear()}-01-01`), 'Date is invalid')
      .optional(),
    startTime: z
      .string()
      .refine((value) => isTime(value, { hourFormat: 'hour12' }), {
        message: 'Start time is invalid',
      })
      .optional(),
    endTime: z
      .string()
      .refine((value) => isTime(value, { hourFormat: 'hour12' }), {
        message: 'End time is invalid',
      })
      .optional(),
    studentIds: z.array(z.number()).nullable().optional(),
    slug: z.string().optional(),
    schoolYearId: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.passingPoints >
      data.pointsPerQuestion * data.visibleQuestionsCount
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passing points is more that total points',
        path: ['passingPoints'],
      });
    }

    if (data.visibleQuestionsCount > data.questions.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Visible questions is more than the total questions',
        path: ['visibleQuestionsCount'],
      });
    }

    data.questions.forEach((question, index) => {
      // Check if an answer is selected from one of the choices
      const isValid = question.choices.some((choice) => choice.isCorrect);
      if (!isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Pick an answer from the choices',
          path: [`questions.${index}.choices.0.text`],
        });
      }

      stripHtml(
        question.text || '',
        () =>
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Question is invalid',
            path: [`questions.${index}.text`],
          }),
        () =>
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Question is invalid',
            path: [`questions.${index}.text`],
          }),
      );

      question.choices.forEach((choice, cIndex) => {
        stripHtml(
          choice.text || '',
          () =>
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Choice is invalid',
              path: [`questions.${index}.choices.${cIndex}.text`],
            }),
          () =>
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Choice is invalid',
              path: [`questions.${index}.choices.${cIndex}.text`],
            }),
        );
      });
    });

    if (
      data.scheduleTitle ||
      data.startDate ||
      data.endDate ||
      data.startTime ||
      data.endTime
    ) {
      if (!data.scheduleTitle?.trim().length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Schedule title is invalid',
          path: ['scheduleTitle'],
        });
      }

      if (!data.startDate || !data.endDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Date is invalid',
          path: ['startDate'],
        });
      }

      if (!data.startTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Start time is invalid',
          path: ['startTime'],
        });
      }

      if (!data.endTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'End time is invalid',
          path: ['endTime'],
        });
      }

      if (data.startDate && data.endDate && data.startTime && data.endTime) {
        const startDateTime = dayjs(
          `${dayjs(data.startDate).format('YYYY-MM-DD')} ${data.startTime}`,
          'YYYY-MM-DD hh:mm A',
        );

        const endDateTime = dayjs(
          `${dayjs(data.endDate).format('YYYY-MM-DD')} ${data.endTime}`,
          'YYYY-MM-DD hh:mm A',
        );

        const duration = getDayJsDuration(
          endDateTime.toDate(),
          startDateTime.toDate(),
        ).asSeconds();

        if (duration <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Time is invalid',
            path: ['startTime'],
          });
        }
      }

      if (data.studentIds === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Assign students',
          path: ['studentIds'],
        });
      }
    }
  });

const defaultValues: Partial<ExamUpsertFormData> = {
  title: '',
  description: '',
  excerpt: '',
  coveredLessonIds: [],
  pointsPerQuestion: 1,
  status: RecordStatus.Draft,
  randomizeQuestions: false,
  orderNumber: null,
  visibleQuestionsCount: undefined,
  passingPoints: undefined,
  questions: [defaultQuestion],
  scheduleTitle: undefined,
  startDate: undefined,
  endDate: undefined,
  startTime: undefined,
  endTime: undefined,
  studentIds: undefined,
  schoolYearId: undefined,
};

export const ExamUpsertForm = memo(function ({
  className,
  formData,
  schoolYearId,
  loading: formLoading,
  isDone,
  onDone,
  onSubmit,
  onDelete,
  ...moreProps
}: Props) {
  const navigate = useNavigate();
  const setExActImageEdit = useBoundStore((state) => state.setExActImageEdit);
  const setExamFormData = useBoundStore((state) => state.setExamFormData);

  const [isEdit, isEditPublished] = useMemo(
    () => [!!formData, formData?.status === RecordStatus.Published],
    [formData],
  );

  const methods = useForm<ExamUpsertFormData>({
    shouldFocusError: false,
    defaultValues: formData
      ? {
          ...formData,
          scheduleTitle: undefined,
          startDate: undefined,
          endDate: undefined,
          startTime: undefined,
          endTime: undefined,
          studentIds: undefined,
        }
      : { ...defaultValues, schoolYearId },
    resolver: zodResolver(schema),
  });

  const {
    formState: { isSubmitting },
    trigger,
    reset,
    getValues,
    handleSubmit,
  } = methods;

  const loading = useMemo(
    () => formLoading || isSubmitting || isDone,
    [formLoading, isSubmitting, isDone],
  );

  const [publishButtonLabel, publishButtonIconName]: [string, IconName] =
    useMemo(
      () => [
        isEditPublished ? 'Save Changes' : 'Publish Now',
        (isEditPublished ? 'floppy-disk-back' : 'share-fat') as IconName,
      ],
      [isEditPublished],
    );

  const handleReset = useCallback(() => {
    reset(
      isEdit
        ? {
            ...formData,
            scheduleTitle: undefined,
            startDate: undefined,
            endDate: undefined,
            startTime: undefined,
            endTime: undefined,
            studentIds: undefined,
          }
        : { ...defaultValues, schoolYearId },
    );
  }, [schoolYearId, isEdit, formData, reset]);

  const handleSubmitError = useCallback(
    (errors: FieldErrors<ExamUpsertFormData>) => {
      const errorMessage = getErrorMessage(errors);
      toast.error(errorMessage || '');
    },
    [],
  );

  const submitForm = useCallback(
    async (data: ExamUpsertFormData, status?: RecordStatus) => {
      try {
        const targetData = status ? { ...data, status } : data;
        const exam = await onSubmit(targetData);

        if (!exam) {
          toast.error('Cannot update exam, please try again');
          return;
        }

        toast.success(
          `${isEdit ? 'Updated' : 'Created'} ${exam.title} (No. ${
            exam.orderNumber
          })`,
        );

        onDone && onDone(true);
        navigate(EXAM_LIST_PATH);
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [isEdit, onSubmit, onDone, navigate],
  );

  const handlePreview = useCallback(async () => {
    const isValid = await trigger();

    if (!isValid) {
      toast.error('Please fill in all the required fields');
      return;
    }

    setExamFormData(getValues());
    window.open(EXAM_PREVIEW_PATH, '_blank')?.focus();
  }, [trigger, getValues, setExamFormData]);

  useEffect(() => {
    // Clear image edit value
    setExActImageEdit();

    // Set lessonFormData to undefined when unmounting component
    return () => {
      setExamFormData();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cx('w-full', className)} {...moreProps}>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit((data) => submitForm(data), handleSubmitError)}
        >
          <BaseStepper
            disabled={loading}
            onReset={handleReset}
            controlsRightContent={
              <div className='group-button w-full sm:w-auto'>
                <BaseButton
                  className='w-full'
                  rightIconName={publishButtonIconName}
                  loading={loading}
                  disabled={isDone}
                  onClick={handleSubmit(
                    (data) => submitForm(data, RecordStatus.Published),
                    handleSubmitError,
                  )}
                >
                  {publishButtonLabel}
                </BaseButton>
                <BaseDropdownMenu disabled={loading}>
                  <Menu.Item
                    as={BaseDropdownButton}
                    iconName='floppy-disk-back'
                    onClick={handleSubmit(
                      (data) => submitForm(data, RecordStatus.Draft),
                      handleSubmitError,
                    )}
                    disabled={loading}
                  >
                    Save as Draft
                  </Menu.Item>
                  <Menu.Item
                    as={BaseDropdownButton}
                    iconName='eyes'
                    onClick={handlePreview}
                    disabled={loading}
                  >
                    Preview
                  </Menu.Item>
                  {isEdit && (
                    <>
                      <BaseDivider className='my-1' />
                      <Menu.Item
                        as={BaseDropdownButton}
                        className='text-red-500'
                        iconName='trash'
                        onClick={onDelete}
                        disabled={loading}
                      >
                        Delete
                      </Menu.Item>
                    </>
                  )}
                </BaseDropdownMenu>
              </div>
            }
          >
            <BaseStepperStep label='Exam Info'>
              <ExamUpsertFormStep1 disabled={loading} />
            </BaseStepperStep>
            <BaseStepperStep label='Questions'>
              <ExamUpsertFormStep2 disabled={loading} />
            </BaseStepperStep>
            {!isEditPublished && (
              <BaseStepperStep label='Exam Schedule'>
                <ExamUpsertFormStep3 disabled={loading} />
              </BaseStepperStep>
            )}
          </BaseStepper>
        </form>
      </FormProvider>
    </div>
  );
});
