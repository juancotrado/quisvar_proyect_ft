export type GroupRes = {
  id: number;
  nombre: string;
  groupId: number;
  attendance: GroupAttendanceRes[];
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
