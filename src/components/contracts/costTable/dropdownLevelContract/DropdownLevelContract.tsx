import { ContractIndexData } from '../../../../types/types';
import './dropdownLevelContract.css';
import colors from '../../../../utils/json/colorsContract.json';
import UploadFileInput from '../../../shared/uploadFileInput/UploadFileInput';
import FileNameContainer from '../../../shared/fileNameContainer/FileNameContainer';

interface DropdownLevelContractProps {
  level: ContractIndexData;
  editFileContractIndex: (id: string, value: 'yes' | 'no') => void;
}

const DropdownLevelContract = ({
  level,
  editFileContractIndex,
}: DropdownLevelContractProps) => {
  const firstLevel = level.nivel === 0;
  const style = {
    backgroundColor: colors[level.nivel],
  };
  const handleUploadFile = () => editFileContractIndex(level.id, 'yes');
  const handleDeleteFile = () => editFileContractIndex(level.id, 'no');
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
                onChange={handleUploadFile}
                accept="image/*"
                multiple
              />
            ) : (
              <FileNameContainer
                fileName={'prueba'}
                icon="icon-xml"
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
