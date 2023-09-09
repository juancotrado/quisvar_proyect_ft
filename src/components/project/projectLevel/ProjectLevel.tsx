import { Level } from '../../../types/types';
import './projectLevel.css';
interface ProjectLevelProps {
  data: Level;
}

const ProjectLevel = ({ data }: ProjectLevelProps) => {
  const { details } = data;
  return (
    <div className={`projectLevel-sub-list-item`}>
      <div className={`projectLevel-section `}>
        <img src="/svg/down.svg" className="projectLevel-dropdown-arrow" />
        <input
          type="checkbox"
          className="projectLevel-dropdown-check"
          defaultChecked={false}
        />
        <div className="projectLevel-contain">
          <h4 className={`projectLevel-sub-list-name`}>
            <span className="projectLevel-sub-list-span">{data.item} </span>{' '}
            {data.name}
          </h4>
          <div className="projectLevel-contain-right">
            <div className="projectLevel-currency-contain">
              <div className="projectLevel-currency">
                <span className="projecLevel-currency-money">
                  S/.{data.price}
                </span>
                <span className="projecLevel-currency-info">Saldo</span>
              </div>
              <div className="projectLevel-currency">
                <span className="projecLevel-currency-money money--red">
                  -/S.{data.price}
                </span>
                <span className="projecLevel-currency-info">Saldo</span>
              </div>
              <div className="projectLevel-currency">
                <span className="projecLevel-currency-money">
                  S/.{data.price}
                </span>
                <span className="projecLevel-currency-info">Saldo</span>
              </div>
            </div>
            <div className="projectLevel-details-contain">
              <div className="projectLevel-detail">
                <div className="projectLevel-detail-circle color-unresolver">
                  <span className="projectLevel-detail-circle-text">
                    {details.UNRESOLVED}
                  </span>
                </div>
                <span className="projectLevel-detail-info">
                  Sin <br />
                  Asignar
                </span>
              </div>
              <div className="projectLevel-detail">
                <div className="projectLevel-detail-circle color-pending ">
                  <span className="projectLevel-detail-circle-text">
                    {details.PROCESS}
                  </span>
                </div>
                <span className="projectLevel-detail-info">Asignado</span>
              </div>
              <div className="projectLevel-detail">
                <div className="projectLevel-detail-circle color-process">
                  <span className="projectLevel-detail-circle-text">
                    {details.INREVIEW}
                  </span>
                </div>
                <span className="projectLevel-detail-info">
                  En <br /> revision
                </span>
              </div>
              <div className="projectLevel-detail">
                <div className="projectLevel-detail-circle color-correct">
                  <span className="projectLevel-detail-circle-text">
                    {details.DENIED}
                  </span>
                </div>
                <span className="projectLevel-detail-info">
                  En <br /> Correción
                </span>
              </div>
              <div className="projectLevel-detail">
                <div className="projectLevel-detail-circle color-done">
                  <span className="projectLevel-detail-circle-text">
                    {details.DONE}
                  </span>
                </div>
                <span className="projectLevel-detail-info">Hechos</span>
              </div>
              <div className="projectLevel-detail">
                <div className="projectLevel-detail-circle color-liquidation">
                  <span className="projectLevel-detail-circle-text">
                    {details.LIQUIDATION}
                  </span>
                </div>
                <span className="projectLevel-detail-info">Liquidados</span>
              </div>
            </div>
            <div className="projectLevel-details-contain">
              <div className="projectLevel-detail">
                <figure className="projectLevel-detail-icon">
                  <img src="/svg/file-download.svg" alt="W3Schools" />
                </figure>
                <span className="projectLevel-detail-info">Compirmir</span>
              </div>
              <div className="projectLevel-detail">
                <figure className="projectLevel-detail-icon">
                  <img src="/svg/file-download.svg" alt="W3Schools" />
                </figure>
                <span className="projectLevel-detail-info">
                  Comprimir <br /> PDS
                </span>
              </div>
              <div className="projectLevel-detail">
                <figure className="projectLevel-detail-icon">
                  <img src="/svg/file-download.svg" alt="W3Schools" />
                </figure>
                <span className="projectLevel-detail-info">
                  Comprimir <br /> Editables
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectLevel;
