import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fonts } from '../styles/theme';

export default function PasswordInput({ label, value, onChangeText, placeholder, style }) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.labelRow}>
        {label && <Text style={styles.label}>{label}</Text>}
      </View>
      <View style={styles.wrapper}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors['on-tertiary-container']}
          secureTextEntry={!visible}
          autoCapitalize="none"
        />
        <TouchableOpacity
          onPress={() => setVisible(!visible)}
          style={styles.toggle}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name={visible ? 'visibility' : 'visibility-off'}
            size={24}
            color={colors['on-surface-variant']}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  label: {
    ...fonts['label-sm'],
    color: colors['on-surface-variant'],
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  wrapper: {
    position: 'relative',
  },
  input: {
    backgroundColor: colors['surface-container-lowest'],
    color: colors['on-surface'],
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingRight: 52,
    ...fonts['body-md'],
    borderWidth: 0,
  },
  toggle: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
});
