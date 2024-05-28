import { useMemo, useState } from 'react';
import { AdvancedSelect, IconAction } from '../../../../../../../../components';
import { ContractSpecialties } from '../../../../models/type.contracts';
import './listProfessionalItem.css';
import { SingleValue } from 'react-select';
import { axiosInstance } from '../../../../../../../../services/axiosInstance';
import { Specialists } from '../../../../../../../../types';
import {
  useAddSpecialistsMutation,
  useDeleteSpecialtiesMutation,
} from '../../hooks';

interface ListProfessionalItemProps {
  contractSpecialty: ContractSpecialties;
  onSave?: () => void;
}

const ListProfessionalItem = ({
  contractSpecialty,
  onSave,
}: ListProfessionalItemProps) => {
  console.log('contractSpecialty', contractSpecialty);
  const {
    listSpecialties,
    specialists,
    id: contractSpecialtiesId,
    contratcId,
  } = contractSpecialty;

  const addSpecialistsMutation = useAddSpecialistsMutation();
  const deleteSpecialtiesMutation = useDeleteSpecialtiesMutation();
  const [isEdit, setIsEdit] = useState(false);
  const handleEdit = () => setIsEdit(!isEdit);
  const handleSelectOption = async (option: SingleValue<Specialists>) => {
    if (!option) return;
    setIsEdit(false);
    const data = { ...option, contratcId, contractSpecialtiesId };
    addSpecialistsMutation.mutate(data);
  };

  const handleDeleteSpecialty = async () =>
    deleteSpecialtiesMutation.mutate({ contractSpecialtiesId, contratcId });

  return (
    <div className="listProfessionalItem">
      <div className="listProfessionalItem-main">
        <IconAction icon="user-check" position="none" />

        <span className="listProfessionalItem-label">
          {listSpecialties.name}
        </span>
        {specialists && !isEdit ? (
          <span className="listProfessionalItem-label-specialists">
            : {specialists.firstName} {specialists.lastName}
          </span>
        ) : (
          <div
            style={{
              width: '15rem',
            }}
          >
            <AdvancedSelect
              options={listSpecialties.users}
              menuPosition="fixed"
              onChange={handleSelectOption}
              defaultValue={
                specialists
                  ? listSpecialties.users.find(
                      user => user.id === specialists.id
                    )
                  : undefined
              }
            />
          </div>
        )}
        {specialists && (
          <IconAction
            icon={!isEdit ? 'pencil' : 'close'}
            size={0.8}
            position="none"
            onClick={handleEdit}
          />
        )}
      </div>
      <div className="listProfessionalItem-right-actions">
        <IconAction
          icon="pdf-red"
          position="none"
          classNameText="listProfessionalItem-text-icon"
          text="Declaracio jurada"
        />
        <IconAction
          icon="trash-gray"
          position="none"
          onClick={handleDeleteSpecialty}
        />
      </div>
    </div>
  );
};

export default ListProfessionalItem;
