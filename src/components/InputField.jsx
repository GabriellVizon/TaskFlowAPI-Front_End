import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, fonts } from '../styles/theme';

export default function InputField({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, style, inputStyle }) {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, inputStyle]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors['on-tertiary-container']}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    ...fonts['label-sm'],
    color: colors['on-surface-variant'],
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: colors['surface-container-lowest'],
    color: colors['on-surface'],
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    ...fonts['body-md'],
    borderWidth: 0,
  },
});
