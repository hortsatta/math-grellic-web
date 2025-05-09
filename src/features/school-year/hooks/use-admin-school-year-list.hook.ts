import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { PAGINATION_TAKE } from '#/utils/api.util';
import { adminBaseRoute, adminRoutes } from '#/app/routes/admin-routes';
import { transformToSchoolYear } from '../helpers/school-year-transform.helper';
import { getPaginatedSchoolYearsByCurrentAdminUser } from '../api/admin-school-year.api';

import type {
  QueryFilterOption,
  QueryPagination,
  QuerySort,
} from '#/base/models/base.model';
import type { SchoolYear } from '../models/school-year.model';

type Result = {
  schoolYears: SchoolYear[];
  loading: boolean;
  totalCount: number;
  pagination: QueryPagination;
  setKeyword: (keyword: string | null) => void;
  setFilters: (filter: QueryFilterOption[]) => void;
  setSort: (sort: QuerySort) => void;
  refresh: () => void;
  nextPage: () => void;
  prevPage: () => void;
  handleSchoolYearEdit: (slug: string) => void;
  handleSchoolYearDetails: (slug: string) => void;
};

const SCHOOL_YEAR_LIST_PATH = `/${adminBaseRoute}/${adminRoutes.schoolYear.to}`;

export const defaultSort = {
  field: 'startDate',
  order: 'desc' as QuerySort['order'],
};

export const defaultParamKeys = {
  q: undefined,
  status: undefined,
  sort: `${defaultSort.field},${defaultSort.order}`,
  pagination: { take: PAGINATION_TAKE, skip: 0 },
};

export function useAdminSchoolYearList(): Result {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState<string | null>(null);
  const [filters, setFilters] = useState<QueryFilterOption[]>([]);
  const [sort, setSort] = useState<QuerySort>(defaultSort);
  const [skip, setSkip] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    setSkip(0);
  }, [keyword, filters, sort]);

  const status = useMemo(() => {
    if (!filters.length) {
      return undefined;
    }

    return filters
      .filter((f) => f.name === 'status')
      .map((f) => f.value)
      .join(',');
  }, [filters]);

  const querySort = useMemo(() => `${sort.field},${sort.order}`, [sort]);

  const pagination = useMemo(() => ({ take: PAGINATION_TAKE, skip }), [skip]);

  const { data, isLoading, isRefetching, refetch } = useQuery(
    getPaginatedSchoolYearsByCurrentAdminUser(
      { q: keyword || undefined, status, sort: querySort, pagination },
      {
        refetchOnWindowFocus: false,
        select: (data: any[]) => {
          const [items, totalCount] = data;
          const transformedItems = items.map((item: unknown) =>
            transformToSchoolYear(item),
          );

          return [transformedItems, +totalCount];
        },
      },
    ),
  );

  const [schoolYears, dataCount] = useMemo(() => {
    const [items, count] = data || [];

    return [(items || []) as SchoolYear[], count as number];
  }, [data]);

  const nextPage = useCallback(() => {
    const count = skip + pagination.take;

    if (totalCount <= count) {
      return;
    }

    setSkip(count);
  }, [skip, totalCount, pagination]);

  const prevPage = useCallback(() => {
    if (skip <= 0) {
      return;
    }
    setSkip(Math.max(0, skip - pagination.take));
  }, [skip, pagination]);

  const handleSchoolYearDetails = useCallback(
    (slug: string) => {
      navigate(`${SCHOOL_YEAR_LIST_PATH}/${slug}`);
    },
    [navigate],
  );

  const handleSchoolYearEdit = useCallback(
    (slug: string) => {
      navigate(
        `${SCHOOL_YEAR_LIST_PATH}/${slug}/${adminRoutes.schoolYear.editTo}`,
      );
    },
    [navigate],
  );

  const refresh = useCallback(() => {
    setSkip(0);
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!dataCount) {
      return;
    }
    setTotalCount(dataCount);
  }, [dataCount]);

  return {
    schoolYears,
    loading: isLoading || isRefetching,
    totalCount,
    pagination,
    setKeyword,
    setFilters,
    setSort,
    refresh,
    nextPage,
    prevPage,
    handleSchoolYearDetails,
    handleSchoolYearEdit,
  };
}
