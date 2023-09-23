import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  PDFViewer,
} from '@react-pdf/renderer';
import { useState } from 'react';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
  },
  title: {
    fontSize: 11,
    marginBottom: 10,
    textAlign: 'center',
  },
  section: {
    fontSize: 11,
    marginBottom: 10,
  },
  table: {
    width: '100%',
    border: '1px solid #000',
    fontSize: 11,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    flex: 1,
    padding: 6,
    border: '1px solid #000',
  },
  header: {
    fontSize: 11,
  },
  body: {
    fontSize: 11,
  },
  headerContent: {
    flexDirection: 'row',
  },
  leftInfo: {
    width: '30%',
  },
  rigthInfo: {
    width: '70%',
  },
  line: {
    borderBottom: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
});

const generatePDF = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={{ ...styles.title, fontWeight: 'bold' }}>
        HOJA DE COORDINACIÓN Nº 003-2023-GG/JGQC-COORPORACIÓN DHYRIUM
      </Text>
      <View style={styles.headerContent}>
        <View style={styles.leftInfo}>
          <Text style={styles.header}>Para:</Text>
          <Text style={styles.header}>CC:</Text>
          <Text style={styles.header}>De:</Text>
          <Text style={styles.header}>Asunto:</Text>
          <Text style={styles.header}>Fecha:</Text>
        </View>
        <View style={styles.rigthInfo}>
          <Text style={styles.header}>: ING. JUAN GONZALO QUISPE CONDORI</Text>
          <Text style={styles.header}>GERENTE GENERAL</Text>
          <Text style={styles.header}>: LIC SADITH</Text>
          <Text style={styles.header}>: JEAN CARLOS TICONA GUTIERREZ</Text>
          <Text style={styles.header}>
            ANALISTA PROGRAMADOR DEL ÁREA DE TI (TECNOLOGÍAS DE INFORMACIÓN)
          </Text>
          <Text style={styles.header}>
            : INFORME DE ADELANTO MENSUAL DEL MES DE JUNIO DEL PROYECTO SATV
          </Text>
          <Text style={styles.header}>: Puno, 04 de julio del 2023 </Text>
        </View>
      </View>
      <View style={styles.line} />
      <Text style={styles.body}>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dicta aliquam,
        consectetur soluta facere incidunt sint minus perferendis quasi totam
        officiis nemo similique exercitationem, in neque ab praesentium modi
        cupiditate sed?
      </Text>
      <View style={styles.section}>
        <Text>Tabla de Ejemplo:</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text>Nombre</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>Edad</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text>Juan</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>30</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text>María</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>25</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text>Carlos</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>35</Text>
            </View>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

const PDFGenerator = () => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div>
      <h1>VER PDF DEL DOCUMENTO</h1>
      {showPreview ? (
        <div>
          <p>Vista previa del PDF:</p>
          <PDFViewer width="1000" height="600">
            {generatePDF()}
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
        <PDFDownloadLink document={generatePDF()} fileName="tabla_pdf.pdf">
          {({ blob, url, loading, error }) =>
            loading ? 'Generando PDF...' : 'Descargar PDF'
          }
        </PDFDownloadLink>
      )}
    </div>
  );
};

export default PDFGenerator;
