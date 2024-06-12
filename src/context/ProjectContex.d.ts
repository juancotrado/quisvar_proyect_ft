// export Interfaces
export interface DayTask {
  isEdit: boolean;
  refs?: {
    [key: number]: { ref: RefObject<HTMLInputElement>; pos: number };
  };
}

export interface SocketProviderProps {
  children: JSX.Element | JSX.Element[];
}

export interface DayTaskBody {
  id: number;
  days: number;
}
export interface CoverBody {
  id: number;
  cover: boolean;
}

export interface ProjecContextType {
  dayTask: DayTask;
  handleIsEditDayTask: () => void;
  addDayTaskBody: (el: DayTaskBody) => void;
  setDayTaksRef: (ids: number[]) => void;
  handleSaveDaysTask: (stageId?: string) => void;
  addCoverBody: (el: CoverBody) => void;
  handleSaveCover: (stageId?: string) => void;
  handleIsEditCover: () => void;
  cover: {
    isEdit: boolean;
  };
  resetValues: () => void;
}
