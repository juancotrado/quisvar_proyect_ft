import {
  Document,
  Page,
  Text,
  View,
  PDFDownloadLink,
  // PDFViewer,
} from '@react-pdf/renderer';
// import { useState } from 'react';
import { styles } from './styledComponents';
import { PdfDataProps } from '../../../types/types';
import './GeneratePdf.css';

export type TablesProps = {
  descripcion: string | null;
  encargados: string | null;
};

interface PDFGeneratorProps {
  data: PdfDataProps;
}
interface ConfigProps {
  size: 'A4' | 'A5';
}
const generatePDF = (value: PDFGeneratorProps, config?: ConfigProps) => (
  <Document>
    <Page
      size={config?.size ?? 'A4'}
      style={config?.size === 'A4' ? styles.page : styles.pageA5}
    >
      <Text style={{ ...styles.title }}>{value.data?.title}</Text>
      <View style={styles.headerContent}>
        {/* header */}
        <View style={styles.headerRow}>
          <View style={styles.leftInfo}>
            <Text style={styles.headerBold}>Para</Text>
            <Text style={styles.headerBold}>: </Text>
          </View>
          <View style={styles.rigthInfo}>
            <Text style={styles.header}>
              {value.data.toDegree?.slice(0, 3)}. {value.data?.to}
            </Text>
            <Text style={styles.header}>{value.data.toPosition}</Text>
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
            <Text style={{ ...styles.header, textTransform: 'uppercase' }}>
              {value.data.fromDegree?.slice(0, 3)}. {value.data?.from}
            </Text>
            <Text style={styles.header}>{value.data.fromPosition}</Text>
          </View>
        </View>
        {/* header */}
        <View style={styles.headerRow}>
          <View style={styles.leftInfo}>
            <Text style={styles.headerBold}>Asunto</Text>
            <Text style={styles.headerBold}>: </Text>
          </View>
          <View style={styles.rigthInfo}>
            <Text style={styles.headerLong}>{value.data?.header}</Text>
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
      <Text style={styles.body}>{value.data?.body}</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          {value.data.tables &&
            value.data.tables.length > 0 &&
            Object.keys(value.data.tables[0]).map((key, columnIndex) => (
              <View style={styles.tableCell} key={columnIndex}>
                <Text style={styles.header}>{key}</Text>
              </View>
            ))}
        </View>
        {value.data.tables &&
          value.data.tables.map((fila, filaIdx) => (
            <View style={styles.tableRow} key={filaIdx}>
              {Object.values(fila).map((valor, columnaIdx) => (
                <View style={styles.tableCell} key={columnaIdx}>
                  <Text>{valor}</Text>
                </View>
              ))}
            </View>
          ))}
      </View>
      <View style={styles.signArea}>
        <View style={styles.sign} />
        <Text style={styles.header}>
          {value.data.fromDegree?.slice(0, 3)}. {value.data.from}
        </Text>
        <Text style={styles.header}>DNI: {value.data.dni}</Text>
      </View>
    </Page>
  </Document>
);

const PDFGenerator = ({ data }: PDFGeneratorProps) => {
  // const [showPreview, setShowPreview] = useState(false);
  // console.log(Object.keys(tables));

  return (
    <div className="pdf-btn-area">
      {/* {showPreview ? (
        <div>
          <p>Vista previa del PDF:</p>
          <PDFViewer width="1000" height="600">
            {generatePDF({ data, tables}, {size : 'A4'})}
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
      )} */}
      {/* {showPreview && ( */}
      <PDFDownloadLink
        document={generatePDF({ data }, { size: 'A5' })}
        fileName={`${data.title}.pdf`}
        className="pdf-btn"
      >
        {({ loading }) => (loading ? 'Generando PDF...' : 'Descargar A5')}
      </PDFDownloadLink>
      <PDFDownloadLink
        document={generatePDF({ data }, { size: 'A4' })}
        fileName={`${data.title}.pdf`}
        className="pdf-btn"
      >
        {({ loading }) => (loading ? 'Generando PDF...' : 'Descargar A4')}
      </PDFDownloadLink>
      {/* )} */}
    </div>
  );
};

export default PDFGenerator;
