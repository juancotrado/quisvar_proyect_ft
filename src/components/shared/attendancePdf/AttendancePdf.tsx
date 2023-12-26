import {
  Document,
  Page,
  Text,
  View,
  PDFViewer,
  PDFDownloadLink,
} from '@react-pdf/renderer';
import { AttendanceRange } from '../../../types/types';
import { styles } from './styledComponents';
import { information } from '../../../utils/constantsPdf';
import formatDate, { actualDate } from '../../../utils/formatDate';
import './attendancePdf.css';
export type TablesProps = {
  descripcion: string | null;
  encargados: string | null;
};

interface PDFGeneratorProps {
  data: AttendanceRange[];
  daily?: string;
}
interface ConfigProps {
  size: 'A4' | 'A5';
}
const orderCalls = [
  'primer llamado',
  'segundo llamado',
  'tercer llamado',
  'cuarto llamado',
  'quinto llamado',
  'sexto llamado',
  'sétimo llamado',
  'octavo llamado',
  'noveno llamado',
  'decimo llamado',
  'undecimo llamado',
  'duodecimo llamado',
  'decimotercero llamado',
  'decimocuarto llamado',
  'decimoquinto llamado',
  'decimosexto llamado',
  'decimosetimo llamado',
  'decimooctavo llamado',
  'decimonoveno llamado',
  'vigesimo llamado',
  'vigesimoprimero llamado',
  'vigesimosegundo llamado',
];
export const generateAttendanceDailyPDF = (
  value: PDFGeneratorProps,
  config?: ConfigProps
) => {
  const initialCalls =
    value.data[0].list.length <= 6
      ? orderCalls.slice(0, 6)
      : orderCalls.slice(0, value.data[0].list.length);

  const getStatus = (data: AttendanceRange) => {
    const mapStates = {
      PUNTUAL: 'P',
      TARDE: 'T',
      SIMPLE: 'F',
      GRAVE: 'G',
      MUY_GRAVE: 'M',
      PERMISO: 'L',
    };

    const orderedStatus: string[] = [];
    // console.log(data.list);

    initialCalls.forEach(call => {
      const estadoEncontrado = data.list.find(item => item.list.title === call);
      if (estadoEncontrado) {
        const inicialEstado =
          (mapStates as Record<string, string>)[estadoEncontrado.status] || ' ';
        orderedStatus.push(inicialEstado);
      } else {
        orderedStatus.push(' ');
      }
    });

    return orderedStatus;
  };
  // const getTimers = (data: AttendanceRange) => {
  //   const orderedTimers: string[] = [];

  //   orderCalls.forEach(call => {
  //     const estadoEncontrado = data.list.find(item => item.list.title === call);

  //     if (estadoEncontrado) {
  //       orderedTimers.push(estadoEncontrado.list.timer);
  //     }
  //   });

  //   return orderedTimers;
  // };

  // console.log(value.data[0].list.length);

  return (
    <Document>
      <Page
        size={config?.size ?? 'A4'}
        style={config?.size === 'A4' ? styles.page : styles.pageA5}
      >
        {/* <View style={styles.table}>
        <View style={{ ...styles.title, width: '100%' }}>
          <Text style={styles.headers}>
            LISTA DE ASISTENCIA DEL {value?.daily}
          </Text>
        </View>
      </View> */}
        <View
          style={{
            width: '100%',
            fontSize: '12px',
            textDecoration: 'underline',
            fontWeight: 'semibold',
            paddingBottom: '5px',
            textAlign: 'center',
            textTransform: 'uppercase',
          }}
        >
          <Text>LISTA DE ASISTENCIA DEL {actualDate(value?.daily)}</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={{ ...styles.tableCol, width: '5%' }}>
              <Text style={styles.headers}>N°</Text>
            </View>
            <View style={{ ...styles.tableCol, width: '7%' }}>
              <Text style={{ ...styles.headers, fontSize: '6px' }}>
                CUARTOS
              </Text>
            </View>
            <View style={{ ...styles.tableCol, width: '22%' }}>
              <Text style={styles.headers}>APELLIDOS Y NOMBRES</Text>
            </View>
            <View style={{ ...styles.tableCol, width: '10%' }}>
              <Text style={styles.headers}>DNI</Text>
            </View>
            <View style={{ ...styles.tableCol, width: '10%' }}>
              <Text style={styles.headers}>CELULAR</Text>
            </View>
            <View style={{ ...styles.tableCol, width: '8%' }}>
              <Text style={styles.headers}>EQUIPO</Text>
            </View>
            <View style={{ ...styles.tableCol, width: '10%' }}>
              <Text style={styles.headers}>USUARIO</Text>
            </View>
            <View style={{ ...styles.tableCol, width: '28%' }}>
              <Text style={styles.headers}>ASISTENCIAS</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={{ ...styles.tableCol, width: '72%' }}>
              <Text style={styles.headers}></Text>
            </View>
            {/* <View style={{ ...styles.attendance, width: '28%' }}>
              {orderCalls.map((_, index) => {
                const timer = getTimers(value.data[0]);
                return (
                  <View style={{ ...styles.attendanceItem }} key={index}>
                    <Text style={styles.headers}>{timer[index]}</Text>
                  </View>
                );
              })}
            </View> */}
            <View style={{ ...styles.attendance, width: '28%' }}>
              {initialCalls.map((_, index) => {
                return (
                  <View style={{ ...styles.attendanceItem }} key={index}>
                    <Text style={styles.headers}>{index + 1}</Text>
                  </View>
                );
              })}
            </View>
          </View>
          {value.data &&
            value.data.map((value, index) => {
              const attendances = getStatus(value);
              const getColor = (status: string) => {
                if (status === 'P') return '#87E4BD';
                if (status === 'T') return '#FFE17F';
                if (status === 'F') return '#F8C5C5';
                if (status === 'G') return '#F19191';
                if (status === 'M') return '#D2595B';
                if (status === 'L') return '#83A8F0';
              };
              return (
                <View key={value.id} style={styles.tableRow}>
                  <View style={{ ...styles.tableCol, width: '5%' }}>
                    <Text style={styles.headers}>{index + 1}</Text>
                  </View>
                  <View style={{ ...styles.tableCol, width: '7%' }}>
                    <Text style={styles.headers}>
                      {value.profile.room ?? '---'}
                    </Text>
                  </View>
                  <View style={{ ...styles.tableCol, width: '22%' }}>
                    <Text
                      style={{
                        ...styles.headers,
                        textAlign: 'left',
                        marginHorizontal: 5,
                      }}
                    >
                      {value.profile.lastName + ' ' + value.profile.firstName}
                    </Text>
                  </View>
                  <View style={{ ...styles.tableCol, width: '10%' }}>
                    <Text style={styles.headers}>{value.profile.dni}</Text>
                  </View>
                  <View style={{ ...styles.tableCol, width: '10%' }}>
                    <Text style={styles.headers}>{value.profile.phone}</Text>
                  </View>
                  <View style={{ ...styles.tableCol, width: '8%' }}>
                    <Text style={styles.headers}>
                      {value?.equipment?.workStation?.name ?? '---'}
                    </Text>
                  </View>

                  <View style={{ ...styles.tableCol, width: '10%' }}>
                    <Text style={styles.headers}>
                      {value.profile.userPc ?? '---'}
                    </Text>
                  </View>
                  <View style={{ ...styles.attendance, width: '28%' }}>
                    {attendances &&
                      attendances.map((attendance, index) => {
                        return (
                          <Text
                            style={{
                              ...styles.attendanceItem,
                              backgroundColor: getColor(attendance),
                            }}
                            key={index}
                          >
                            {attendance}
                          </Text>
                        );
                      })}
                  </View>
                </View>
              );
            })}
        </View>
        <View style={{ ...styles.table, marginTop: 10, width: '60%' }}>
          <View style={styles.information}>
            <View style={{ ...styles.tableCol, width: '10%' }}>
              <Text style={styles.headers}>N°</Text>
            </View>
            <View style={{ ...styles.tableCol, width: '12%' }}>
              <Text style={styles.headers}>SIMBOLO</Text>
            </View>
            <View style={{ ...styles.tableCol, width: '28%' }}>
              <Text style={styles.headers}>DESCRIPCION</Text>
            </View>
            <View style={{ ...styles.tableCol, width: '15%' }}>
              <Text style={styles.headers}>MULTA</Text>
            </View>
            <View style={{ ...styles.tableCol, width: '35%' }}>
              <Text style={{ ...styles.headers, textAlign: 'center' }}>
                {' '}
                MULTA COORDINADORES Y GERENTE
              </Text>
            </View>
          </View>
          {information &&
            information.map(info => (
              <View key={info.item} style={styles.information}>
                <View style={{ ...styles.tableCol, width: '10%' }}>
                  <Text style={styles.headers}>{info.item}</Text>
                </View>
                <View
                  style={{
                    ...styles.tableCol,
                    width: '12%',
                    backgroundColor: info.color,
                  }}
                >
                  <Text style={styles.headers}>{info.simbolo}</Text>
                </View>
                <View style={{ ...styles.tableCol, width: '28%' }}>
                  <Text style={styles.headers}>{info.descripcion}</Text>
                </View>
                <View style={{ ...styles.tableCol, width: '15%' }}>
                  <Text style={styles.headers}>{info.multa}</Text>
                </View>
                <View style={{ ...styles.tableCol, width: '35%' }}>
                  <Text style={styles.headers}>{info.gerente}</Text>
                </View>
              </View>
            ))}
        </View>
      </Page>
    </Document>
  );
};

const AttendancePdf = ({ data, daily }: PDFGeneratorProps) => {
  //   const [showPreview, setShowPreview] = useState(false);
  // console.log(data);

  const filterdUsers: AttendanceRange[] = data.filter(
    user => user?.list.length !== 0
  );
  return (
    <>
      <PDFViewer width="100%" height="100%" className="attendancePdf-viewer">
        {generateAttendanceDailyPDF(
          { data: filterdUsers, daily },
          { size: 'A4' }
        )}
      </PDFViewer>

      <PDFDownloadLink
        document={generateAttendanceDailyPDF(
          { data: filterdUsers, daily },
          { size: 'A4' }
        )}
        fileName={`${daily}.pdf`}
        className="budgetsPage-filter-icon attendancePdf-download"
      >
        Descargar
      </PDFDownloadLink>
    </>
  );
};

export default AttendancePdf;
