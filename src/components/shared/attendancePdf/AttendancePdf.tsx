import { Document, Page, Text, View, PDFViewer } from '@react-pdf/renderer';
import { AttendanceRange } from '../../../types/types';
import { styles } from './styledComponents';
import { information } from '../../../utils/constantsPdf';
import formatDate from '../../../utils/formatDate';

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

const generatePDF = (value: PDFGeneratorProps, config?: ConfigProps) => {
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

    const orderCalls = [
      'primer llamado',
      'segundo llamado',
      'tercer llamado',
      'cuarto llamado',
      'quinto llamado',
      'sexto llamado',
    ];

    orderCalls.forEach(call => {
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
  const parseDate = (value?: string) => {
    return formatDate(new Date(value ? value : new Date()), {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    });
  };
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
          <Text>LISTA DE ASISTENCIA DEL {parseDate(value?.daily)}</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={{ ...styles.tableCol, width: '5%' }}>
              <Text style={styles.headers}>N°</Text>
            </View>
            <View style={{ ...styles.tableCol, width: '10%' }}>
              <Text style={styles.headers}>CUARTOS</Text>
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
            <View style={{ ...styles.tableCol, width: '25%' }}>
              <Text style={styles.headers}>ASISTENCIAS</Text>
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
                  <View style={{ ...styles.tableCol, width: '10%' }}>
                    <Text style={styles.headers}> --- </Text>
                  </View>
                  <View style={{ ...styles.tableCol, width: '22%' }}>
                    <Text
                      style={{
                        ...styles.headers,
                        textAlign: 'left',
                        marginHorizontal: 5,
                      }}
                    >
                      {value.profile.firstName + ' ' + value.profile.firstName}
                    </Text>
                  </View>
                  <View style={{ ...styles.tableCol, width: '10%' }}>
                    <Text style={styles.headers}>{value.profile.dni}</Text>
                  </View>
                  <View style={{ ...styles.tableCol, width: '10%' }}>
                    <Text style={styles.headers}>{value.profile.phone}</Text>
                  </View>
                  <View style={{ ...styles.tableCol, width: '8%' }}>
                    <Text style={styles.headers}> ------ </Text>
                  </View>

                  <View style={{ ...styles.tableCol, width: '10%' }}>
                    <Text style={styles.headers}> ------ </Text>
                  </View>
                  <View style={{ ...styles.attendance, width: '25%' }}>
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
    <PDFViewer width="100%" height="100%">
      {generatePDF({ data: filterdUsers, daily }, { size: 'A4' })}
    </PDFViewer>
  );
};

export default AttendancePdf;
