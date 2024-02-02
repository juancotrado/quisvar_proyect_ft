import { StyleSheet, Font } from '@react-pdf/renderer';
import ArialNarrowBold from '/fonts/Arial-Narrow-Bold.ttf';
import ArialNarrow from '/fonts/Arial-Narrow.ttf';
Font.register({ family: 'Arial Narrow Bold', src: ArialNarrowBold });
Font.register({ family: 'Arial Narrow', src: ArialNarrow });
export const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: 'white',
    gap: 20,
    paddingHorizontal: 63,
    paddingVertical: 34,
  },
  dropdownLevel: {
    overflow: 'hidden',
    marginTop: 1,
    marginBottom: 1,
  },
  textIndex: {
    fontSize: 11,
    fontFamily: 'Arial Narrow',
  },
  title: {
    fontSize: 16,
    width: '100%',
    textAlign: 'center',
    color: '#0070C0',
    fontWeight: 700,
    fontFamily: 'Arial Narrow Bold',
    letterSpacing: 0.5,
  },
  fontBold: {
    fontFamily: 'Arial Narrow Bold',
  },
  isProject: {
    color: '#FF4B4B',
    fontFamily: 'Arial Narrow Bold',
  },
  isArea: {
    color: '#70AD47',
    fontFamily: 'Arial Narrow Bold',
  },
  isInclude: {
    color: '#0070C0',
  },
});
