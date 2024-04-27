import { useEffect, useState } from 'react';
import { AdvancedSelectCrud } from '../../../../../../components';
import {
  AreaSpecialty,
  AreaSpecialtyName,
  Experience,
} from '../../../../../../types';
import { SubmitHandler, useForm } from 'react-hook-form';
import { axiosInstance } from '../../../../../../services/axiosInstance';
import { useParams } from 'react-router-dom';
import {
  // validateCorrectTyping,
  // validateWhiteSpace,
  sumAllExperience,
} from '../../../../../../utils';
import { ExperienceTable } from '..';
import { CardEditSpecialties } from '../../views/cardEditSpecialties';
import { isOpenCardOffice$ } from '../../../../../../services/sharingSubject';
// import { OfficeSelect } from '../../../../../procedure/models';
import { SpecialtiesSelect } from '../../../../../userCenter/pages/users/models';

interface ExperienceProps {
  experiences?: Experience[];
  handleAddExperience: (e: boolean, v: number) => void;
  handleEditExperience: (e: boolean, v: number, d: AreaSpecialty) => void;
  onSave: () => void;
}
export const ExperienceInformation = ({
  experiences,
  handleAddExperience,
  handleEditExperience,
  onSave,
}: ExperienceProps) => {
  const [experienceSelected, setExperienceSelected] = useState<number | null>(
    null
  );
  const [specialties, setProfessions] = useState<SpecialtiesSelect[] | null>(
    null
  );
  const [openAddSpeciality, setOpenAddSpeciality] = useState<boolean>(false);
  const { infoId } = useParams();
  const {
    handleSubmit,
    reset,
    control,
    // formState: { errors },
  } = useForm<AreaSpecialtyName>();
  useEffect(() => {
    return () => {
      setExperienceSelected(null);
    };
  }, [experiences]);

  const onSubmitData: SubmitHandler<AreaSpecialtyName> = async body => {
    const data = {
      specialtyName: body.specialtyName.label,
      specialistId: Number(infoId),
    };
    axiosInstance.post('/areaSpecialtyList', data).then(() => {
      setOpenAddSpeciality(false);
      reset({});
      onSave?.();
    });
  };

  const toggleDetailExperience = (experienceID: number) => {
    if (experienceSelected === experienceID) {
      setExperienceSelected(null);
    } else {
      setExperienceSelected(experienceID);
    }
  };
  const handleHideForm = () => {
    setOpenAddSpeciality(false);
    reset({});
  };
  const handleCreateOffice = (label: string) => {
    const body = {
      name: label,
    };
    axiosInstance.post('/listSpecialties', body).then(() => {
      getSpecialties();
    });
  };
  const handleDelete = (id: number) => {
    axiosInstance.delete(`/areaSpecialty/${id}`).then(() => onSave?.());
  };

  useEffect(() => {
    getSpecialties();
  }, []);

  const getSpecialties = () => {
    axiosInstance
      .get(`/listSpecialties`)
      .then(res => {
        setProfessions(res.data);
      })
      .catch(error => {
        console.error('Error fetching professions:', error);
      });
  };
  const handleEditSS = ({ label, id }: SpecialtiesSelect) => {
    isOpenCardOffice$.setSubject = {
      isOpen: true,
      data: {
        id,
        name: label,
      },
    };
  };

  return (
    <>
      <span className="specialist-info-title">Especialidades</span>
      <div className="specialist-more-info">
        {experiences &&
          experiences.map((experience, idx) => {
            const res = sumAllExperience(experience.areaSpecialtyName);
            return (
              <div className="smi-container" key={experience.specialtyName}>
                <div
                  className={`smi-items ${
                    experienceSelected !== idx
                      ? 'smi-unselected'
                      : 'smi-selected'
                  }`}
                  onClick={() => toggleDetailExperience(idx)}
                >
                  <div className="smi-specialty-name">
                    <h3>Especialidad: </h3>
                    <h4>{experience.specialtyName}</h4>
                  </div>
                  <div className="smi-specialty-name">
                    <h3>Años de experiencia: </h3>
                    <h4>{`${res.totalYears} año(s) y ${res.totalMonths} mes(es)`}</h4>
                  </div>
                  <img src="/svg/down.svg" alt="" style={{ width: '20px' }} />
                </div>
                {experienceSelected === idx && (
                  <ExperienceTable
                    datos={experience.areaSpecialtyName}
                    id={experience.id}
                    handleFuntion={handleAddExperience}
                    handleEdit={handleEditExperience}
                    handleDelete={handleDelete}
                  />
                )}
              </div>
            );
          })}
        <span className="smi-add-specialty">
          {!openAddSpeciality ? (
            <div
              onClick={() => setOpenAddSpeciality(true)}
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <img src="/svg/plus.svg" alt="" style={{ width: '12px' }} />
              <h3>Añadir especialidad</h3>
            </div>
          ) : (
            specialties && (
              <form
                onSubmit={handleSubmit(onSubmitData)}
                className="projectAddLevel-form"
              >
                <AdvancedSelectCrud
                  control={control}
                  options={specialties}
                  name="specialtyName"
                  onCreateOption={handleCreateOffice}
                  onEditOption={handleEditSS}
                  urlDelete={'/listSpecialties'}
                  onSave={getSpecialties}
                />
                <figure
                  className="projectAddLevel-figure"
                  onClick={handleSubmit(onSubmitData)}
                >
                  <img src="/svg/icon_save.svg" alt="W3Schools" />
                </figure>
                <figure
                  className="projectAddLevel-figure"
                  onClick={handleHideForm}
                >
                  <img src="/svg/icon_close.svg" alt="W3Schools" />
                </figure>
              </form>
            )
          )}
        </span>
      </div>
      <CardEditSpecialties onSave={getSpecialties} />
    </>
  );
};

export default ExperienceInformation;
