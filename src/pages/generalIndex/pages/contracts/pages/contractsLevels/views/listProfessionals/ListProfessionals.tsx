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

interface ListProfessionalsProp {
  idContract: number;
}

const ListProfessionals = ({ idContract }: ListProfessionalsProp) => {
  const specialtiesSelectMutation = useSpecialtiesSelectMutation();
  const { listProfessionalQuery } = useListProfessionals(idContract);
  const { specialtiesSelectQuery } = useSpecialtiesSelect();

  const handleSelectOption = async (option: SingleValue<SpecialtiesSelect>) => {
    specialtiesSelectMutation.mutate({
      listSpecialtiesId: option?.id,
      contratcId: idContract,
    });
  };

  const handleSave = () => {
    listProfessionalQuery.refetch();
  };
  const handleReport = () => {
    //   if (!contracts) return;
    //   excelContractReport(contracts);
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
            onSave={handleSave}
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
