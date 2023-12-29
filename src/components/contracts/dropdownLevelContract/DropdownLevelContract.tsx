import { ContractIndexData } from '../../../types/types';
import './dropdownLevelContract.css';
import colors from '../../../utils/json/colorsContract.json';
import UploadFileInput from '../../shared/uploadFileInput/UploadFileInput';
import FileNameContainer from '../../shared/fileNameContainer/FileNameContainer';
import { URL, axiosInstance } from '../../../services/axiosInstance';
import { ChangeEvent } from 'react';

interface DropdownLevelContractProps {
  level: ContractIndexData;
  idContract: number;
  editFileContractIndex: (id: string, value: 'yes' | 'no') => void;
}

const DropdownLevelContract = ({
  level,
  idContract,
  editFileContractIndex,
}: DropdownLevelContractProps) => {
  const firstLevel = level.nivel === 0;
  const style = {
    backgroundColor: colors[level.nivel],
  };

  const handleUploadFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const headers = {
        'Content-type': 'multipart/form-data',
      };
      const formdata = new FormData();
      formdata.append('fileContract', file);
      formdata.append('fileName', `${level.id} ${level.name}`);
      const URL = `/contract/${idContract}/files`;
      axiosInstance
        .post(URL, formdata, { headers })
        .then(() => editFileContractIndex(level.id, 'yes'));
    }
  };
  const handleDeleteFile = () => {
    axiosInstance
      .delete(
        `/contract/${idContract}/files?filename=${level.id} ${level.name}.pdf`
      )
      .then(() => editFileContractIndex(level.id, 'no'));
  };
  return (
    <div
      className={`${!firstLevel && 'DropdownLevelContract-dropdown-content'}`}
    >
      <ul className={`${!firstLevel && 'DropdownLevelContract-dropdown-sub'}`}>
        {level.hasFile ? (
          <div className="DropdownLevelContract-upload-file">
            {level.hasFile === 'no' ? (
              <UploadFileInput
                name="Cargar documento"
                subName="O arrastre y suelte el archivo aquí"
                accept="application/pdf"
                onChange={handleUploadFile}
              />
            ) : (
              <FileNameContainer
                fileName={'Documento'}
                icon="pdf-icon"
                Url={`${URL}/index/contracts/${idContract}/${level.id} ${level.name}.pdf`}
                onDelete={handleDeleteFile}
              />
            )}
          </div>
        ) : (
          level?.nextLevel?.map(subLevel => (
            <li key={subLevel.id}>
              <div
                className={`DropdownLevelContract-sub-list-item`}
                style={style}
              >
                <div className={`DropdownLevelContract-section `}>
                  <img
                    src="/svg/down.svg"
                    className={`DropdownLevelContract-dropdown-arrow`}
                  />
                  <input
                    type="checkbox"
                    className="DropdownLevelContract-dropdown-check"
                    defaultChecked={false}
                  />
                  <h4 className={`DropdownLevelContract-sub-list-name`}>
                    <span className="DropdownLevelContract-sub-list-span">
                      {subLevel.id}
                    </span>
                    {subLevel.name}
                  </h4>
                </div>
              </div>

              <DropdownLevelContract
                level={subLevel}
                idContract={idContract}
                editFileContractIndex={editFileContractIndex}
              />
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default DropdownLevelContract;
