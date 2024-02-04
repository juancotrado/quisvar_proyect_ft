export type GroupRes = {
  id: number;
  nombre: string;
  groupId: number;
  title?: string;
  createdAt: string;
  groups: {
    name: string;
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
  description: string;
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
export type Duty = {
  id: number;
  listId: number;
  fullName?: string;
  description?: string;
  startDate?: Date | string;
  untilDate?: Date | string;
  createdAt?: Date | string;
};
