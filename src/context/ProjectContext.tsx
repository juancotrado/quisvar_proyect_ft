import {
  createContext,
  createRef,
  useContext,
  useState,
  useCallback,
} from 'react';
import { loader$ } from '../services/sharingSubject';
import { SocketContext } from './SocketContex';
import { useLocation } from 'react-router-dom';
import {
  CoverBody,
  DayTask,
  DayTaskBody,
  ProjecContextType,
  SocketProviderProps,
} from './ProjectContex';

// Constants
const INITIAL_VALUES_EDIT = {
  isEdit: false,
};
const INITIAL_VALUES = {
  dayTask: INITIAL_VALUES_EDIT,
  handleIsEditDayTask: () => {},
  addDayTaskBody: () => {},
  setDayTaksRef: () => {},
  handleSaveDaysTask: () => {},
  cover: INITIAL_VALUES_EDIT,
  handleIsEditCover: () => {},
  handleSaveCover: () => {},
  addCoverBody: () => {},
  resetValues: () => {},
};

// Context
export const ProjectContext = createContext<ProjecContextType>(INITIAL_VALUES);

export const ProjectProvider = ({ children }: SocketProviderProps) => {
  const socket = useContext(SocketContext);
  const location = useLocation();

  const [dayTask, setDayTask] = useState<DayTask>(INITIAL_VALUES_EDIT);
  const [dayTaskBody, setDayTaskBody] = useState<DayTaskBody[]>([]);

  const handleIsEditDayTask = useCallback(() => {
    setDayTaskBody([]);
    setDayTask({ ...dayTask, isEdit: !dayTask.isEdit });
  }, [dayTask]);

  const setDayTaksRef = useCallback((ids: number[]) => {
    const refDayTaks = ids.reduce(
      (acc, id, i) => ({
        ...acc,
        [id]: { ref: createRef<HTMLInputElement>(), pos: i },
      }),
      {}
    );
    setDayTask(prev => ({ ...prev, refs: refDayTaks }));
  }, []);

  const addDayTaskBody = useCallback((dayTask: DayTaskBody) => {
    setDayTaskBody(prev => {
      const existDaytask = prev.find(({ id }) => id === dayTask.id);
      if (existDaytask) {
        return prev.map(el => (el.id === dayTask.id ? dayTask : el));
      } else {
        return [...prev, dayTask];
      }
    });
  }, []);

  const handleSaveDaysTask = useCallback(
    (stageId?: string) => {
      const socketEmit: { [key: string]: string } = {
        basicos: 'client:update-task-days-basic',
        presupuestos: 'client:update-task-days-budget',
      };
      if (!stageId) return;
      if (dayTaskBody.length === 0) return handleIsEditDayTask();

      const actualRoute = location.pathname.split('/').pop();
      loader$.setSubject = true;
      socket.emit(
        socketEmit[actualRoute as keyof typeof socketEmit],
        dayTaskBody,
        stageId,
        () => {
          loader$.setSubject = false;
          handleIsEditDayTask();
        }
      );
    },
    [dayTaskBody, handleIsEditDayTask, location.pathname, socket]
  );

  //cover
  const [cover, setcover] = useState(INITIAL_VALUES_EDIT);
  const [coversBody, setCoversBody] = useState<CoverBody[]>([]);

  const handleIsEditCover = useCallback(() => {
    setCoversBody([]);
    setcover({ ...cover, isEdit: !cover.isEdit });
  }, [cover]);

  const addCoverBody = useCallback((cover: CoverBody) => {
    setCoversBody(prev => {
      const existCover = prev.find(({ id }) => id === cover.id);
      if (existCover) {
        return prev.map(el => (el.id === cover.id ? cover : el));
      } else {
        return [...prev, cover];
      }
    });
  }, []);

  const handleSaveCover = useCallback(
    (stageId?: string) => {
      if (!stageId) return;
      const socketEmit: { [key: string]: string } = {
        basicos: 'client:update-cover-basic',
        presupuestos: 'client:update-cover-budget',
      };
      if (coversBody.length === 0) return handleIsEditCover();

      const actualRoute = location.pathname.split('/').pop();
      loader$.setSubject = true;
      socket.emit(
        socketEmit[actualRoute as keyof typeof socketEmit],
        coversBody,
        stageId,
        () => {
          loader$.setSubject = false;
          handleIsEditCover();
        }
      );
    },
    [coversBody, handleIsEditCover, location.pathname, socket]
  );

  const resetValues = () => {
    setcover(INITIAL_VALUES_EDIT);
    setDayTask(INITIAL_VALUES_EDIT);
    setCoversBody([]);
    setDayTaskBody([]);
  };
  // Context Value
  const value = {
    dayTask,
    handleIsEditDayTask,
    setDayTaksRef,
    addDayTaskBody,
    handleSaveDaysTask,
    cover,
    handleIsEditCover,
    handleSaveCover,
    addCoverBody,
    resetValues,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};
