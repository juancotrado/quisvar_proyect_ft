import {
  Document,
  Page,
  Text,
  View,
  PDFDownloadLink,
  PDFViewer,
} from '@react-pdf/renderer';
import { useState } from 'react';
import { styles } from './styledComponents';
type CcProps = {
  name: string;
  manager: string;
};
export type TablesProps = {
  descripcion: string | null;
  encargados: string | null;
};
interface PDFGeneratorProps {
  data: {
    from: string;
    to: string;
    cc?: CcProps[];
    affair: string;
    date: string;
    body: string;
    dni: string;
  };
  tables?: TablesProps[];
}
const generatePDF = (value: PDFGeneratorProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={{ ...styles.title }}>
        HOJA DE COORDINACIÓN Nº 003-2023-GG/JGQC-COORPORACIÓN DHYRIUM
      </Text>
      <View style={styles.headerContent}>
        {/* header */}
        <View style={styles.headerRow}>
          <View style={styles.leftInfo}>
            <Text style={styles.headerBold}>Para</Text>
            <Text style={styles.headerBold}>: </Text>
          </View>
          <View style={styles.rigthInfo}>
            <Text style={styles.header}>
              ING. {value.data?.from.toUpperCase()}
            </Text>
            <Text style={styles.header}>GERENTE GENERAL</Text>
          </View>
        </View>
        {/* header */}
        {value.data.cc &&
          value.data.cc?.length > 0 &&
          value.data.cc?.map((item, idx) => (
            <View style={styles.headerRow} key={idx}>
              <View style={styles.leftInfo}>
                <Text style={styles.headerBold}>CC</Text>
                <Text style={styles.headerBold}>: </Text>
              </View>
              <View>
                <Text style={styles.header}>ING. {item.name}</Text>
                <Text style={styles.header}>{item.manager}</Text>
              </View>
            </View>
          ))}
        {/* header */}
        <View style={styles.headerRow}>
          <View style={styles.leftInfo}>
            <Text style={styles.headerBold}>De</Text>
            <Text style={styles.headerBold}>: </Text>
          </View>
          <View>
            <Text style={styles.header}>
              LIC. {value.data?.to.toUpperCase()}
            </Text>
            <Text style={styles.header}>GERENTE GENERAL</Text>
          </View>
        </View>
        {/* header */}
        <View style={styles.headerRow}>
          <View style={styles.leftInfo}>
            <Text style={styles.headerBold}>Asunto</Text>
            <Text style={styles.headerBold}>: </Text>
          </View>
          <View style={styles.rigthInfo}>
            <Text style={styles.headerLong}>{value.data?.affair}</Text>
            {/* <Text style={styles.header}>GERENTE GENERAL</Text> */}
          </View>
        </View>
        {/* header */}
        <View style={styles.headerRow}>
          <View style={styles.leftInfo}>
            <Text style={styles.headerBold}>Fecha</Text>
            <Text style={styles.headerBold}>: </Text>
          </View>
          <View>
            <Text style={styles.header}>{value.data?.date}</Text>
          </View>
        </View>
      </View>
      <View style={styles.line} />
      <Text style={styles.body}>
        Por medio del presente documento me dirijo a Ud. Con la finalidad de
        hacerle llegar un coordial saludo, y al mismo tiempo comunicarle lo
        siguiente. {value.data?.body}
      </Text>
      {value.tables &&
        value.tables.map(table => (
          <View style={styles.section}>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Text style={styles.header}>{table.descripcion}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.header}>{table.encargados}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      <View style={styles.signArea}>
        <View style={styles.sign} />
        <Text style={styles.header}>ING: {value.data.from.toUpperCase()}</Text>
        <Text style={styles.header}>DNI: {value.data.dni}</Text>
      </View>
    </Page>
  </Document>
);

const PDFGenerator = ({ data, tables }: PDFGeneratorProps) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div>
      <h1>VER PDF DEL DOCUMENTO</h1>
      {showPreview ? (
        <div>
          <p>Vista previa del PDF:</p>
          <PDFViewer width="1000" height="600">
            {generatePDF({ data, tables })}
          </PDFViewer>
          <button onClick={() => setShowPreview(false)}>
            Ocultar Vista Previa
          </button>
        </div>
      ) : (
        <div>
          <p>
            Haz clic en el botón para ver la vista previa y descargar el PDF con
            la tabla:
          </p>
          <button onClick={() => setShowPreview(true)}>Ver Vista Previa</button>
        </div>
      )}
      {showPreview && (
        <PDFDownloadLink
          document={generatePDF({ data, tables })}
          fileName="tabla_pdf.pdf"
        >
          {({ blob, url, loading, error }) =>
            loading ? 'Generando PDF...' : 'Descargar PDF'
          }
        </PDFDownloadLink>
      )}
    </div>
  );
};

export default PDFGenerator;
