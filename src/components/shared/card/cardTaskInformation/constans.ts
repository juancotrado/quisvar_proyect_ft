export const statusText = {
  UNRESOLVED: 'POR HACER',
  PROCESS: 'HACIENDO',
  INREVIEW: 'POR REVISAR',
  DENIED: 'POR CORREGIR',
  DONE: 'HECHO',
  LIQUIDATION: 'LIQUIDADO',
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
      DONE: {
        status: 'LIQUIDATION',
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
      PROCESS: {
        status: 'UNRESOLVED',
      },
    },
  },
};
