import { URL } from '../../../services/axiosInstance';
import { TypeFileUser } from '../../../types/types';
import ButtonDelete from '../../shared/button/ButtonDelete';
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
        <div className="col-span">
          <figure className="uploadUserFile-files-icon">
            <a
              href={`${URL}/file-user/${typeFile}/${fileName}`}
              target="_blank"
            >
              <img src="/svg/file-download.svg" alt="W3Schools" />
            </a>
            <div className="uploadUserFile-files-btn">
              <ButtonDelete
                icon="trash-red"
                onSave={onSave}
                url={`/files/removeFileUser/${userId}/${fileName}?typeFile=${typeFile}`}
                className="uploadUserFile-files-btn-delete"
              />
            </div>
          </figure>
        </div>
      )}
    </div>
  );
};

export default UploadUserFile;
