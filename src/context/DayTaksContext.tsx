import { createContext, createRef, JSX, RefObject, useState } from 'react';

interface DayTask {
  isEdit: boolean;
  refs?: {
    [key: number]: { ref: RefObject<HTMLInputElement>; pos: number };
  };
}
interface SocketProviderProps {
  children: JSX.Element | JSX.Element[];
}
interface DayTaskContextType {
  dayTask: DayTask;
  handleIsEditDayTask?: () => void;
  setDayTaksRef?: (ids: number[]) => void;
}

const INITIAL_VALUES: DayTask = {
  isEdit: true,
};

export const DayTaskContext = createContext<DayTaskContextType>({
  dayTask: INITIAL_VALUES,
});
export const DayTaskProvider = ({ children }: SocketProviderProps) => {
  const [dayTask, setDayTask] = useState<DayTask>(INITIAL_VALUES);
  const handleIsEditDayTask = () => {
    setDayTask({ ...dayTask, isEdit: !dayTask.isEdit });
  };

  const setDayTaksRef = (ids: number[]) => {
    const refDayTaks = ids.reduce(
      (acc, id, i) => ({
        ...acc,
        [id]: { ref: createRef<RefObject<HTMLInputElement>>(), pos: i },
      }),
      {}
    );
    setDayTask({ ...dayTask, refs: refDayTaks });
  };

  const data = { dayTask, handleIsEditDayTask, setDayTaksRef };
  return (
    <DayTaskContext.Provider value={data}>{children}</DayTaskContext.Provider>
  );
};
