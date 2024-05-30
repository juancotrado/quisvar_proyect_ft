import { SingleValue } from 'react-select';
import {
  AdvancedSelect,
  IconAction,
  LoaderOnly,
} from '../../../../../../../../components';
import { SpecialtiesSelect } from '../../../../../../../userCenter/pages/users/models';
import {
  useListProfessionals,
  useSpecialtiesSelect,
  useSpecialtiesSelectMutation,
} from '../../hooks';
import './listProfessionals.css';
import { ListProfessionalItem } from '../../components';
import { excelProfessionalContract } from '../../../../generateExcel';
import { RootState } from '../../../../../../../../store';
import { useSelector } from 'react-redux';
import { Specialists } from '../../../../../../../../types';
import { isOpenViewPdf$ } from '../../../../../../../../services/sharingSubject';
import { SpecialistDeclarationPdf } from '../../../../../../../userCenter/pages/users/pdfGenerator/specialistDeclarationPdf';
import { URL } from '../../../../../../../../services/axiosInstance';

interface ListProfessionalsProp {
  idContract: number;
}

const ListProfessionals = ({ idContract }: ListProfessionalsProp) => {
  const specialtiesSelectMutation = useSpecialtiesSelectMutation();
  const { listProfessionalQuery } = useListProfessionals(idContract);
  const { specialtiesSelectQuery } = useSpecialtiesSelect();
  const contract = useSelector((state: RootState) => state.contract);

  const handleSelectOption = async (option: SingleValue<SpecialtiesSelect>) => {
    specialtiesSelectMutation.mutate({
      listSpecialtiesId: option?.id,
      contratcId: idContract,
    });
  };

  const handleViewPdf = (specialists: Specialists, specialityName: string) => {
    if (!specialists || !contract) return;
    const { company, consortium } = contract;
    const srcImage = `${URL}/images/img/${
      company?.img
        ? `companies/${company?.img}`
        : `consortium/${consortium?.img}`
    }`;
    const newSpecialists = {
      ...specialists,
      speciality: specialityName,
      nameContract: contract.name,
      corporation: contract.company.name,
      projectName: contract.projectName,
      municipio: contract.municipality,
      cui: contract.cui,
      srcImage,
    };
    isOpenViewPdf$.setSubject = {
      fileNamePdf:
        'Declaración jurada - ' +
        specialists.firstName +
        ' ' +
        specialists.lastName,
      pdfComponentFunction: SpecialistDeclarationPdf({ data: newSpecialists }),
      isOpen: true,
    };
  };

  const handleReport = () => {
    const { data: contractSpecialities } = listProfessionalQuery;
    if (!contract || !contractSpecialities) return;
    excelProfessionalContract({
      contract,
      contractSpecialities,
    });
  };
  return (
    <div className="listProfessionals">
      {listProfessionalQuery.isFetching && (
        <div className="listProfessionals-loader">
          <LoaderOnly />
        </div>
      )}
      <div className="listProfessionals-header">
        <h3 className="listProfessionals-header-title">Especialistas</h3>
        <IconAction
          icon="excel-icon"
          text="Cuadro de profesionales"
          onClick={handleReport}
        />
      </div>
      <div className="listProfessionals-main">
        {listProfessionalQuery.data?.map(contractSpecialty => (
          <ListProfessionalItem
            key={contractSpecialty.id}
            contractSpecialty={contractSpecialty}
            handleViewPdf={handleViewPdf}
          />
        ))}
        {specialtiesSelectMutation.isPending && (
          <div
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <LoaderOnly />
          </div>
        )}
        <AdvancedSelect
          options={specialtiesSelectQuery.data}
          value={null}
          menuPosition="fixed"
          onChange={handleSelectOption}
          isLoading={
            specialtiesSelectQuery.isFetching ||
            specialtiesSelectMutation.isPending
          }
          placeholder={'Agregar especialidad'}
          isDisabled={specialtiesSelectMutation.isPending}
        />
      </div>
    </div>
  );
};

export default ListProfessionals;
