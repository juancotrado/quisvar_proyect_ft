import Input from '../shared/Input/Input';
import { motion } from 'framer-motion';
import './CardRegisterProject.css';
import { useState } from 'react';

const CardRegisterProject = () => {
  const [selectedValue, setSelectedValue] = useState('');

  const handleSelectChange = (event: any) => {
    setSelectedValue(event.target.value);
  };
  return (
    <div className="card-register-user">
      <h1>REGISTRO DE PROYECTOS</h1>
      <div className="col">
        <Input label="Nombre del Proyeto" placeholder="Nombre" />
        <div className="select-area">
          <label htmlFor="email" className="input-label">
            Area de trabajo
          </label>
          <select
            value={selectedValue}
            onChange={handleSelectChange}
            className="input-select"
          >
            <option>Seleccione</option>
            <option value="option1">Area 1</option>
            <option value="option2">Area 2</option>
            <option value="option3">Area 3</option>
          </select>
        </div>
      </div>
      <div className="col">
        <Input label="Coordinador" placeholder="Nombre" />
        <Input label="Fecha Limite" placeholder="Coordinador" type="date" />
      </div>
      <div className="select-area">
        <label htmlFor="email" className="input-label">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          className="text-area"
          placeholder="Opcional"
        />
      </div>
      <div className="btn-build">
        <motion.button className="btn" whileTap={{ scale: 0.9 }}>
          CREAR
        </motion.button>
      </div>
      {/* <Input label="Nombre de la tarea" placeholder="Nombre" />
                <div className="select-area">
                    <label htmlFor="email" className="input-label">
                        Proyecto
                    </label>
                    <select
                        value={selectedValue}
                        onChange={handleSelectChange}
                        className="input-select"
                    >
                        <option>Seleccione</option>
                        <option value="option1">Proyecto 1</option>
                        <option value="option2">Proyecto 2</option>
                        <option value="option3">Proyecto 3</option>
                    </select>
                </div>
                <div className="col">
                    <div className="select-area">
                        <label htmlFor="email" className="input-label">
                            Área
                        </label>
                        <select
                            value={selectedValue}
                            onChange={handleSelectChange}
                            className="input-select"
                        >
                            <option>Seleccione</option>
                            <option value="option1">Area 1</option>
                            <option value="option2">Area 2</option>
                            <option value="option3">Area 3</option>
                        </select>
                    </div>
                    <Input label="Precio" placeholder="S/ 00.00" type="number" />
                </div>
                <div className="select-area">
                    <label htmlFor="email" className="input-label">
                        Descripción
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        className="text-area"
                        placeholder="Descripción"
                    />
                </div>
                <div className="btn-build">
                    <motion.button className="btn" whileTap={{ scale: 0.9 }}>
                        CREAR
                    </motion.button>
                </div> */}
    </div>
  );
};

export default CardRegisterProject;
