import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles } from './swornDeclarationStyle';
import { UserForm } from '../../../types/types';
interface SwornDeclarationPdfProps {
  data: UserForm;
}
const SwornDeclarationPdf = ({ data }: SwornDeclarationPdfProps) => {
  console.log(data);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View
          style={{
            alignItems: 'center',
          }}
        >
          <Text style={styles.title}>
            DECLARACIÓN JURADA DE CUMPLIMIENTO DE DIRECTIVAS DE GRUPO COMPANY
          </Text>
        </View>
        <Text style={styles.text}>
          Yo,{' '}
          <Text style={styles.textBold}>
            {data.firstName} {data.lastName}
          </Text>{' '}
          con DNI: <Text style={styles.textBold}>{data.dni} </Text>
          domiciliado en <Text style={styles.textBold}>{data.address}</Text>,
          del Distrito de {data.district}, provincia de {data.province},
          Departamento de {data.department}, conste por el presente documento
          que me comprometo a cumplir las directivas y condiciones que detalla
          el presente documento.
        </Text>
        <View style={{ marginLeft: 50 }}>
          {data?.declarations?.map(declaration => (
            <Text style={styles.text} id={declaration}>
              ■ Cumplir con las directivas: {declaration}
            </Text>
          ))}
        </View>
        <Text style={styles.subtitle}>PRIMERO: CARGO</Text>
        <Text style={styles.text}>
          Me comprometo a desempeñarme en el cargo de ASISTENTE, esta regirá
          desde el día de inicio de labores en las instalaciones del grupo hasta
          el último día de labores, deberá entregar con un acta de entrega
          acompañado con un informe situacional detallando las labores
          realizadas y la meta alcanzada durante mi estadía.
        </Text>
        <Text style={styles.subtitle}>SEGUNDO: RESPONSABILIDADES</Text>
        <Text style={styles.text}>
          Me comprometo a no divulgar los derechos intelectuales del grupo de
          comprobarse me comprometo a ser procesado conforme al código civil,
          código penal. Así mismo resarcir los daños y perjuicios calculadas
          conforme ley. Me comprometo a no llegar a agredir, denigrar, difamar
          y/o comentar en y estos contravenido con los derechos fundamentales de
          la empresa o las personas que laboran en la empresa, de comprobarse la
          vilipendio me comprometo a ser procesado conforme al código civil,
          código penal. Así mismo resarcir los daños y perjuicios calculadas
          conforme ley a la persona y al grupo.
        </Text>
        <Text style={styles.subtitle}>TERCERO: PENALIDADES</Text>
        <Text style={styles.text}>
          Me comprometo a no llegar al incumplimiento; por retiro anticipado al
          tiempo de contrato o abandono de cargo por más de 4 días, sin
          reportase, la multa será del 50% del monto contractual por el tiempo
          estipulado en el contrato. siendo está pudiendo ser proceda en código
          civil, código penal y otros que aplique la de acuerdo ley Me
          comprometo a no llegar al incumplimiento de funciones; en caso que no
          cumpla las funciones estipuladas en el contrato, la multa será del 5%
          del monto contractual calculado al mes. Siendo está pudiendo ser
          procedas en código civil, código penal y código penal y otros que
          aplique de acuerdo ley.
        </Text>
        <Text style={styles.subtitle}>CUARTO: DECLARO BAJO JURAMENTO </Text>
        <Text style={styles.text}>
          La presente declaración jurada, la efectúo de buena fe, basado en el
          principio de presunción de veracidad consagrado en el numeral 1.7 del
          Artículo IV del Título Preliminar de la Ley N° 27444 - Ley de
          Procedimiento Administrativo General cuyo Texto Único Ordenado fue
          aprobado por Decreto Supremo Nº 004-2019-JUS, código civil y penal. Me
          afirmo y me ratifico en lo expresado, en señal de lo cual firmo el
          presente documento en la ciudad de Puno, en la fecha 11 de noviembre
          del 2023.
        </Text>
        <View style={{ width: '100%', alignItems: 'center' }}>
          <Text style={styles.signText}>Firma y huella digital</Text>
        </View>
      </Page>
    </Document>
  );
};

export default SwornDeclarationPdf;
