import { View, StyleSheet } from 'react-native';

export default function GlassPanel({ children, style }) {
  return <View style={[styles.panel, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: 'rgba(26, 26, 26, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
});
