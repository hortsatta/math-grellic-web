import { defer } from 'react-router-dom';
import { useBoundStore } from '#/core/hooks/use-store.hook';

import { searchByCurrentStudentUser } from '../api/global-search.api';
import { defaultParamKeys } from '../hooks/use-student-global-search-results.hook';

import type { QueryClient } from '@tanstack/react-query';

export function studentSearchResultsLoader(queryClient: QueryClient) {
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
    const query = searchByCurrentStudentUser(keys);

    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}
