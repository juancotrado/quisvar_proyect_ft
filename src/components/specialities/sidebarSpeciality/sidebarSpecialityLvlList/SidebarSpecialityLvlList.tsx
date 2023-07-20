import './sidebarSpecialityLvlList.css';

type NewTypeTask = 'sector' | 'speciality';
interface SidebarSpecialityLvlListProps {
  data: any;
  type: NewTypeTask;
}
const SidebarSpecialityLvlList = ({
  data,
  type,
}: SidebarSpecialityLvlListProps) => {
  const isFirstLevel = type === 'sector';

  return (
    <div
      className={`SidebarSpecialityLvlList-sub-list-item ${
        isFirstLevel && 'not-border-left'
      }`}
    >
      <div className="SidebarSpecialityLvlList-section">
        {isFirstLevel && (
          <img
            src="/svg/reports.svg"
            alt="reportes"
            className="SidebarSpecialityLvlList-icon"
          />
        )}
        <span
          className={`SidebarSpecialityLvlList-sub-list-span  ${
            isFirstLevel && 'not-margin-left'
          }   `}
        >
          {data.name}
        </span>
        <img
          src="/svg/down.svg"
          className="SidebarSpecialityLvlList-dropdown-arrow"
        />
        {
          <input
            type="checkbox"
            className="SidebarSpecialityLvlList-dropdown-check"
          />
        }
      </div>
    </div>
  );
};

export default SidebarSpecialityLvlList;
