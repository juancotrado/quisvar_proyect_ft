import { PDFDownloadLink } from '@react-pdf/renderer';
import { GeneralFile, UserForm } from '../../../../../../types';
import './carRegisterSwornDeclaration.css';
import { SwornDeclarationPdf } from '../../pdfGenerator';
import { deleteExtension } from '../../../../../../utils';
import { useForm } from 'react-hook-form';
import { SwornDeclaration } from '../../models';

interface CarRegisterSwornDeclarationProps {
  generalFiles: GeneralFile[] | null;
  userData: UserForm;
}
const CarRegisterSwornDeclaration = ({
  generalFiles,
  userData,
}: CarRegisterSwornDeclarationProps) => {
  const { register, watch } = useForm<SwornDeclaration>();

  const swornDeclarationData = { ...watch(), ...userData };

  return (
    <div className="card-register-sworn-declaration">
      <h2 className="card-register-sworn-declaration-title">
        Generar declaración jurada
      </h2>
      <h4 className="card-register-sworn-declaration-subtitle">
        Selecctionar tipo
      </h4>
      <div className="card-register-radio-container">
        <div className="card-register-radio-input">
          <input
            type="radio"
            id="technical"
            value="technical"
            {...register('typeDeclaration')}
            name="typeDeclaration"
          />
          <label htmlFor="technical" className="card-register-radio-input-text">
            Técnico
          </label>
        </div>
        <div className="card-register-radio-input">
          <input
            type="radio"
            id="administrative"
            value="administrative"
            {...register('typeDeclaration')}
            name="typeDeclaration"
          />
          <label
            htmlFor="administrative"
            className="card-register-radio-input-text"
          >
            Administrativos
          </label>
        </div>
      </div>
      <h4 className="card-register-sworn-declaration-subtitle">Fecha</h4>
      <input
        type="text"
        {...register('declarationDate')}
        name="declarationDate"
        placeholder="03 de Enero del 2023"
      />
      <h4 className="card-register-sworn-declaration-subtitle">
        Seleccionar directivas
      </h4>
      <div>
        <div className="card-register-sworn-declaration-select">
          <input
            type="checkbox"
            className="card-register-dropdown-check"
            defaultChecked={false}
          />
          <h3>Directivas</h3>
          <img
            src="/svg/down.svg"
            className="card-register-sworn-declaration-arrow"
          />
        </div>
        <div className="card-register-sworn-declaration-dropdown-content">
          <ul className="card-register-sworn-declaration-dropdown-sub">
            {generalFiles?.map(generalFile => (
              <label
                key={generalFile.id}
                className="card-register-sworn-declaration-check-container"
              >
                <input
                  type="checkbox"
                  value={generalFile.name}
                  {...register('declarations', {
                    value: [],
                  })}
                />
                {deleteExtension(generalFile.name)}
              </label>
            ))}
          </ul>
        </div>
      </div>
      <PDFDownloadLink
        document={<SwornDeclarationPdf data={swornDeclarationData} />}
        fileName={`Declaracion-Jurada.pdf`}
        className="generateOrderService-preview-pdf"
      >
        <figure className="cardRegisteVoucher-figure">
          <img src={`/svg/preview-pdf.svg`} />
        </figure>
        Declaracion Jurada
      </PDFDownloadLink>
    </div>
  );
};

export default CarRegisterSwornDeclaration;
