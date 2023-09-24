import './home.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
// import { PDFGenerator } from '../../components';
// import { TablesProps } from '../../components/shared/generatePdf/GeneratePdf';

const Home = () => {
  const { userSession } = useSelector((state: RootState) => state);

  const navigate = useNavigate();
  const handleNavigateToAreas = () => navigate('/especialidades');
  const handleNavigateMyWorks = () => navigate('/mis-tareas');
  const handleNavigateReports = () => navigate('/lista-de-notificaciones');
  const handleNavigateMyAdmin = () => {
    if (userSession.role !== 'EMPLOYEE') {
      handleNavigateReports();
    } else {
      handleNavigateMyWorks();
    }
  };
  //   const data = {
  //     from: 'Juan Gonzalo Quispe Condori',
  //     to: 'Sadith Vargas Montesinos',
  //     affair: 'Lo que se indica',
  //     // cc: [
  //     //   {name: 'Juan', manager: 'Gerente'},
  //     //   {name: 'Maria', manager: 'Asistente'},
  //     //   {name: 'Jhon', manager: 'Coordinador'},
  //     // ],
  //     date: 'Puno 24 de setiembre del 2023',
  //     body: 'Con las obras de mejoramiento de la infraestructura educativa a nivel nacional, se realizan intervenciones en los ambientes que componen las sedes educativas para reparar el deterioro físico por el uso, desgaste, antigüedad, emergencias, factores ambientales, falta de mantenimiento, uso inadecuado, entre otros.',
  //     dni: '83774619',
  //   }
  //   const tablaHTML = `<table dir="ltr" style="width: 100.057%;" border="1" cellspacing="0" cellpadding="0"><colgroup><col style="width: 72.4832%;" width="549"><col style="width: 27.4735%;" width="99"></colgroup>
  //   <tbody>
  //   <tr>
  //   <td data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;DESCRIPCI&Oacute;N&quot;}">DESCRIPCI&Oacute;N</td>
  //   <td data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;ENCAGADOS&quot;}">ENCAGADOS</td>
  //   </tr>
  //   <tr>
  //   <td data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;1 . REGISTRO DEL FORMATO 07-A IMPRESO DESDE EL APLICATIVO&quot;}">1 . REGISTRO DEL FORMATO 07-A IMPRESO DESDE EL APLICATIVO</td>
  //   <td data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;Ing. pluvio&quot;}">Ing. pluvio</td>
  //   </tr>
  //   <tr>
  //   <td data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;2 . FICHA T&Eacute;CNICA, SEG&Uacute;N CORRESPONDA (ficha t&eacute;cnica simplifica y/o ficha t&eacute;cnica est&aacute;ndar)&quot;}">2 . FICHA T&Eacute;CNICA, SEG&Uacute;N CORRESPONDA (ficha t&eacute;cnica simplifica y/o ficha t&eacute;cnica est&aacute;ndar)</td>
  //   <td data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;Ing. pluvio&quot;}">Ing. pluvio</td>
  //   </tr>
  //   <tr>
  //   <td data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;3 . RESUMEN EJECUTIVO&quot;}">3 . RESUMEN EJECUTIVO</td>
  //   <td data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;Ing. pluvio&quot;}">Ing. pluvio</td>
  //   </tr>
  //   <tr>
  //   <td data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;4 . ANEXOS Y/O INFORME COMPLEMENTARIO&quot;}">4 . ANEXOS Y/O INFORME COMPLEMENTARIO</td>
  //   <td data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;Ing. pluvio&quot;}">Ing. pluvio</td>
  //   </tr>
  //   <tr>
  //   <td data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;4.1. Anexo N&deg; 01: Diagnostico, mapas, planos y/o croquis actual y panel fotogr&aacute;fico.&quot;}">4.1. Anexo N&deg; 01: Diagnostico, mapas, planos y/o croquis actual y panel fotogr&aacute;fico.</td>
  //   <td data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;Ing. pluvio&quot;}">Ing. pluvio</td>
  //   </tr>
  //   </tbody>
  //   </table>`
  //   const tempElement = document.createElement('div');
  // tempElement.innerHTML = tablaHTML;

  // // Obtener filas de la tabla
  // const filas = tempElement.querySelectorAll('tbody tr');
  // const arrayDeObjetos: TablesProps[] = [];

  // filas.forEach((fila) => {
  //   const celdas = fila.querySelectorAll('td');
  //   if (celdas.length >= 2) {
  //     const objeto : TablesProps = {
  //       descripcion: celdas[0].textContent,
  //       encargados: celdas[1].textContent,
  //     };
  //     arrayDeObjetos.push(objeto);
  //   }
  // });

  // console.log(arrayDeObjetos);
  return (
    <div className="home">
      <h1 className="home-title">
        BIENVENIDO{' '}
        <span className="title-content-span">
          {userSession?.profile.firstName}
        </span>
      </h1>
      <p className="paragraph">
        ¡Bienvenido a nuestro sistema de asignación de tareas! Aquí podrás
        asignar y gestionar tareas de manera eficiente en tan solo unos pocos
        clics. Simplifica tu vida y aumenta la productividad de tu equipo con
        nuestra plataforma.
      </p>
      <div className="btn-section">
        <button
          className="home-btn btn-color-1"
          onClick={handleNavigateMyAdmin}
        >
          Tus tareas
        </button>
        <button
          className="home-btn btn-color-2"
          onClick={handleNavigateToAreas}
        >
          Projectos
        </button>
        {/* <PDFGenerator data={data} tables={arrayDeObjetos}/> */}
      </div>
    </div>
  );
};

export default Home;
