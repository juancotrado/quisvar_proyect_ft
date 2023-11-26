import { StyleSheet, Font } from '@react-pdf/renderer';
import ArialNarrowBold from '../../../utils/pdfFonts/Arial-Narrow-Bold.ttf';
import ArialNarrow from '../../../utils/pdfFonts/Arial-Narrow.ttf';
Font.register({ family: 'Arial Narrow Bold', src: ArialNarrowBold });
Font.register({ family: 'Arial Narrow', src: ArialNarrow });
export const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    paddingHorizontal: 20,
    paddingVertical: 24,
    // flex: 1,
    // position: 'relative',
    // borderStyle: 'solid',
    // borderWidth: 1,
    // borderRightWidth: 0,
    // borderBottomWidth: 0,
    // width: 'auto',
  },
  pageA5: {
    flexDirection: 'column',
    paddingHorizontal: 47,
    paddingVertical: 23,
    flex: 1,
    position: 'relative',
  },
  headerContent: {
    flexDirection: 'row',
    margin: 'auto',
    // width: '100%',
    // justifyContent: 'space-between'
  },
  headers: {
    fontSize: 6,
    // border: '1px solid black',
    // paddingHorizontal: 10,
    // paddingVertical: 5,
    margin: 'auto',
    marginTop: 5,
    textTransform: 'uppercase',
  },
  attendance: {
    flexDirection: 'row',
    borderStyle: 'solid',
    // borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  attendanceItem: {
    fontSize: 8,
    // border: '1px solid black',
    // paddingHorizontal: 5,
    width: '100%',
    paddingVertical: 4,
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  information: {
    margin: 'auto',
    flexDirection: 'row',
    // justifyContent: 'space-between'
  },
  title: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottom: 0,
  },
});
