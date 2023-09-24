import useArchiver from '../../../hooks/useArchiver';
import { Level } from '../../../types/types';
import './moreInfo.css';
interface MoreInfoProps {
  data: Level;
}
const MoreInfo = ({ data }: MoreInfoProps) => {
  const type = data.projectName ? 'stages' : 'levels';
  const { handleArchiver } = useArchiver(data.id, type);

  return (
    <>
      <div className="moreInfo-currency-contain">
        <div className="moreInfo-currency">
          <span className="moreInfo-currency-money">
            S/.{data.balance.toFixed(2)}
          </span>
          {data.projectName && (
            <span className="moreInfo-currency-info">Saldo</span>
          )}
        </div>
        <div className="moreInfo-currency">
          <span className="moreInfo-currency-money money--red">
            -/S.{data.spending.toFixed(2)}
          </span>
          {data.projectName && (
            <span className="moreInfo-currency-info">Gasto</span>
          )}
        </div>
        <div className="moreInfo-currency">
          <span className="moreInfo-currency-money">
            S/.{data.price.toFixed(2)}
          </span>
          {data.projectName && (
            <span className="moreInfo-currency-info">Total</span>
          )}
        </div>
        <div className="moreInfo-currency">
          <span className="moreInfo-currency-money">
            {data?.percentage?.toFixed(2)}%
          </span>
          {data.projectName && (
            <span className="moreInfo-currency-info">Porcentaje</span>
          )}
        </div>
        <div className="moreInfo-currency">
          <span className="moreInfo-currency-money">{data.total}</span>
          {data.projectName && (
            <span className="moreInfo-currency-info">Tareas</span>
          )}
        </div>
        <div className="moreInfo-currency">
          <span className="moreInfo-currency-money">{data.days}</span>
          {data.projectName && (
            <span className="moreInfo-currency-info">
              Dia{data.days !== 1 && 's'}
            </span>
          )}
        </div>
      </div>
      {/* <div className="moreInfo-details-contain">
        <div className="moreInfo-detail">
          <div className="moreInfo-detail-circle color-unresolver">
            <span className="moreInfo-detail-circle-text">
              {details.UNRESOLVED}
            </span>
          </div>
          <span className="moreInfo-detail-info">
            Sin <br />
            Asignar
          </span>
        </div>
        <div className="moreInfo-detail">
          <div className="moreInfo-detail-circle color-pending ">
            <span className="moreInfo-detail-circle-text">
              {details.PROCESS}
            </span>
          </div>
          <span className="moreInfo-detail-info">Asignado</span>
        </div>
        <div className="moreInfo-detail">
          <div className="moreInfo-detail-circle color-process">
            <span className="moreInfo-detail-circle-text">
              {details.INREVIEW}
            </span>
          </div>
          <span className="moreInfo-detail-info">
            En <br /> revision
          </span>
        </div>
        <div className="moreInfo-detail">
          <div className="moreInfo-detail-circle color-correct">
            <span className="moreInfo-detail-circle-text">
              {details.DENIED}
            </span>
          </div>
          <span className="moreInfo-detail-info">
            En <br /> Correción
          </span>
        </div>
        <div className="moreInfo-detail">
          <div className="moreInfo-detail-circle color-done">
            <span className="moreInfo-detail-circle-text">{details.DONE}</span>
          </div>
          <span className="moreInfo-detail-info">Hechos</span>
        </div>
        <div className="moreInfo-detail">
          <div className="moreInfo-detail-circle color-liquidation">
            <span className="moreInfo-detail-circle-text">
              {details.LIQUIDATION}
            </span>
          </div>
          <span className="moreInfo-detail-info">Liquidados</span>
        </div>x
      </div> */}
      <div className="moreInfo-details-contain">
        <div className="moreInfo-detail" onClick={handleArchiver}>
          <figure className="moreInfo-detail-icon">
            <img src="/svg/file-download.svg" alt="W3Schools" />
          </figure>
          {data.projectName && (
            <span className="moreInfo-detail-info">Comprimir</span>
          )}
        </div>
        <div className="moreInfo-detail">
          <figure className="moreInfo-detail-icon">
            <img src="/svg/file-download.svg" alt="W3Schools" />
          </figure>
          {data.projectName && (
            <span className="moreInfo-detail-info">
              Comprimir <br /> PDS
            </span>
          )}
        </div>
        <div className="moreInfo-detail">
          <figure className="moreInfo-detail-icon">
            <img src="/svg/file-download.svg" alt="W3Schools" />
          </figure>
          {data.projectName && (
            <span className="moreInfo-detail-info">
              Comprimir <br /> Editables
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default MoreInfo;
