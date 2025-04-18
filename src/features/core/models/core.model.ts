import type { Socket } from 'socket.io-client';
import type { SidebarMode } from '#/base/models/base.model';

export enum RecordStatus {
  Draft = 'draft',
  Published = 'published',
}

export type AuditTrail = {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

export type ExActImageEdit = {
  file: any;
  index: number;
  cIndex?: number;
  sIndex?: number;
};

export type CoreSlice = {
  socket?: Socket;
  openRegister?: boolean;
  openLogin?: boolean;
  exActImageEdit?: ExActImageEdit;
  exActFocusedIndex?: string;
  sidebarMode: SidebarMode;
  rightSidebarMode: Omit<SidebarMode, 'Hidden'>;
  setSocket: (socket: Socket) => void;
  setOpenRegister: (openRegister?: boolean) => void;
  setOpenLogin: (openLogin?: boolean) => void;
  setExActImageEdit: (exActImageEdit?: ExActImageEdit) => void;
  setExActFocusedIndex: (index?: string) => void;
  setSidebarMode: (sidebarMode: SidebarMode) => void;
  toggleRightSidebarMode: () => void;
};

export type PaginatedQueryData<T> = (T[] | number)[];
