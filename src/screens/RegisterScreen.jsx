import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { colors, fonts } from '../styles/theme';

const BACKGROUND_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAZVLgdePnxu_G_sYo7vkQxMzhkWBPI1wkJLU5TuW51jJZLKzyH2uiJdlN-pSYrXe0HFfpFIYYTk9fwQPnroTnaq7sJEgta6DjLl09H1LQapckM1vcJGf3Z3hePlUhUetNQQCMbDow2IoArMGdzsRJfqOeIZf0x0O7Ze7aSAIzvo1Ef7C1eXvsiZ6mUg-2NoWb1J8RzrEl_xPs7OtsCCgKByqTkGzdxkDFrqI6uzHWOITcL4VbxFApVJ2y1TkLAncCnlulp2YUPyiLU';

export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  async function handleRegister() {
    if (!nome || !email || !phone || !password) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      await register(nome, email, phone, password);
      navigation.navigate('Login');
    } catch (e) {
      Alert.alert('Erro', e.message || 'Erro ao registrar. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ImageBackground source={{ uri: BACKGROUND_IMAGE }} style={styles.background}>
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.container}>
              <View style={styles.brandSection}>
                <View style={styles.logoWrapper}>
                  <MaterialIcons name="content-cut" size={40} color={colors.white} />
                </View>
                <Text style={styles.brandSubtitle}>Barbearia Navalha</Text>
              </View>

              <View style={styles.formCard}>
                <View style={styles.formHeader}>
                  <Text style={styles.formTitle}>Criar Conta</Text>
                  <Text style={styles.formDescription}>
                    Comece sua jornada de estilo e tradição.
                  </Text>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nome Completo</Text>
                  <TextInput
                    style={styles.input}
                    value={nome}
                    onChangeText={setNome}
                    placeholder="Ex: Gabriel Silva"
                    placeholderTextColor={colors['on-tertiary-container']}
                    autoCapitalize="words"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>E-mail</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="seu@email.com"
                    placeholderTextColor={colors['on-tertiary-container']}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Número de Telefone</Text>
                  <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="(11) 99999-9999"
                    placeholderTextColor={colors['on-tertiary-container']}
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Senha</Text>
                  <View style={styles.passwordWrapper}>
                    <TextInput
                      style={styles.input}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="********"
                      placeholderTextColor={colors['on-tertiary-container']}
                      secureTextEntry={!passwordVisible}
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                <TouchableOpacity
                  onPress={handleRegister}
                  disabled={loading}
                  activeOpacity={0.8}
                  style={styles.registerButton}
                >
                  {loading ? (
                    <ActivityIndicator color={colors.black} />
                  ) : (
                    <Text style={styles.registerButtonText}>Criar Conta</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.loginContainer}>
                  <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginLink}>
                      Já tem uma conta?{' '}
                      <Text style={styles.loginLinkBold}>Entrar</Text>
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2024 THE RITUAL BARBER CO.</Text>
          <View style={styles.footerLinks}>
            <TouchableOpacity><Text style={styles.footerLink}>Privacidade</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.footerLink}>Termos</Text></TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 48,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoWrapper: {
    width: 96,
    height: 96,
    borderRadius: 4,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  brandSubtitle: {
    ...fonts['label-sm'],
    color: colors['on-surface-variant'],
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  formCard: {
    width: '100%',
    backgroundColor: 'rgba(26, 26, 26, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 32,
  },
  formHeader: {
    marginBottom: 24,
  },
  formTitle: {
    ...fonts['headline-md'],
    color: colors['on-surface'],
    fontWeight: '700',
    marginBottom: 4,
  },
  formDescription: {
    ...fonts['body-md'],
    color: colors['on-surface-variant'],
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    ...fonts['label-sm'],
    color: colors['on-surface-variant'],
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  input: {
    backgroundColor: colors['surface-container-lowest'],
    color: colors['on-surface'],
    borderRadius: 8,
    padding: 12,
    ...fonts['body-md'],
    borderWidth: 0,
  },
  passwordWrapper: {
    position: 'relative',
  },
  registerButton: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    marginTop: 8,
  },
  registerButtonText: {
    ...fonts['headline-md'],
    fontSize: 16,
    color: colors.black,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  loginContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  loginLink: {
    ...fonts['label-sm'],
    color: colors['on-surface-variant'],
  },
  loginLinkBold: {
    color: colors['on-surface'],
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    opacity: 0.6,
  },
  footerText: {
    ...fonts['label-sm'],
    color: colors['on-surface-variant'],
    textTransform: 'uppercase',
  },
  footerLinks: {
    flexDirection: 'row',
    gap: 24,
  },
  footerLink: {
    ...fonts['label-sm'],
    color: colors['on-surface-variant'],
  },
});
