import type { StateCreator } from 'zustand';

import type { RefObject } from 'react';
import type { GlobalSearchSlice } from '../models/global-search.model';

export const createGlobalSearchSlice: StateCreator<
  GlobalSearchSlice,
  [],
  [],
  GlobalSearchSlice
> = (set) => ({
  searchKeyword: '',
  searchInputRef: undefined,
  setSearchKeyword: (value: string | null) => set({ searchKeyword: value }),
  setSearchInputRef: (ref: RefObject<HTMLInputElement>) =>
    set({ searchInputRef: ref }),
});
