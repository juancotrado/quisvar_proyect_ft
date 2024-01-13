import { URL } from '../../../services/axiosInstance';
import { TypeFileUser } from '../../../types/types';
import ButtonDelete from '../../button/ButtonDelete';
import UploadFile from '../../shared/uploadFile/UploadFile';
import './uploadUserFile.css';

interface UploadUserFileProps {
  fileName: string | null | undefined;
  onSave?: () => void;
  userId: number | undefined;
  typeFile: TypeFileUser;
}
const UploadUserFile = ({
  fileName,
  onSave,
  userId,
  typeFile,
}: UploadUserFileProps) => {
  const formatedName = fileName?.split('$$');

  return (
    <div className="uploadUserFile">
      {!fileName ? (
        <UploadFile
          text="Subir Archivo"
          onSave={onSave}
          uploadName="fileUser"
          URL={`/files/uploadFileUser/${userId}?typeFile=${typeFile}`}
        />
      ) : (
        <div className="uploadUserFile-content">
          <a
            href={`${URL}/file-user/${typeFile}/${fileName}`}
            target="_blank"
            className="uploadUserFile-download"
          >
            <figure className="uploadUserFile-files-icon">
              <img src="/svg/pdf-icon.svg" alt="W3Schools" />
            </figure>
            <label className="uploadUserFile-name">
              {formatedName && formatedName[1]}
            </label>
          </a>
          <ButtonDelete
            icon="close"
            onSave={onSave}
            url={`/files/removeFileUser/${userId}/${fileName}?typeFile=${typeFile}`}
            className="uploadUserFile-files-btn-delete"
            passwordRequired
          />
        </div>
      )}
    </div>
  );
};

export default UploadUserFile;
