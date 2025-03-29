import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { hasImage, replaceImageSrcs } from '#/utils/html.util';
import { queryClient } from '#/config/react-query-client.config';
import { queryExamKey } from '#/config/react-query-keys.config';
import {
  transformToExam,
  transformToExamFormData,
} from '../helpers/exam-transform.helper';
import {
  getExamBySlugAndCurrentTeacherUser,
  validateUpsertExam as validateUpsertExamApi,
  uploadExamImages as uploadExamImagesApi,
  editExam as editExamApi,
  deleteExam as deleteExamApi,
} from '../api/teacher-exam.api';

import type { Exam } from '../models/exam.model';
import type { ExamUpsertFormData } from '../models/exam-form-data.model';

type Result = {
  loading: boolean;
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  examFormData: ExamUpsertFormData | undefined;
  editExam: (data: ExamUpsertFormData) => Promise<Exam>;
  deleteExam: () => Promise<boolean>;
};

export function useExamEdit(slug?: string): Result {
  const [isDone, setIsDone] = useState(false);

  const { mutateAsync: validateUpsertExam, isLoading: isValidateExamLoading } =
    useMutation(validateUpsertExamApi());

  const {
    mutateAsync: mutateUploadExamImages,
    isLoading: isUploadImagesLoading,
  } = useMutation(uploadExamImagesApi());

  const { mutateAsync: mutateEditExam, isLoading } = useMutation(
    editExamApi({
      onSuccess: (data) =>
        Promise.all([
          queryClient.invalidateQueries({
            queryKey: queryExamKey.list,
          }),
          queryClient.invalidateQueries({
            queryKey: [...queryExamKey.single, { slug: data?.slug }],
          }),
        ]),
    }),
  );

  const { mutateAsync: mutateDeleteExam, isLoading: isDeleteLoading } =
    useMutation(
      deleteExamApi({
        onSuccess: () =>
          Promise.all([
            queryClient.invalidateQueries({
              queryKey: queryExamKey.list,
            }),
            queryClient.invalidateQueries({
              queryKey: [...queryExamKey.single, { slug }],
            }),
          ]),
      }),
    );

  const {
    data: exam,
    isLoading: isQueryLoading,
    isFetching: isQueryFetching,
  } = useQuery(
    getExamBySlugAndCurrentTeacherUser(
      { slug: slug || '' },
      {
        enabled: !!slug,
        refetchOnWindowFocus: false,
        select: (data: any) => {
          return transformToExam(data);
        },
      },
    ),
  );

  const examFormData = useMemo(
    () => (exam ? transformToExamFormData(exam) : undefined),
    [exam],
  );

  const editExam = useCallback(
    async (data: ExamUpsertFormData) => {
      // Validate exam data before creation
      await validateUpsertExam({ data, slug });
      // If includes any image, then upload image first
      const htmls = data.questions.flatMap((q) => [
        q.text,
        ...q.choices.map((c) => c.text),
      ]);

      // If with images then upload with strict true and update exam with strict false
      // else then update exam with strict true to delete unused images

      const hasExamImages = hasImage(htmls);

      if (hasExamImages) {
        const images = await mutateUploadExamImages({ data, strict: true });
        // Replace base64 images from text field with uploaded images url
        data.questions.forEach((question) => {
          // Filter images by question order number and no 'c' character present in filename
          const qImages = images.filter((img) => {
            const filename = img.split('/').pop() || '';
            return (
              !filename.includes('c') &&
              filename.split('-')[1] === `q${question.orderNumber}`
            );
          });
          question.text = replaceImageSrcs(question.text, qImages);

          question.choices.forEach((choice) => {
            // Filter images by question and choice order number
            const cImages = images.filter((img) => {
              const imgSplitNames = (img.split('/').pop() || '').split('-');
              return (
                imgSplitNames[1] === `q${question.orderNumber}` &&
                imgSplitNames[2] === `c${choice.orderNumber}`
              );
            });

            choice.text = replaceImageSrcs(choice.text, cImages);
          });
        });
      }

      return mutateEditExam({
        slug: slug || '',
        data,
        strict: !hasExamImages,
      });
    },
    [slug, validateUpsertExam, mutateEditExam, mutateUploadExamImages],
  );

  const deleteExam = useCallback(async () => {
    if (!slug?.trim()) {
      return false;
    }

    return mutateDeleteExam(slug);
  }, [slug, mutateDeleteExam]);

  return {
    loading:
      isLoading ||
      isDeleteLoading ||
      isQueryLoading ||
      isQueryFetching ||
      isValidateExamLoading ||
      isUploadImagesLoading,
    isDone,
    setIsDone,
    examFormData,
    editExam,
    deleteExam,
  };
}
