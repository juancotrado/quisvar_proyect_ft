import { PDFDownloadLink } from '@react-pdf/renderer';
import { GeneralFile, RoleForm } from '../../../../../../types';
import './carRegisterSwornDeclaration.css';
import { SwornDeclarationPdf } from '../../pdfGenerator';
import { deleteExtension } from '../../../../../../utils';
import { useForm } from 'react-hook-form';
import { SwornDeclaration, UserForm } from '../../models';
import { Button } from '../../../../../../components';

interface CarRegisterSwornDeclarationProps {
  generalFiles: GeneralFile[] | null;
  userData: UserForm;
  roles: RoleForm[];
}
const CarRegisterSwornDeclaration = ({
  generalFiles,
  userData,
  roles,
}: CarRegisterSwornDeclarationProps) => {
  const { register, watch } = useForm<SwornDeclaration>();
  const roleName = () => {
    const selectRole = roles?.find(role => role.id === userData.roleId);
    if (!selectRole) return '';
    return selectRole.name;
  };
  const swornDeclarationData = {
    ...watch(),
    ...userData,
    roleName: roleName(),
  };
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
        {...register('declarationDate', {
          valueAsDate: true,
        })}
        type="date"
        placeholder="Fecha"
        className="generalData-edit-info-input"
      />
      {watch('typeDeclaration') === 'technical' && (
        <>
          <h4 className="card-register-sworn-declaration-subtitle">
            Número de meses
          </h4>
          <input
            type="number"
            {...register('declarationMonths')}
            name="declarationMonths"
            placeholder="4"
            className="generalData-edit-info-input"
          />
        </>
      )}
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
        fileName={`Declaracion-Jurada1.pdf`}
      >
        <Button icon="preview-pdf" text="Declaración jurada" styleButton={2} />
      </PDFDownloadLink>
    </div>
  );
};

export default CarRegisterSwornDeclaration;
