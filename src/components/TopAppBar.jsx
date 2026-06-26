import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { colors, fonts } from '../styles/theme';

export default function TopAppBar({ navigation }) {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, logout } = useAuth();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.inner}>
        <Text style={styles.logo}>NAVALHA</Text>
        <View style={styles.actions}>
          {isAuthenticated ? (
            <>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.iconBtn}
                onPress={() => navigation.navigate('Admin')}
              >
                <MaterialIcons name="admin-panel-settings" size={24} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.linkBtn}
                onPress={() => {
                  logout();
                  navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
                }}
              >
                <MaterialIcons name="logout" size={20} color={colors['on-surface-variant']} />
                <Text style={styles.linkText}>Sair</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.linkBtn}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.linkText}>Entrar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.linkBtn}
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={styles.linkText}>Cadastrar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(18, 20, 20, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(76, 69, 70, 0.3)',
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  inner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    ...fonts['headline-lg'],
    fontSize: 20,
    letterSpacing: -1,
    color: colors['on-surface'],
    textTransform: 'uppercase',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    padding: 4,
  },
  linkBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  linkText: {
    ...fonts['headline-md'],
    fontSize: 16,
    color: colors['on-surface-variant'],
  },
});
