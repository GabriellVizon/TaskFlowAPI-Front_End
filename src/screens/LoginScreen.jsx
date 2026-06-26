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
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBPK-71wt1z40SvgI-zmkeV7uprfNkezYGntG3Ku4gCfAoPjMA_XAAcR327VmkyDpE2yBxUAaQuw131mc-RqEZuNVI1xyz2M0VHQOkhoDXxHDBjaer4CR2mfVNIvFqwFakmuArFw_Ne_jeIRiC3RL6qdN8E5EShDAeqPXan_3d0SmPunKnCYQ3H9f3qcAOeyot20BhhQScZTJpayxCt5LPD_2bBuieeEadWoHs-AziB0LKGwx0DNUDH8MlEUkVsW43uDoloBb7fa-yN';

export default function LoginScreen({ navigation, route }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      const redirectTo = route.params?.redirectTo || 'Home';
      navigation.reset({ index: 0, routes: [{ name: redirectTo }] });
    } catch (e) {
      Alert.alert('Erro', 'E-mail ou senha incorretos.');
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
                <Text style={styles.brandName}>NAVALHA</Text>
                <Text style={styles.brandSubtitle}>TRADITION & PRECISION</Text>
              </View>

              <View style={styles.formCard}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>E-mail</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="nome@email.com"
                    placeholderTextColor={colors['on-tertiary-container']}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>Senha</Text>
                    <TouchableOpacity activeOpacity={0.7}>
                      <Text style={styles.forgotPassword}>Esqueci minha senha</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.passwordWrapper}>
                    <TextInput
                      style={styles.passwordInput}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="••••••••"
                      placeholderTextColor={colors['on-tertiary-container']}
                      secureTextEntry={!passwordVisible}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      onPress={() => setPasswordVisible(!passwordVisible)}
                      style={styles.toggleButton}
                      activeOpacity={0.7}
                    >
                      <MaterialIcons
                        name={passwordVisible ? 'visibility' : 'visibility-off'}
                        size={24}
                        color={colors['on-surface-variant']}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={handleLogin}
                    disabled={loading}
                    activeOpacity={0.8}
                    style={styles.loginButton}
                  >
                    {loading ? (
                      <ActivityIndicator color={colors.black} />
                    ) : (
                      <Text style={styles.loginButtonText}>ENTRAR</Text>
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.signupContainer}>
                  <Text style={styles.signupText}>Ainda não tem conta? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.signupLink}>Cadastre-se</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2024 THE RITUAL BARBER CO.</Text>
          <View style={styles.footerLinks}>
            <TouchableOpacity><Text style={styles.footerLink}>Privacy</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.footerLink}>Terms</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.footerLink}>Location</Text></TouchableOpacity>
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  container: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 40,
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
  brandName: {
    ...fonts['headline-lg'],
    color: colors['on-surface'],
    textTransform: 'uppercase',
    letterSpacing: 3.2,
  },
  brandSubtitle: {
    ...fonts['label-sm'],
    color: colors['on-surface-variant'],
    marginTop: 8,
    letterSpacing: 2,
  },
  formCard: {
    width: '100%',
    backgroundColor: 'rgba(18, 20, 20, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    ...fonts['label-sm'],
    color: colors['on-surface-variant'],
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  forgotPassword: {
    ...fonts['label-sm'],
    color: colors['on-surface-variant'],
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
  passwordWrapper: {
    position: 'relative',
  },
  passwordInput: {
    backgroundColor: colors['surface-container-lowest'],
    color: colors['on-surface'],
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingRight: 52,
    ...fonts['body-md'],
    borderWidth: 0,
  },
  toggleButton: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  buttonContainer: {
    paddingTop: 16,
  },
  loginButton: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  loginButtonText: {
    ...fonts['headline-md'],
    color: colors.black,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 24,
  },
  signupText: {
    ...fonts['body-md'],
    color: colors['on-surface-variant'],
  },
  signupLink: {
    ...fonts['body-md'],
    color: colors.white,
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
    textTransform: 'uppercase',
  },
});
