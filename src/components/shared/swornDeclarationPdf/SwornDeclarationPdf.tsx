import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles } from './swornDeclarationStyle';

const SwornDeclarationPdf = () => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View
          style={{
            alignItems: 'center',
          }}
        >
          <Text style={styles.title}>
            DECLARACIÓN JURADA DE CUMPLIMIENTO DE DIRECTIVAS DE GRUPO COMPANY{' '}
          </Text>
        </View>
        {/* <Text>
          Yo, Ivan Brayen Vilcanqui Bailon con DNI: 71743622 domiciliado en Urb. Flor de Sancayo Mz.B Lt. 10, del Distrito de
          Puno, provincia de Puno, Departamento de Puno, conste por el presente documento que me comprometo a cumplir las
          directivas y condiciones que detalla el presente documento
        </Text>
        <View>
          <Text>
            Cumplir con las directivas DIRECTIVA N° 001-2022-GRUPO
          </Text>
          <Text>Cumplir con las directivas DIRECTIVA N° 003-2023-GRUPO</Text>

        </View> */}
        <Text style={styles.subtitle}>PRIMERO: CARGO</Text>
        <Text style={styles.text}>
          Me comprometo a desempeñarme en el cargo de ASISTENTE, esta regirá
          desde el día de inicio de labores en las instalaciones del grupo hasta
          el último día de labores, deberá entregar con un acta de entrega
          acompañado con un informe situacional detallando las labores
          realizadas y la meta alcanzada durante mi estadía.{' '}
        </Text>
      </Page>
    </Document>
  );
};

export default SwornDeclarationPdf;
