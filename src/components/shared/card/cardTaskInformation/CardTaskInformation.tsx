import { Link } from 'react-router-dom';
import { isOpenModal$ } from '../../../../services/sharingSubject';
import Modal from '../../../portal/Modal';
import './cardTaskInformation.css';
import SelectOptions from '../../select/Select';
import Button from '../../button/Button';
import { useState } from 'react';

const CardTaskInformation = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDrop = (event: any) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
  };

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  // const handleUpload = () => {
  //     if (selectedFile) {
  //         console.log('Archivo seleccionado:', selectedFile);
  //     }
  // };
  const [percentage, setPercentage] = useState(50);

  const handleClick = (newPercentage: any) => {
    setPercentage(newPercentage);
  };

  const data = [
    { name: 'Por Hacer' },
    { name: 'En proceso' },
    { name: 'Terminado' },
  ];
  const closeFunctions = () => {
    isOpenModal$.setSubject = false;
  };
  return (
    <Modal size={50}>
      <div className="information-container">
        <div className="information-header">
          <h1>Tarea: Distribucion primer nivel</h1>
          <button onClick={closeFunctions}>CERRAR</button>
        </div>
        <div className="main-content">
          <div className="content-files">
            <section className="first-section">
              <span>Enuncionado</span>
              <div className="statement">
                <div>
                  <label>Archivo modelo:</label>
                  <Link to="https://www.google.com/">Click aqui</Link>
                </div>
                <div>
                  <label>Video relacionado:</label>
                  <Link to="https://www.google.com/">Click aqui</Link>
                </div>
              </div>
            </section>
            <section className="second-section">
              <span>Enuncionado</span>
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  border: '2px dashed #ccc',
                  borderRadius: '5px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
                onDrop={handleDrop}
                onDragOver={event => event.preventDefault()}
              >
                {!selectedFile && <p>Arrastra los archivos aquí</p>}
                <input type="file" onChange={handleFileChange} />
                {/* <button onClick={handleUpload}>Subir archivo</button> */}
              </div>
            </section>
          </div>
          <div className="line-divide" />
          <div className="content-details">
            <SelectOptions data={data} itemKey="" textField="name" name="" />
            <p>Credo: 21/01/23</p>
            <h1>Avance</h1>
            <div className="progress-bar">
              <div
                className="progress-bar-line"
                style={{ width: `${percentage}%` }}
              />
              <div className="progress-bar-points">
                <div
                  className={`progress-bar-point ${
                    percentage === 0 || percentage > 0 ? 'active' : ''
                  }`}
                  onClick={() => handleClick(0)}
                />
                <div
                  className={`progress-bar-point ${
                    percentage === 25 || percentage > 25 ? 'active' : ''
                  }`}
                  onClick={() => handleClick(25)}
                />
                <div
                  className={`progress-bar-point ${
                    percentage === 50 || percentage > 50 ? 'active' : ''
                  }`}
                  onClick={() => handleClick(50)}
                />
                <div
                  className={`progress-bar-point ${
                    percentage === 75 || percentage > 75 ? 'active' : ''
                  }`}
                  onClick={() => handleClick(75)}
                />
                <div
                  className={`progress-bar-point ${
                    percentage === 100 || percentage > 100 ? 'active' : ''
                  }`}
                  onClick={() => handleClick(100)}
                />
              </div>
            </div>
            <p>{percentage}%</p>
            <label>Precio general: s/260.00</label>
            <label>Precio por avance: s/260.00</label>
            <label>Total de horas estimadas: 24 horas</label>
            <label>Total Horas: </label>
            <p>Encargado: Diego Romani</p>
            <div className="btn-content">
              <Button text="Declinar" className="btn-declinar" />
              <Button text="Revisar" className="btn-revisar" />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CardTaskInformation;
