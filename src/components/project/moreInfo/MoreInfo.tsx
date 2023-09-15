import { Level } from '../../../types/types';
import './moreInfo.css';
interface MoreInfoProps {
  data: Level;
}
const MoreInfo = ({ data }: MoreInfoProps) => {
  const { details } = data;

  return (
    <>
      <div className="moreInfo-currency-contain">
        <div className="moreInfo-currency">
          <span className="moreInfo-currency-money">
            S/.{data.price.toFixed(2)}
          </span>
          <span className="moreInfo-currency-info">Saldo</span>
        </div>
        <div className="moreInfo-currency">
          <span className="moreInfo-currency-money money--red">
            -/S.{data.price.toFixed(2)}
          </span>
          <span className="moreInfo-currency-info">Gasto</span>
        </div>
        <div className="moreInfo-currency">
          <span className="moreInfo-currency-money">
            S/.{data.price.toFixed(2)}
          </span>
          <span className="moreInfo-currency-info">Total</span>
        </div>
      </div>
      <div className="moreInfo-details-contain">
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
        </div>
      </div>
      <div className="moreInfo-details-contain">
        <div className="moreInfo-detail">
          <figure className="moreInfo-detail-icon">
            <img src="/svg/file-download.svg" alt="W3Schools" />
          </figure>
          <span className="moreInfo-detail-info">Comprimir</span>
        </div>
        <div className="moreInfo-detail">
          <figure className="moreInfo-detail-icon">
            <img src="/svg/file-download.svg" alt="W3Schools" />
          </figure>
          <span className="moreInfo-detail-info">
            Comprimir <br /> PDS
          </span>
        </div>
        <div className="moreInfo-detail">
          <figure className="moreInfo-detail-icon">
            <img src="/svg/file-download.svg" alt="W3Schools" />
          </figure>
          <span className="moreInfo-detail-info">
            Comprimir <br /> Editables
          </span>
        </div>
      </div>
    </>
  );
};

export default MoreInfo;
