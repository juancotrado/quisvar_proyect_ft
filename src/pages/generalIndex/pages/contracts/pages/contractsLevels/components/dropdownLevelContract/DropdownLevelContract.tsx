import { ContractIndexData } from '../../../../../../../../types';
import './dropdownLevelContract.css';
import colors from '../../../../../../../../utils/json/colorsContract.json';
import {
  URL,
  axiosInstance,
} from '../../../../../../../../services/axiosInstance';
import { ChangeEvent } from 'react';
import { UploadFileInput } from '../../../../../../../../components';
import { ListProfessionals } from '../../views/listProfessionals';
import { PiFilePdfFill } from 'react-icons/pi';
interface DropdownLevelContractProps {
  level: ContractIndexData;
  idContract: number;
  editFileContractIndex: (id: string, value: 'yes' | 'no') => void;
  handleReportPdf: () => void;
}

export const DropdownLevelContract = ({
  level,
  idContract,
  editFileContractIndex,
  handleReportPdf,
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
  const handleDeleteFile = (subLevel: ContractIndexData) => {
    axiosInstance
      .delete(
        `/contract/${idContract}/files?filename=${subLevel.id} ${subLevel.name}.pdf`
      )
      .then(() => editFileContractIndex(subLevel.id, 'no'));
  };

  const noHaveFile = (subLevel: ContractIndexData) =>
    (!subLevel.hasFile || subLevel.hasFile === 'no') && subLevel.id !== '2.3';
  return (
    <div
      className={`${!firstLevel && 'DropdownLevelContract-dropdown-content'}`}
    >
      <ul className={`${!firstLevel && 'DropdownLevelContract-dropdown-sub'}`}>
        {level.hasFile !== undefined ? (
          <>
            {level.id === '2.4' ? (
              <ListProfessionals idContract={idContract} />
            ) : (
              <div className="DropdownLevelContract-upload-file">
                {level.hasFile === 'no' && level.id !== '2.3' && (
                  <UploadFileInput
                    name="Cargar documento"
                    subName="O arrastre y suelte el archivo aquí"
                    accept="application/pdf"
                    onChange={handleUploadFile}
                  />
                )}
              </div>
            )}
          </>
        ) : (
          level?.nextLevel?.map(subLevel => (
            <li key={subLevel.id}>
              <div
                className={`DropdownLevelContract-sub-list-item`}
                style={style}
              >
                <div className={`DropdownLevelContract-section `}>
                  <div className="DropdownLevelContract-section-names">
                    <img
                      src="/svg/down.svg"
                      className={`DropdownLevelContract-dropdown-arrow ${
                        !noHaveFile(subLevel) && 'DropdownLevelContract-hide'
                      }`}
                    />
                    {noHaveFile(subLevel) && (
                      <input
                        type="checkbox"
                        className="DropdownLevelContract-dropdown-check"
                        defaultChecked={false}
                      />
                    )}
                    <h4 className={`DropdownLevelContract-sub-list-name`}>
                      <span className="DropdownLevelContract-sub-list-span">
                        {subLevel.id}
                      </span>
                      {subLevel.name}
                    </h4>
                  </div>
                  {subLevel.id === '2.3' && (
                    <div className="DropdownLevelContract-file-container">
                      <a
                        className="DropdownLevelContract-file-container-anchor"
                        onClick={handleReportPdf}
                      >
                        {/* <figure className="DropdownLevelContract-figure">
                          <img src="/svg/pdf-red.svg" alt="W3Schools" />
                        </figure> */}
                        <PiFilePdfFill color="red" size={20} />
                        <span className="DropdownLevelContract-file-container-name">
                          Ver pdf
                        </span>
                      </a>
                    </div>
                  )}
                  {subLevel.hasFile === 'yes' && subLevel.id !== '2.3' && (
                    <div className="DropdownLevelContract-file-container">
                      <a
                        href={`${URL}/index/contracts/${idContract}/${subLevel.id} ${subLevel.name}.pdf`}
                        target="_blank"
                        className="DropdownLevelContract-file-container-anchor"
                      >
                        <figure className="DropdownLevelContract-figure">
                          <img src="/svg/pdf-red.svg" alt="W3Schools" />
                        </figure>
                        <span className="DropdownLevelContract-file-container-name">
                          Ver pdf
                        </span>
                      </a>
                      <figure
                        className="DropdownLevelContract-figure DropdownLevelContract-figure-trash"
                        onClick={() => handleDeleteFile(subLevel)}
                      >
                        <img src="/svg/trash-gray.svg" alt="W3Schools" />
                      </figure>
                    </div>
                  )}
                </div>
              </div>

              <DropdownLevelContract
                level={subLevel}
                idContract={idContract}
                editFileContractIndex={editFileContractIndex}
                handleReportPdf={handleReportPdf}
              />
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default DropdownLevelContract;
