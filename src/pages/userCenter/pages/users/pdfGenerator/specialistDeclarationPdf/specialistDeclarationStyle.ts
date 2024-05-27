import { StyleSheet, Font } from '@react-pdf/renderer';
import ArialNarrowBold from '/fonts/Arial-Narrow-Bold.ttf';
import ArialNarrow from '/fonts/Arial-Narrow.ttf';
Font.register({ family: 'Arial Narrow Bold', src: ArialNarrowBold });
Font.register({ family: 'Arial Narrow', src: ArialNarrow });
export const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    paddingHorizontal: 90,
    paddingVertical: 90,
    position: 'relative',
    gap: 4,
  },

  headerContainer: {
    paddingTop: 5,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    paddingHorizontal: 40,
    alignItems: 'center',
    left: 0,
    right: 0,
  },
  headerTitle: {
    marginTop: 20,
    width: '100%',
    letterSpacing: 1,
    fontSize: 8,
    minHeight: 30,
    fontWeight: 'extrabold',
    color: '#525659',
    fontFamily: 'Arial Narrow Bold',
  },
  title: {
    borderStyle: 'solid',
    // borderBottomWidth: 1,
    fontSize: 12,
    fontFamily: 'Arial Narrow Bold',
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 11,
    fontFamily: 'Arial Narrow',
    textAlign: 'justify',
    lineHeight: 2,
  },
  paragraph2: {
    fontSize: 11,
    fontFamily: 'Arial Narrow',
    textAlign: 'justify',
    lineHeight: 2,
  },
  signText: {
    fontSize: 11,
    fontFamily: 'Arial Narrow',
    borderTopWidth: 1,
    paddingTop: 4,
    width: 200,
    marginTop: 80,
    textAlign: 'center',
  },
  stroke: {
    fontFamily: 'Arial Narrow Bold',
    fontSize: 11,
  },
  sumilla: {
    borderStyle: 'solid',
    fontSize: 11,
    marginTop: 30,
    fontFamily: 'Arial Narrow',
  },
  attributes: {
    alignItems: 'center',
    borderStyle: 'solid',
    fontSize: 11,
    marginTop: 30,
    fontFamily: 'Arial Narrow',
  },
  attributesText: {
    lineHeight: 1.5,
  },
});
