import { Button, Input } from '../../../../components';
import './groupDaily.css';
export const GroupDaily = () => {
  return (
    <div className="gd-content">
      <div className="gd-header">
        <span className="attendance-date">
          <img
            src="/svg/calendary-icon.svg"
            alt=""
            className="attendance-icon"
          />
          <Input
            type="date"
            // onChange={getDate}
            classNameMain="attendace-date-filter"
            // max={_date(today)}
            // defaultValue={_date(today)}
          />
        </span>
        <Button
          // onClick={addCall}
          className="attendance-add-btn"
          // icon="plus"
          text="Guardar"
        />
      </div>
      <div className="gd-body"></div>
    </div>
  );
};

export default GroupDaily;
