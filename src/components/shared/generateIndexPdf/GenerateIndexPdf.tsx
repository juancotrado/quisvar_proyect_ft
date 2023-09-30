import { Document, Page, Text, View } from '@react-pdf/renderer';
import { Level } from '../../../types/types';
import { styles } from './styleGenerateIndexPdf';

interface generateIndexPdfProps {
  data: Level;
}
const textRender = (level: Level) => {
  const { fontBold, isProject, isArea, isInclude } = styles;
  const styleIndex = level.isProject
    ? isProject
    : level.isArea
    ? isArea
    : level.isInclude
    ? isInclude
    : {};
  const fontWeight = level.level === 1 ? fontBold : {};
  return (
    <Text style={{ ...styles.textIndex, ...styleIndex, ...fontWeight }}>
      {level.item} {level.name}
    </Text>
  );
};
const recursionIndex = (level: Level) => {
  return (
    <View style={styles.dropdownLevel}>
      {level?.nextLevel?.map(subLevel => (
        <View key={subLevel.id}>
          {textRender(subLevel)}
          {recursionIndex(subLevel)}
        </View>
      ))}
    </View>
  );
};
export const generateIndexPdf = ({ data }: generateIndexPdfProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>{data.projectName}</Text>
      <View>{recursionIndex(data)}</View>
    </Page>
  </Document>
);
