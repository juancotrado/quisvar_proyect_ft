export const statusText = {
  UNRESOLVED: 'POR HACER',
  PROCESS: 'HACIENDO',
  INREVIEW: 'POR REVISAR',
  DENIED: 'POR CORREGIR',
  DONE: 'HECHO',
};
interface StatusBody {
  [category: string]: {
    [role: string]: {
      [state: string]: {
        status: string;
      };
    };
  };
}
export const statusBody: StatusBody = {
  ASIG: {
    EMPLOYEE: {
      UNRESOLVED: {
        status: 'PROCESS',
      },
      PROCESS: {
        status: 'INREVIEW',
      },
      DENIED: {
        status: 'INREVIEW',
      },
    },
    SUPERADMIN: {
      INREVIEW: {
        status: 'DONE',
      },
    },
  },
  DENY: {
    EMPLOYEE: {
      PROCESS: {
        status: 'UNRESOLVED',
      },
    },
    SUPERADMIN: {
      INREVIEW: {
        status: 'DENIED',
      },
    },
  },
};
