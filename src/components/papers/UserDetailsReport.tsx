import Button from '../button/Button';
import DropDownSimple from '../dropDownSimple/DropDownSimple';
import UploadFile from '../shared/uploadFile/UploadFile';

interface UserDetailsReportProps {
  className?: string;
}

const data = [{ id: 1, name: 'patito' }];
const UserDetailsReport = ({ className }: UserDetailsReportProps) => {
  return (
    <div className={`${className}`}>
      <form className="paper-list-form">
        <DropDownSimple
          data={data}
          placeholder="Seleccionar al coordinador de Área"
          label="Coordinador de Área"
          itemKey="id"
          textField="name"
          accept="application/pdf"
          type="search"
          selector
        />
        <span className="paper-list-form-label">Reporte</span>
        <UploadFile
          text="+ Arrastrar o buscar archivos"
          onSave={console.log}
          uploadName="generalFile"
          URL={`/files/uploadGeneralFiles`}
          className="paper-list-form-file"
        />
        <div className="paper-list-form-button-container">
          <Button text="Enviar Reporte" className="paper-list-form-button" />
        </div>
      </form>
      {/* <PaperCard
        title="Nombre del archivo"
        description="reporte.pdf"
        icon="file_pdf_dark"
      />
      <PaperCard title="Estado" description="En proceso" classInfo="process" />
      <PaperCard
        title="Encargado"
        description="Ing. Juan Quispe"
        icon="user_icon"
      />
      <PaperCard
        title="Cargo"
        description="Coordinador de área"
        icon="position-man"
      /> */}
    </div>
  );
};

export default UserDetailsReport;
