import { ChangeEvent, FocusEvent, useState } from 'react';
import './notificationsList.css';
import { Button, Input } from '../../components';
import { axiosInstance } from '../../services/axiosInstance';

type MenuRole = 'MOD' | 'MEMBER' | 'VIEWER';

interface Menu {
  id: number;
  title: string;
  route: string;
  access: MenuRole[];
  menu?: Menu[];
}
interface Option {
  menuId: number;
  typeRol: MenuRole;
  menu?: Option[];
}
export const INDICE_GENERAL_OPTIONS: Menu[] = [
  { id: 14, title: 'CAEC', route: 'contratos', access: ['MOD'] },
  { id: 13, title: 'DEE', route: 'contratos1', access: ['MOD'] },
  { id: 12, title: 'DEP', route: 'contratos2', access: ['MOD'] },
  { id: 11, title: 'CF', route: 'contratos3', access: ['MOD'] },
  { id: 10, title: 'DCA,CC', route: 'contratos4', access: ['MOD'] },
  { id: 9, title: 'SUNAT', route: 'contratos5', access: ['MOD'] },
  { id: 8, title: 'OSCE', route: 'contratos6', access: ['MOD'] },
  { id: 7, title: 'Imagen Inst', route: 'contratos7', access: ['MOD'] },
  { id: 6, title: 'CPE', route: 'contratos8', access: ['MOD'] },
  { id: 5, title: 'DIEB', route: 'contratos8', access: ['MOD'] },
  { id: 4, title: 'DRP', route: 'contratos8', access: ['MOD'] },
  { id: 3, title: 'DPP', route: 'contratos8', access: ['MOD'] },
  { id: 2, title: 'AC', route: 'contratos8', access: ['MOD'] },
  { id: 1, title: 'DTI', route: 'contratos8', access: ['MOD'] },
];
const MENU_POINTS: Menu[] = [
  { id: 1, title: 'Inicio', route: 'home', access: ['MOD'] },
  { id: 2, title: 'Tramites', route: 'tramites', access: ['MOD'] },
  {
    id: 3,
    title: 'Proyectos',
    route: 'especialidades',
    access: ['MOD', 'VIEWER', 'MEMBER'],
  },
  {
    id: 4,
    title: 'Asistencia',
    route: 'asistencia',
    access: ['MOD'],
  },
  { id: 5, title: 'Usuarios', route: 'lista-de-usuarios', access: ['MOD'] },

  {
    id: 6,
    title: 'Empresas',
    route: 'empresas',
    access: ['MOD'],
  },
  {
    id: 7,
    title: 'Especialistas',
    route: 'especialistas',
    access: ['MOD'],
  },
  {
    id: 8,
    title: 'Indice General',
    route: 'indice-general',
    menu: INDICE_GENERAL_OPTIONS,
    access: ['MOD'],
  },
  {
    id: 9,
    title: 'Grupos',
    route: 'grupos',
    access: ['MOD'],
  },
];

export const NotificationsList = () => {
  const [menuPoints, setMenuPoints] = useState<Option[]>([]);
  const [role, setRole] = useState('');

  // const { userSession } = useSelector((state: RootState) => state);
  // const [subTasks, setSubTasks] = useState<ReviewList[]>();

  // useEffect(() => {
  //   if (!userSession.id) return;
  //   axiosInstance
  //     .get(`/workareas/${userSession.id}/review`)
  //     .then(res => setSubTasks(res.data));
  // }, [userSession.id]);

  const addMenuPoint = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value, id } = target;
    const newMenuOption = handleMenu(value as MenuRole, +id, menuPoints);
    setMenuPoints(newMenuOption);
  };
  const addSubMenuPoint = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = target;
    const [menuId, subMenuId] = name.split('-');
    const findMenuPoint = menuPoints.find(menu => menu.menuId === +menuId);
    const newMenuOption = handleMenu(
      value as MenuRole,
      +subMenuId,
      findMenuPoint?.menu ?? []
    );

    const newMenuPoints = menuPoints.map(menu =>
      menu.menuId === +menuId ? { ...menu, menu: newMenuOption } : menu
    );

    setMenuPoints(newMenuPoints);
  };

  const handleMenu = (typeRol: MenuRole | '', id: number, menus: Option[]) => {
    if (!typeRol) {
      const newMenuPoints = menus.filter(menuPoint => menuPoint.menuId !== +id);
      return newMenuPoints;
    }

    const menu: Option = {
      menuId: +id,
      typeRol,
    };
    const existMenu = menus.some(menu => menu.menuId === +id);

    if (existMenu) {
      const newMenuPoints = menus.map(menuPoint =>
        menuPoint.menuId === +id ? menu : menuPoint
      );
      return newMenuPoints;
    } else {
      return [...menus, menu];
    }
  };
  const handeChangeRol = ({ target }: FocusEvent<HTMLInputElement>) => {
    setRole(target.value);
  };

  const createRol = () => {
    const body = {
      name: role,
      menuPoints,
    };
    axiosInstance.post('/role', body).then(res => {
      console.log(res.data);
    });
  };
  return (
    <div className="notify container">
      <div className="notify-head">
        <div>
          <h1 className="main-title">
            LISTA DE <span className="main-title-span">NOTIFICACIONES </span>
          </h1>
        </div>
      </div>
      <div style={{ marginBottom: 50 }}>
        <Input
          label="Rol"
          onBlur={handeChangeRol}
          type="text"
          defaultValue={role}
        />
      </div>

      <div style={{ display: 'flex', gap: 20 }}>
        {MENU_POINTS.map(menu => (
          <div style={{ position: 'relative' }}>
            <div
              style={{
                display: 'flex',
                position: 'absolute',
                gap: 20,
                top: -20,
              }}
            >
              {menu.access.map(option => (
                <label style={{ fontSize: 10 }}>
                  <input
                    type="radio"
                    value={option}
                    name={String(menu.id)}
                    id={String(menu.id)}
                    onChange={addMenuPoint}
                  />
                  {option}
                </label>
              ))}
              <label style={{ fontSize: 10 }}>
                <input
                  type="radio"
                  value={''}
                  defaultChecked
                  name={String(menu.id)}
                  id={String(menu.id)}
                  onChange={addMenuPoint}
                />
                No
              </label>
            </div>
            <h1>{menu.title}</h1>
            {menu.menu?.map(subMenu => (
              <div style={{ display: 'flex', gap: 20 }}>
                <h4>{subMenu.title}</h4>
                {subMenu.access?.map(option => (
                  <label style={{ fontSize: 10 }}>
                    <input
                      type="radio"
                      value={option}
                      name={`${menu.id}-${subMenu.id}`}
                      onChange={addSubMenuPoint}
                    />
                    {option}
                  </label>
                ))}
                <label style={{ fontSize: 10 }}>
                  <input
                    type="radio"
                    value={''}
                    defaultChecked
                    name={`${menu.id}-${subMenu.id}`}
                    onChange={addSubMenuPoint}
                  />
                  No
                </label>
              </div>
            ))}
          </div>
        ))}
      </div>

      <Button onClick={createRol} text="crear rol" />
      {/* <div className="notify-card-container">
        {subTasks?.map(subtask => (
          <SubtaskDetail key={subtask.id} subtask={subtask} />
        ))}
      </div> */}

      <div></div>
    </div>
  );
};
