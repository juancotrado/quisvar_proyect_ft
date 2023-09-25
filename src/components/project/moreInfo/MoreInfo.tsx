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
        <div className="moreInfo-currency moreInfo-currency-width">
          <span className="moreInfo-currency-money">{data.total}</span>
          {data.projectName && (
            <span className="moreInfo-currency-info">Tareas</span>
          )}
        </div>
        <div className="moreInfo-currency moreInfo-currency-width">
          <span className="moreInfo-currency-money">{data.days}</span>
          {data.projectName && (
            <span className="moreInfo-currency-info">
              Dia{data.days !== 1 && 's'}
            </span>
          )}
        </div>
      </div>
      <div className="moreInfo-details-contain">
        <div
          className="moreInfo-detail"
          onClick={handleArchiver}
          title={'Comprimir'}
        >
          <figure className="moreInfo-detail-icon">
            <img src="/svg/zip-normal.svg" alt="W3Schools" />
          </figure>
          {data.projectName && (
            <span className="moreInfo-detail-info">Comprimir</span>
          )}
        </div>
        <div className="moreInfo-detail" title={'Comprimir PDFs'}>
          <figure className="moreInfo-detail-icon">
            <img src="/svg/zip-pdf.svg" alt="W3Schools" />
          </figure>
          {data.projectName && (
            <span className="moreInfo-detail-info">
              Comprimir <br /> PDF
            </span>
          )}
        </div>
        <div className="moreInfo-detail" title={'Comprimir Editables'}>
          <figure className="moreInfo-detail-icon">
            <img src="/svg/zip-edit.svg" alt="W3Schools" />
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
