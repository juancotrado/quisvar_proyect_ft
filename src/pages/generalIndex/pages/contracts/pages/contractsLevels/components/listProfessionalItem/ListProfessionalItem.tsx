import { useState } from 'react';
import { AdvancedSelect, IconAction } from '../../../../../../../../components';
import { ContractSpecialties } from '../../../../models/type.contracts';
import './listProfessionalItem.css';
import { SingleValue } from 'react-select';
import { Specialists } from '../../../../../../../../types';
import {
  useAddSpecialistsMutation,
  useDeleteSpecialtiesMutation,
} from '../../hooks';
import { isOpenViewPdf$ } from '../../../../../../../../services/sharingSubject';
import { SpecialistDeclarationPdf } from '../../../../../../../userCenter/pages/users/pdfGenerator/specialistDeclarationPdf';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../../../store';

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
  const contract = useSelector((state: RootState) => state.contract);

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

  const handleViewPdf = () => {
    if (!specialists || !contract) return;
    const newSpecialists = {
      ...specialists,
      speciality: listSpecialties.name,
      nameContract: contract.name,
      corporation: contract.company.name,
      projectName: contract.projectName,
      cui: contract.cui,
    };
    isOpenViewPdf$.setSubject = {
      fileNamePdf: specialists.firstName + ' ' + specialists.lastName,
      pdfComponentFunction: SpecialistDeclarationPdf({ data: newSpecialists }),
      isOpen: true,
    };
  };
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
          onClick={handleViewPdf}
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
