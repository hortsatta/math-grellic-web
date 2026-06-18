import { defer } from 'react-router-dom';
import { useBoundStore } from '#/core/hooks/use-store.hook';

import { searchByCurrentTeacherUser } from '../api/global-search.api';
import { defaultParamKeys } from '../hooks/use-teacher-global-search-results.hook';

import type { QueryClient } from '@tanstack/react-query';

export function teacherSearchResultsLoader(queryClient: QueryClient) {
  return async () => {
    const searchKeyword = useBoundStore.getState().searchKeyword;

    if (!searchKeyword?.trim().length) {
      return null;
    }

    const schoolYearId = useBoundStore.getState().schoolYear?.id;
    const keys = {
      ...defaultParamKeys,
      q: searchKeyword,
      schoolYearId: schoolYearId,
    };
    const query = searchByCurrentTeacherUser(keys);

    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}
