import './home.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { PDFGenerator } from '../../components';
import { TablesProps } from '../../components/shared/generatePdf/GeneratePdf';
export type ObjetoTabla = {
  [clave: string]: string;
};

type Tablas = ObjetoTabla[];

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
  const data = {
    from: 'Juan Gonzalo Quispe Condori',
    to: 'Sadith Vargas Montesinos',
    affair: 'Lo que se indica',
    // // cc: [
    // //   {name: 'Juan', manager: 'Gerente'},
    // //   {name: 'Maria', manager: 'Asistente'},
    // //   {name: 'Jhon', manager: 'Coordinador'},
    // // ],
    date: 'Puno 24 de setiembre del 2023',
    body: 'Con las obras de mejoramiento de la infraestructura educativa a nivel nacional, se realizan intervenciones en los ambientes que componen las sedes educativas para reparar el deterioro físico por el uso, desgaste, antigüedad, emergencias, factores ambientales, falta de mantenimiento, uso inadecuado, entre otros.',
    dni: '83774619',
    title: 'ACUERDO N°1 DHYRIUM-JJCM-2023',
    type: 'ACUERDO',
    header: 'XD',
    description:
      '<p style="text-align: justify;">Por medio del presente documento me dirijo a usted con la finalidad de hacerle llegar un cordial saludo,y al mismo tiempo comunicarle lo siguiente:</p>\n' +
      '<p style="text-align: justify;">&nbsp;</p>\n' +
      '<table style="border-collapse: collapse; width: 100%;" border="1">\n' +
      '<tbody>\n' +
      '<tr>\n' +
      '<td style="width: 16.701%;">c</td>\n' +
      '<td style="width: 16.701%;">x</td>\n' +
      '<td style="width: 16.701%;">y</td>\n' +
      '<td style="width: 16.701%;">z</td>\n' +
      '<td style="width: 16.701%;">a</td>\n' +
      '<td style="width: 16.701%;">b</td>\n' +
      '</tr>\n' +
      '<tr>\n' +
      '<td style="width: 16.701%;">1</td>\n' +
      '<td style="width: 16.701%;">asd</td>\n' +
      '<td style="width: 16.701%;">fdsg</td>\n' +
      '<td style="width: 16.701%;">wert</td>\n' +
      '<td style="width: 16.701%;">iuyt</td>\n' +
      '<td style="width: 16.701%;">ggg</td>\n' +
      '</tr>\n' +
      '<tr>\n' +
      '<td style="width: 16.701%;">2</td>\n' +
      '<td style="width: 16.701%;">asdf</td>\n' +
      '<td style="width: 16.701%;">fdsgh</td>\n' +
      '<td style="width: 16.701%;">we</td>\n' +
      '<td style="width: 16.701%;">vbn</td>\n' +
      '<td style="width: 16.701%;">ddd</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '<p>&nbsp;</p>\n' +
      '<p>&nbsp;</p>\n' +
      '<p style="text-align: center;">Atentamente, COTRADO MONTALICO JUAN JOEL</p>',
  };
  function convertirHtmlAArrayDeObjetos(htmlString: string): Tablas {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = htmlString;

    const tablas: Tablas = [];
    const tablasHTML = tempElement.querySelectorAll('table');

    tablasHTML.forEach(tablaHTML => {
      const filasHTML = tablaHTML.querySelectorAll('tr');
      const headersHTML = filasHTML[0].querySelectorAll('td');

      for (let i = 1; i < filasHTML.length; i++) {
        const celdasHTML = filasHTML[i].querySelectorAll('td');
        const objeto: ObjetoTabla = {};

        celdasHTML.forEach((celda, index) => {
          const encabezado = headersHTML[index];
          if (
            encabezado &&
            typeof encabezado.textContent === 'string' &&
            celda &&
            typeof celda.textContent === 'string'
          ) {
            const clave = encabezado.textContent.trim();
            const valor = celda.textContent.trim();
            if (clave && valor) {
              objeto[clave] = valor;
            }
          }
        });

        tablas.push(objeto);
      }
    });

    return tablas;
  }
  const arrayDeObjetos = convertirHtmlAArrayDeObjetos(data.description);

  console.log(arrayDeObjetos);
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
        <PDFGenerator data={data} tables={arrayDeObjetos} />
      </div>
    </div>
  );
};

export default Home;
