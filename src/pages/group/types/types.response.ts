export type GroupRes = {
  id: number;
  nombre: string;
  groupId: number;
  title?: string;
  file?: string;
  createdAt: string | Date;
  groups: {
    name: string;
    gNumber: number;
    moderator: {
      profile: {
        firstName: string;
        lastName: string;
      };
    };
  };
  // attendance: GroupAttendanceRes[];
  duty: DutyBasic[];
};
export type DutyBasic = {
  duty: Pick<Duty, 'id' | 'CUI' | 'project' | 'shortName'>;
};
export type GroupAttendanceRes = {
  id: number;
  // description: string;
  status: string;
  user: {
    profile: {
      firstName: string;
      lastName: string;
    };
  };
};
export type GroupUsersRes = {
  id: number;
  firstName: string;
  lastName: string;
  status: string;
  description?: string;
};
// export type Duty = {
//   id: number;
//   listId: number;
//   fullName?: string;
//   description?: string;
//   startDate?: Date | string;
//   untilDate?: Date | string;
//   createdAt?: Date | string;
// };
export type Duty = {
  id: number;
  CUI: string;
  project: string;
  shortName: string;
  titleMeeting?: string;
  dutyGroup?: string;
  members: DutyMember[];
  listId: number;
  createdAt?: Date | string;
};
export type DutyMember = {
  id?: number;
  position?: string;
  fullName: string;
  task: DutyTasks[];
  feedBack?: string;
  dailyDuty?: string;
  attendance?: string;
  dutyId: number;
};

export type DutyTasks = {
  id: number;
  name?: string;
  percentage?: number;
  dutyMemberId: number;
};
