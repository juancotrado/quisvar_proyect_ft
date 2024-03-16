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
  attendance: GroupAttendanceRes[];
  duty: Duty[];
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
export type DutyMember = {
  id?: number;
  position?: string;
  fullName: string;
  progress?: string;
  lastMeeting?: Date | string;
  futureMeeting?: Date | string;
  status: string;
  request?: string;
  dutyId: number;
};

export type Duty = {
  id: number;
  CUI: string;
  project: string;
  asitec?: string;
  feedback?: string;
  listId: number;
  createdAt?: Date | string;
  members: DutyMember[];
};
