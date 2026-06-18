import { studentBaseRoute, studentRoutes } from '#/app/routes/student-routes';
import type { GroupLink, SceneRouteHandle } from '#/base/models/base.model';

export const studentScheduleBaseRoute = `/${studentBaseRoute}/${studentRoutes.schedule.to}`;

const calendarLink = {
  to: studentScheduleBaseRoute,
  label: 'Calendar',
  icons: [{ name: 'calendar' }] as GroupLink['icons'],
};

const meetingListLink = {
  to: `${studentScheduleBaseRoute}/${studentRoutes.schedule.meeting.to}`,
  label: 'Meeting List',
  icons: [{ name: 'presentation' }] as GroupLink['icons'],
};

export const studentScheduleRouteHandle: { [key: string]: SceneRouteHandle } = {
  calendar: {
    title: 'Calendar',
    links: [meetingListLink],
  },
  list: {
    title: 'Meeting Schedules',
    links: [calendarLink],
  },
  single: { disabledSceneWrapper: true },
};
