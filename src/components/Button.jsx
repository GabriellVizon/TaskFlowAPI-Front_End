import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../styles/theme';

export default function Button({ title, onPress, variant = 'primary', style, textStyle, disabled }) {
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        styles.base,
        isPrimary && styles.primary,
        isOutline && styles.outline,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          isPrimary && styles.primaryText,
          isOutline && styles.outlineText,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  primary: {
    backgroundColor: colors.white,
  },
  outline: {
    borderWidth: 1,
    borderColor: colors.white,
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...fonts['headline-md'],
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  primaryText: {
    color: colors.black,
  },
  outlineText: {
    color: colors.white,
  },
});
