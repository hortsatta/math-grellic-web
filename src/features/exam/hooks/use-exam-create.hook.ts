import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { hasImage, replaceImageSrcs } from '#/utils/html.util';
import { queryClient } from '#/config/react-query-client.config';
import { queryExamKey } from '#/config/react-query-keys.config';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import {
  createExam as createExamApi,
  validateUpsertExam as validateUpsertExamApi,
  uploadExamImages as uploadExamImagesApi,
} from '../api/teacher-exam.api';

import type { Exam } from '../models/exam.model';
import type { ExamUpsertFormData } from '../models/exam-form-data.model';

type Result = {
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  createExam: (data: ExamUpsertFormData) => Promise<Exam>;
  loading?: boolean;
};

export function useExamCreate(): Result {
  const schoolYear = useBoundStore((state) => state.schoolYear);
  const [isDone, setIsDone] = useState(false);

  const { mutateAsync: validateUpsertExam, isLoading: isValidateExamLoading } =
    useMutation(validateUpsertExamApi());

  const {
    mutateAsync: mutateUploadExamImages,
    isLoading: isUploadImagesLoading,
  } = useMutation(uploadExamImagesApi());

  const { mutateAsync: mutateCreateExam, isLoading: isCreateExamLoading } =
    useMutation(
      createExamApi({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: queryExamKey.list,
          });
        },
      }),
    );

  const createExam = useCallback(
    async (data: ExamUpsertFormData) => {
      // Validate exam data before creation
      await validateUpsertExam({ data });
      // If includes any image, then upload image first
      const htmls = data.questions.flatMap((q) => [
        q.text,
        ...q.choices.map((c) => c.text),
      ]);

      if (hasImage(htmls)) {
        const images = await mutateUploadExamImages({
          data,
          schoolYearId: schoolYear?.id,
        });
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

      return mutateCreateExam(data);
    },
    [schoolYear, validateUpsertExam, mutateUploadExamImages, mutateCreateExam],
  );

  return {
    loading:
      isValidateExamLoading || isCreateExamLoading || isUploadImagesLoading,
    isDone,
    setIsDone,
    createExam,
  };
}
