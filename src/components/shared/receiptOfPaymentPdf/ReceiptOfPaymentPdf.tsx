import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles } from './stylesReceiptOfPaymentPdf';

const ReceiptOfPaymentPdf = () => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View
          style={{
            alignItems: 'center',
          }}
        >
          <Text style={styles.title}>ORDEN DE SERVICIO</Text>
        </View>
        <View style={{ ...styles.table, width: '20%', marginLeft: 'auto' }}>
          <View style={styles.tableRow}>
            <View style={{ ...styles.tableCol, width: '50%' }}>
              <Text style={styles.headers}>N°</Text>
            </View>
            <View style={{ ...styles.tableCol, width: '50%' }}>
              <Text style={styles.headers}>DIa/Mes/Año</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={{ ...styles.tableCol, width: '50%' }}>
              <Text style={styles.headers}>N°</Text>
            </View>
            <View style={{ ...styles.tableCol, width: '50%' }}>
              <Text style={styles.headers}>DIa/Mes/Año</Text>
            </View>
          </View>
        </View>

        <View style={styles.info}>
          <View style={styles.infoLeft}>
            <Text style={styles.text}>Señores:</Text>
            <Text style={styles.text}>Direccion:</Text>
            <Text style={styles.text}>Doc. Ref:</Text>
            <Text style={styles.text}>Facturar a Nombre de: QUISVAR Y SRL</Text>
          </View>
          <View style={styles.infoRight}>
            <Text style={styles.text}>RUC: 12321321321312</Text>
            <Text style={styles.text}>RUC: 213213213213</Text>
          </View>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={{ ...styles.tableCol, width: '15%' }}>
              <Text style={styles.headers}>ITM</Text>
            </View>
            <View style={{ ...styles.tableCol, width: '15%' }}>
              <Text style={styles.headers}>CTA. CONTABLE</Text>
            </View>
            <View style={{ ...styles.tableCol, width: '25%' }}>
              <Text style={styles.headers}>DESCRIPCIÓN </Text>
            </View>
            <View style={{ ...styles.tableCol, width: '15%' }}>
              <Text style={styles.headers}>CANTIDAD</Text>
            </View>
            <View style={{ ...styles.tableCol, width: '15%' }}>
              <Text style={styles.headers}>UND</Text>
            </View>
            <View style={{ ...styles.tableCol, width: '15%' }}>
              <Text style={styles.headers}>VALOR TOTAL S/.</Text>
            </View>
          </View>
          <View style={{ ...styles.tableRow, height: 300 }}>
            <View style={{ ...styles.tableCol, width: '15%' }}>
              <Text style={styles.headers}>ITM</Text>
            </View>
            <View style={{ ...styles.tableCol, width: '15%' }}>
              <Text style={styles.headers}>CTA. CONTABLE</Text>
            </View>
            <View style={{ ...styles.tableCol, width: '25%' }}>
              <Text style={styles.headers}>DESCRIPCIÓN </Text>
            </View>
            <View style={{ ...styles.tableCol, width: '15%' }}>
              <Text style={styles.headers}>CANTIDAD</Text>
            </View>
            <View style={{ ...styles.tableCol, width: '15%' }}>
              <Text style={styles.headers}>UND</Text>
            </View>
            <View style={{ ...styles.tableCol, width: '15%' }}>
              <Text style={styles.headers}>VALOR TOTAL S/.</Text>
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.text}>SON:TRESCIENTOS CON 00/100</Text>
          <Text style={styles.text}>TOTAL S/ 300.00</Text>
        </View>
        <View style={styles.signature}>
          <Text style={styles.signatureText}> INTERASADO</Text>
          <Text style={styles.signatureText}> ADMINISTRADOR</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ReceiptOfPaymentPdf;
