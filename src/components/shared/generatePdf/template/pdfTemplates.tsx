import {
  Document,
  Page,
  Text,
  View,
  // PDFViewer,
} from '@react-pdf/renderer';
import { styles } from '../styledComponents';
import { PdfDataProps } from '../../../../types/types';

export const generatePDF = (data: PdfDataProps, size: 'A4' | 'A5') => (
  <Document>
    <Page size={size} style={size === 'A4' ? styles.page : styles.pageA5}>
      <Text style={{ ...styles.title }}>{data?.title}</Text>
      <View style={styles.headerContent}>
        {/* header */}
        <View style={styles.headerRow}>
          <View style={styles.leftInfo}>
            <Text style={styles.headerBold}>Para</Text>
            <Text style={styles.headerBold}>: </Text>
          </View>
          <View style={styles.rigthInfo}>
            <Text style={styles.header}>
              {data.toDegree?.slice(0, 3)}. {data?.to}
            </Text>
            <Text style={styles.header}>{data.toPosition}</Text>
          </View>
        </View>
        {/* header */}
        {data.cc &&
          data.cc?.length > 0 &&
          data.cc?.map((item, idx) => (
            <View style={styles.headerRow} key={idx}>
              <View style={styles.leftInfo}>
                <Text style={styles.headerBold}>CC</Text>
                <Text style={styles.headerBold}>: </Text>
              </View>
              <View>
                <Text style={styles.header}>
                  {item.degree.slice(0, 3)}. {item.name}
                </Text>
                <Text style={styles.header}>{item.position}</Text>
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
            <Text style={{ ...styles.header, textTransform: 'capitalize' }}>
              {data.fromDegree?.slice(0, 3)}
              {data.fromDegree && '.'} {data?.from}
            </Text>
            <Text style={styles.header}>{data.fromPosition}</Text>
          </View>
        </View>
        {/* header */}
        <View style={styles.headerRow}>
          <View style={styles.leftInfo}>
            <Text style={styles.headerBold}>Asunto</Text>
            <Text style={styles.headerBold}>: </Text>
          </View>
          <View style={styles.rigthInfo}>
            <Text style={styles.headerLong}>{data?.header}</Text>
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
            <Text style={styles.header}>{data?.date}</Text>
          </View>
        </View>
      </View>
      <View style={styles.line} />
      {/* body */}
      {data.body &&
        data.body.length > 0 &&
        data.body.map((element, elementIndex) => (
          <View key={elementIndex}>
            {element.type === 'paragraph' ? (
              <Text style={styles.body}>{element.content}</Text>
            ) : element.type === 'table' ? (
              <View style={styles.table}>
                {element.data.map((row, rowIndex) => (
                  <View style={styles.tableRow} key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <View style={styles.tableCell} key={cellIndex}>
                        {rowIndex === 0 ? (
                          <Text style={styles.header}>{cell}</Text>
                        ) : (
                          <Text>{cell}</Text>
                        )}
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        ))}
      {/* firma */}
      <View style={styles.signArea}>
        <View style={styles.sign} />
        <Text style={styles.header}>
          {data.fromDegree && data.fromDegree?.slice(0, 3) + '.'} {data.from}
        </Text>
        <Text style={styles.header}>DNI: {data.dni}</Text>
      </View>
    </Page>
  </Document>
);
