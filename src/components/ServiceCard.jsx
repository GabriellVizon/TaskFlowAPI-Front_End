import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fonts, spacing } from '../styles/theme';

const iconMap = {
  content_cut: 'content-cut',
  face: 'face',
  scooter: 'pedal-bike',
};

export default function ServiceCard({ icon, price, title, description, duration, tag }) {
  const iconName = iconMap[icon] || 'content-cut';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <MaterialIcons name={iconName} size={32} color={colors.primary} />
        <Text style={styles.price}>{price}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.tags}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{duration}</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{tag}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
    padding: spacing.gutter,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.gutter,
  },
  price: {
    ...fonts['headline-md'],
    color: colors['on-surface'],
  },
  title: {
    ...fonts['headline-lg'],
    color: colors['on-surface'],
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  description: {
    ...fonts['body-md'],
    color: colors['on-surface-variant'],
    marginBottom: spacing.gutter,
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors['outline-variant'],
  },
  tagText: {
    ...fonts['label-sm'],
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors['on-surface'],
  },
});
