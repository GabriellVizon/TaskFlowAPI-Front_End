import { StyleSheet } from 'react-native';
import { colors, spacing } from './theme';

export const globalStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  glassPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionPadding: {
    paddingHorizontal: spacing['margin-mobile'],
  },
});
