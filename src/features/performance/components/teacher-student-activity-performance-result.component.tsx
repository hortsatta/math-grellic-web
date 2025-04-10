import { memo, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { transformToActivity } from '#/activity/helpers/activity-transform.helper';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { activityGameLabel } from '#/activity/models/activity.model';
import { StudentActivityQuestionResult } from '#/activity/components/student-activity-question-result.component';
import { getStudentActivityWithCompletionsByPublicIdAndSlug } from '../api/teacher-performance.api';

import type { ComponentProps } from 'react';
import type { ActivityGame } from '#/activity/models/activity.model';

type Props = ComponentProps<'div'> & {
  slug: string;
  categoryId: number;
};

export const TeacherStudentActivityPerformanceResult = memo(function ({
  slug,
  categoryId,
  ...moreProps
}: Props) {
  const { publicId } = useParams();

  const {
    data: activity,
    isFetching,
    isLoading,
  } = useQuery(
    getStudentActivityWithCompletionsByPublicIdAndSlug(
      { publicId: publicId || '', slug },
      {
        refetchOnWindowFocus: false,
        enabled: !!publicId,
        select: (data: unknown) => transformToActivity(data),
      },
    ),
  );

  const [title, gameName, category] = useMemo(
    () => [
      activity?.title,
      activityGameLabel[activity?.game.name as ActivityGame],
      activity?.categories.find((cat) => cat.id === categoryId),
    ],
    [categoryId, activity],
  );

  const [questions, activityCompletion] = useMemo(
    () => [
      category?.questions || [],
      category?.completions?.length ? category.completions[0] : null,
    ],
    [category],
  );

  const label = useMemo(() => (title ? `Results for ${title}` : ''), [title]);

  const questionAnswers = useMemo(
    () =>
      activityCompletion?.questionAnswers?.map((answer) => {
        const question = questions.find((q) => q.id === answer.question.id);
        return {
          question,
          selectedQuestionChoiceId: answer.selectedQuestionChoice?.id,
        };
      }) || [],
    [activityCompletion, questions],
  );

  if (isFetching || isLoading) {
    return (
      <div className='mt-5 flex w-full justify-center'>
        <BaseSpinner />
      </div>
    );
  }

  return (
    <div {...moreProps}>
      {activityCompletion ? (
        <StudentActivityQuestionResult
          questionAnswers={questionAnswers}
          gameName={gameName}
          label={label}
          labelHeading
        />
      ) : (
        <div className='w-full pt-4 text-center'>Nothing to show</div>
      )}
    </div>
  );
});
